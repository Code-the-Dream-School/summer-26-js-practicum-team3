import { prisma } from "../db.js";
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import util from 'util';
import { StatusCodes } from 'http-status-codes';
import { use } from "react";

const scrypt = util.promisify(crypto.scrypt);
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const cookieFlags = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only when HTTPS is available
    sameSite: "Strict",
  };
};

async function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password, password_hash) {
  const [salt, key] = password_hash.split(':'); 
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  if (keyBuffer.length !== derivedKey.length) {
    return false;
  }

  // helps compare secret values in a way that avoids leaking information through tiny timing differences
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

const setJwtCookie = (req, res, user) => {
  const payload = {
    id: user.id,
    csrfToken: crypto.randomUUID(),
  };
   const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
  res.cookie('jwt', token, { ... cookieFlags(), maxAge: 3600000 }); // 1 hour expiration
  return payload.csrfToken;
}

const register = async (req, res) => {
  const { email, password, name } = req.body ?? {};

  // error handling and basic edge cases -> 400
  if (!email || !EMAIL_REGEX.test(email)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'A valid email is required' });
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
  }
  if (!name || !name.trim()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Name is required' });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: {email} })
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Email already registered' });
    }
    const password_hash = await hashPassword(password);

    const user = await prisma.users.create({
      data: { email, password_hash, name },
    });

    const csrfToken = setJwtCookie(req, res, user);
    return res.status(StatusCodes.CREATED).json({ name: user.name, csrfToken });
  } catch (error) {
    console.error('Registration error - full object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong, please try again' });
 }
};

const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  // error handling and basic edge cases -> 400
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'A valid email is required'
    });
  }
  if (!password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Password is required',
    });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid email or password'
      });
    }
    const passwordMatches = await verifyPassword(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid email or password',
      });
    }
    const csrfToken = setJwtCookie(req, res, user);
    return res.status(StatusCodes.OK).json({
      name: user.name,
      csrfToken,
    });
  } catch(error) {
    console.error('Login error - full object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
     return res
       .status(StatusCodes.INTERNAL_SERVER_ERROR)
       .json({ message: 'Something went wrong, please try again' });
  }
}
export { register, login };

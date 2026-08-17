import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import util from 'util';
import { StatusCodes } from 'http-status-codes';
import { userSchema, loginSchema } from '../validations/joi.input.validations.js';
import { ValidationError, ConflictError, UnauthorizedError } from '../errors/index.js';

const scrypt = util.promisify(crypto.scrypt);
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const cookieFlags = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only when HTTPS is available
    sameSite: 'Strict',
  };
};

async function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `${salt}:${derivedKey.toString('hex')}`;
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
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('jwt', token, { ...cookieFlags(), maxAge: 3600000 }); // 1 hour expiration
  return payload.csrfToken;
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: "Create a new user account."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: "User successfully registered."
 *       400:
 *         description: "Validation error for email, password, or name."
 *       409:
 *         description: "Email already registered."
 *       500:
 *         description: "Server error."
 */
const register = async (req, res) => {
  const { error, value } = userSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  const { email, password, name } = value;

  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) {
      throw new ConflictError('Email already registered');
  }
  
  const password_hash = await hashPassword(password);
  const user = await prisma.users.create({
    data: { email, password_hash, name },
  });
  const csrfToken = setJwtCookie(req, res, user);
  return res.status(StatusCodes.CREATED).json({ name: user.name, csrfToken });
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: "Authenticate a user and set a JWT cookie."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: "Successfully authenticated."
 *       400:
 *         description: "Validation error for email or password."
 *       401:
 *         description: "Invalid email or password."
 *       500:
 *         description: "Server error."
 */
const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }
  
  const { email, password } = value;
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const passwordMatches = await verifyPassword(password, user.password_hash);
  if (!passwordMatches) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const csrfToken = setJwtCookie(req, res, user);
  return res.status(StatusCodes.OK).json({
    name: user.name,
    csrfToken,
  });
}

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: "Clear the JWT cookie, ending the current session. Idempotent - succeeds even if no session exists."
 *     responses:
 *       200:
 *         description: "Successfully logged out."
 */
const logout = (req, res) => {
  res.clearCookie('jwt', cookieFlags());
  return res.status(StatusCodes.OK).json({ message: 'Logged out' });
};

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get the current user's profile
 *     description: "Retrieve the authenticated user's profile information."
 *     responses:
 *      200:
 *       description: "Successfully retrieved user profile."
 *      401:
 *       description: "Unauthorized - user not authenticated."
 *      500:
 *       description: "Server error."
 */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        sex: true,
        dob: true,
        activity_level: true,
        created_at: true,
      },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Error: User not found' });
    }

    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error: Server not responding' });
  }
};

export { register, login, logout, getProfile, hashPassword, verifyPassword };

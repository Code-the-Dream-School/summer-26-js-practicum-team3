import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import util from 'util';

const scrypt = util.promisify(crypto.scrypt);
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
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
  const { email, password, name } = req.body ?? {};

  // error handling and basic edge cases -> 400
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const password_hash = await hashPassword(password);

    const user = await prisma.users.create({
      data: { email, password_hash, name },
    });

    const csrfToken = setJwtCookie(req, res, user);
    return res.status(201).json({ name: user.name, csrfToken });
  } catch (error) {
    console.error(
      'Registration error - full object:',
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    );
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again' });
  }
};

export { register };

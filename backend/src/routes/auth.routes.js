import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
} from '../controllers/auth.controller.js';
import verifyJWT from '../middleware/jwt.middleware.js';

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', register);
// POST /api/v1/auth/login
router.post('/login', login);
// POST /api/v1/auth/logout
router.post('/logout', logout);
// GET /api/auth/profile
router.get('/profile', verifyJWT, getProfile);

export default router;

import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', register);
// POST /api/v1/auth/login
router.post('/login', login);
// POST /api/v1/auth/logout
router.post('/logout', logout);

export default router;

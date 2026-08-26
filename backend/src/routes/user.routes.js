import { Router } from 'express';
import {
  updateOnboardingProfile,
  OnboardingStatus,
} from '../controllers/user.controller.js';
import jwtMiddleware from '../middleware/jwt.middleware.js';

const router = Router();

// PATCH /api/v1/users/me
router.patch('/me', jwtMiddleware, updateOnboardingProfile);
router.get('/me/onboarding-status', jwtMiddleware, OnboardingStatus);
export default router;

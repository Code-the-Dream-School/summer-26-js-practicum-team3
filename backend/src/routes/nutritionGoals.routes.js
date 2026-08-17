import { Router } from 'express';
import { createNutritionGoals } from '../controllers/nutritionGoals.controller.js';
import jwtMiddleware from '../middleware/jwt.middleware.js';

const router = Router();

// POST /api/v1/nutrition-goals
router.post('/', jwtMiddleware, createNutritionGoals);

export default router;

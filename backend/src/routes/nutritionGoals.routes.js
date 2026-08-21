import { Router } from 'express';
import {
  createNutritionGoals,
  getNutritionGoals,
} from '../controllers/nutritionGoals.controller.js';
import jwtMiddleware from '../middleware/jwt.middleware.js';

const router = Router();

// GET /api/v1/nutrition-goals
router.get('/', jwtMiddleware, getNutritionGoals);
// POST /api/v1/nutrition-goals
router.post('/', jwtMiddleware, createNutritionGoals);

export default router;

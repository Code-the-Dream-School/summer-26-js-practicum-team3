import { Router } from 'express';
import {
  getDailyMenu,
  addRecipeToDailyMenu,
  removeRecipeFromDailyMenu,
} from '../controllers/dailyMenu.controller.js';
import jwtMiddleware from '../middleware/jwt.middleware.js';

const router = Router();

// GET /api/v1/daily-menu
router.get('/', jwtMiddleware, getDailyMenu);
// POST /api/v1/daily-menu
router.post('/', jwtMiddleware, addRecipeToDailyMenu);
// DELETE /api/v1/daily-menu/recipes/:id
router.delete('/recipes/:id', jwtMiddleware, removeRecipeFromDailyMenu);

export default router;

import { Router } from 'express';
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controller.js';

import jwtMiddleware from '../middleware/jwt.middleware.js';

const router = Router();

router.get('/', getRecipes);
router.post('/', jwtMiddleware, createRecipe);
router.patch('/:id', jwtMiddleware, updateRecipe);
router.delete('/:id', jwtMiddleware, deleteRecipe);

export default router;

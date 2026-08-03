import { Router } from 'express';
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controller.js';

const router = Router();

router.get('/', getRecipes).post('/', createRecipe);
router.patch('/:id', updateRecipe).delete('/:id', deleteRecipe);

export default router;

import { Router } from 'express';
import {
  getRecipes,
  createRecipe,
  updateRecipe,
} from '../controllers/recipe.controller.js';

const router = Router();

router.get('/', getRecipes);
router.post('/', createRecipe);
router.put('/', updateRecipe);

export default router;

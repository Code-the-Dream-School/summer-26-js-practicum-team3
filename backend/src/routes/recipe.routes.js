import { Router } from 'express';
import { getRecipes, createRecipe } from '../controllers/recipe.controller.js';

const router = Router();

router.get('/', getRecipes);
router.post('/', createRecipe);

export default router;

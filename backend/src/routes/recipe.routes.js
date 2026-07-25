import { Router } from 'express';
import { getRecipes } from '../controllers/recipe.controller.js';

const router = Router();

router.get('/', getRecipes);
router.post('/', createRecipe);

async function createRecipe(req, res) {
  const { title, instructions, ingredients, servings, total_time_minutes } =
    req.body;

  return res.status(201).json({
    title,
    instructions,
    total_time_minutes,
    servings,
    ingredients,
    calories: 134,
    protein: 9,
    fat: 10,
    carbs: 0,
  });
}
export default router;

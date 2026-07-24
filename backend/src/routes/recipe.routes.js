import { Router } from 'express';
import { getRecipes } from '../controllers/getRecipes.controller.js';

const router = Router();

router.get('/', getRecipes);

export default router;

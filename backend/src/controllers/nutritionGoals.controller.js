import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import { nutritionGoalsSchema } from '../validations/joi.input.validations.js';
import { ValidationError, NotFoundError } from '../errors/index.js';

/**
 * @swagger
 * /v1/nutrition-goals:
 *   post:
 *     summary: Create the user's daily nutrition goals
 *     description: "Creates the user's nutrition goals in the database."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calories_target:
 *                 type: integer
 *                 example: 2000
 *               protein_target:
 *                 type: integer
 *                 example: 150
 *               fat_target:
 *                 type: integer
 *                 example: 70
 *               carbs_target:
 *                 type: integer
 *                 example: 250
 *     responses:
 *       201:
 *         description: "Successfully created the nutrition goals."
 *       400:
 *         description: "Invalid or unknown fields in the request body."
 *       401:
 *         description: "No user is authenticated."
 */
export async function createNutritionGoals(req, res) {
  const { goals, activity_level, dob, sex } = req.body;
  const { error, value } = nutritionGoalsSchema.validate(goals, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  const NUTRITION_GOAL_ID = await prisma.nutrition_goals.findFirst({
    where: { user_id: req.user.id },
    select: { id: true },
  });

  value.user_id = req.user.id;

  const createNutritionGoals = await prisma.$transaction(async (tx) => {
    const nutrition_goals_saved = await tx.nutrition_goals.update({
      where: { user_id: value.user_id, id: NUTRITION_GOAL_ID.id },
      data: goals,
    });
    await tx.users.update({
      where: { id: value.user_id },
      data: { dob, sex, activity_level, on_boarding: true },
    });
    return nutrition_goals_saved;
  });

  if (!createNutritionGoals) {
    throw new Error('Failed to create Nutritional Goals');
  }

  res.status(StatusCodes.CREATED).json(createNutritionGoals);
  return;
}

/**
 * @swagger
 * /v1/nutrition-goals:
 *   get:
 *     summary: Get the user's daily nutrition goals
 *     description: "Returns the authenticated user's most recently saved nutrition goals."
 *     responses:
 *       200:
 *         description: "Nutrition goals for the authenticated user."
 *       401:
 *         description: "No user is authenticated."
 *       404:
 *         description: "No nutrition goals have been saved for this user yet."
 */

export async function getNutritionGoals(req, res) {
  const goal = await prisma.nutrition_goals.findFirst({
    where: { user_id: req.user.id },
    orderBy: { id: 'desc' },
  });

  if (!goal) {
    throw new NotFoundError('No nutrition goals found for this user.');
  }

  return res.status(StatusCodes.OK).json({
    id: goal.id,
    calories_target: goal.calories_target,
    protein_target: goal.protein_target,
    fat_target: goal.fat_target,
    carbs_target: goal.carbs_target,
  });
}

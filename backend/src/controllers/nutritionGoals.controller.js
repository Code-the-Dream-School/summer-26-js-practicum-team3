import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import { nutritionGoalsSchema } from '../validations/joi.input.validations.js';
import { ValidationError } from '../errors/index.js';


/**
 * @swagger
 * /v1/nutrition-goals:
 *   post:
 *     summary: Create the user's daily nutrition goals
 *     description: "Stub endpoint - returns the response shape without persisting to the database yet."
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
  const { error, value } = nutritionGoalsSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  const updatedUser = await prisma.users.update({
    where: { id: req.user.id }, // assumes jwtMiddleware sets req.user
    data: {
      nutrition_goals: {
        create: {
          calories_target: value.calories_target,
          protein_target: value.protein_target,
          fat_target: value.fat_target,
          carbs_target: value.carbs_target,
        },
      },
    },
    include: {
      nutrition_goals: {
        orderBy: { id: 'desc' },
        take: 1,
      },
    },
  });
 
  const goal = updatedUser.nutrition_goals[0];
 
  return res.status(StatusCodes.CREATED).json({
    id: goal.id,
    calories_target: goal.calories_target,
    protein_target: goal.protein_target,
    fat_target: goal.fat_target,
    carbs_target: goal.carbs_target,
  });
}

/**
 * @swagger
 * /v1/nutrition-goals:
 *   get:
 *     summary: Get the user's daily nutrition goals
 *     description: "Stub endpoint - returns fixed placeholder goals, not read from the database yet. MEAL-131."
 *     responses:
 *       200:
 *         description: "Nutrition goal baselines for the authenticated user."
 *       401:
 *         description: "No user is authenticated."
 */
export function getNutritionGoals(req, res) {
  return res.status(StatusCodes.OK).json({
    id: null,
    calories_target: 2000,
    protein_target: 50,
    fat_target: 70,
    carbs_target: 275,
  });
}

import { StatusCodes } from 'http-status-codes';
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
export function createNutritionGoals(req, res) {
  const { error, value } = nutritionGoalsSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  const {
    calories_target = null,
    protein_target = null,
    fat_target = null,
    carbs_target = null,
  } = value;

  return res.status(StatusCodes.CREATED).json({
    id: null,
    calories_target,
    protein_target,
    fat_target,
    carbs_target,
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

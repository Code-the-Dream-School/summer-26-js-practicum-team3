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
  const { goals, dob, sex, activity_level } = req.body;

  const { error, value: goalsValue } = nutritionGoalsSchema.validate(
    goals ?? {},
    { abortEarly: false },
  );
  if (error) {
    throw new ValidationError(error.message);
  }

  // only write the profile fields the user actually filled in.
  const profilePatch = { on_boarding: true };
  if (dob) profilePatch.dob = new Date(dob);
  if (sex) profilePatch.sex = sex;
  if (activity_level) profilePatch.activity_level = activity_level;

  const existing = await prisma.nutrition_goals.findFirst({
    where: { user_id: req.user.id },
    select: { id: true },
  });

  const savedGoals = await prisma.$transaction(async (tx) => {
    const nutritionGoals = existing
      ? await tx.nutrition_goals.update({
          where: { id: existing.id },
          data: goalsValue,
        })
      : await tx.nutrition_goals.create({
          data: { ...goalsValue, user_id: req.user.id },
        });

    await tx.users.update({
      where: { id: req.user.id },
      data: profilePatch,
    });

    return nutritionGoals;
  });

  return res.status(StatusCodes.CREATED).json({
    id: savedGoals.id,
    calories_target: savedGoals.calories_target,
    protein_target: savedGoals.protein_target,
    fat_target: savedGoals.fat_target,
    carbs_target: savedGoals.carbs_target,
  });
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

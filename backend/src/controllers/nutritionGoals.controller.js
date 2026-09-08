import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import {
  nutritionGoalsSchema,
  updateUserOnboardingSchema,
} from '../validations/joi.input.validations.js';
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
  const { goals, ...profileFields } = req.body;

  // onboarding always sends `goals`; a missing one is a bad request
  if (!goals) {
    throw new ValidationError('goals is required');
  }

  const { error: goalsError, value: goalsValue } =
    nutritionGoalsSchema.validate(goals, { abortEarly: false });
  if (goalsError) {
    throw new ValidationError(goalsError.message);
  }

  const { error: profileError, value: profile } =
    updateUserOnboardingSchema.validate(profileFields, { abortEarly: false });
  if (profileError) {
    throw new ValidationError(profileError.message);
  }

  // only write the profile fields the user actually filled in ("" / null skipped).
  const profilePatch = { on_boarding: true };
  if (profile.dob) profilePatch.dob = profile.dob; // Joi already coerced to Date
  if (profile.sex) profilePatch.sex = profile.sex;
  if (profile.activity_level) {
    profilePatch.activity_level = profile.activity_level;
  }

  const existing = await prisma.nutrition_goals.findFirst({
    where: { user_id: req.user.id },
    select: { id: true },
  });

  const savedGoals = await prisma.$transaction(async (tx) => {
    // Registration seeds a nutrition_goals row, so `existing` is normally set.
    // Users created before have none, so create it if it's missing.
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

import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import {
  nutritionGoalsSchema,
  updateUserOnboardingSchema,
} from '../validations/joi.input.validations.js';
import { ValidationError, NotFoundError } from '../errors/index.js';

const GOALS_RESPONSE_FIELDS = {
  id: true,
  calories_target: true,
  protein_target: true,
  fat_target: true,
  carbs_target: true,
};

/**
 * @swagger
 * /nutrition-goals:
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

  const existingUserGoals = await prisma.nutrition_goals.findFirst({
    where: { user_id: req.user.id },
    select: { id: true },
  });

  const savedGoals = await prisma.$transaction(async (tx) => {
    const nutritionGoals = existingUserGoals
      ? await tx.nutrition_goals.update({
          where: { id: existingUserGoals.id },
          data: goalsValue,
          select: GOALS_RESPONSE_FIELDS,
        })
      // older users have no seeded row - create it if it's missing
      : await tx.nutrition_goals.create({
          data: { ...goalsValue, user_id: req.user.id },
          select: GOALS_RESPONSE_FIELDS,
        });

    await tx.users.update({
      where: { id: req.user.id },
      data: profilePatch,
    });

    return nutritionGoals;
  });

  return res.status(StatusCodes.CREATED).json({ savedGoals });
}

/**
 * @swagger
 * /nutrition-goals:
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
    select: GOALS_RESPONSE_FIELDS,
  });

  if (!goal) {
    throw new NotFoundError('No nutrition goals found for this user.');
  }

  return res.status(StatusCodes.OK).json({ goal });
}

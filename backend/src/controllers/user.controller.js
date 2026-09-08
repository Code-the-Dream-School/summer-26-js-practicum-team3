import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import {
  updateUserProfileSchema,
  nutritionGoalsSchema,
} from '../validations/joi.input.validations.js';
import { ValidationError, NotFoundError } from '../errors/index.js';

/**
 * @swagger
 * /v1/users/me:
 *   patch:
 *     summary: Save onboarding profile details (DOB, sex, activity level)
 *     description: "Saves DOB, sex, and activity level to the users table."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dob:
 *                 type: string
 *                 example: "1990-05-14"
 *               sex:
 *                 type: string
 *                 enum: [male, female, prefer_not_to_say]
 *                 example: "male"
 *               activity_level:
 *                 type: string
 *                 example: "moderately_active"
 *     responses:
 *       200:
 *         description: "Successfully updated the onboarding profile fields."
 *       400:
 *         description: "Invalid or unknown fields in the request body."
 *       401:
 *         description: "No user is authenticated."
 */
export async function updateProfile(req, res) {
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
    updateUserProfileSchema.validate(profileFields, { abortEarly: false });
  if (profileError) {
    throw new ValidationError(profileError.message);
  }

  // only write the profile fields the user actually filled in ("" / null skipped).
  const profilePatch = {};
  if (profile.dob) profilePatch.dob = profile.dob; // Joi already coerced to Date
  if (profile.sex) profilePatch.sex = profile.sex;
  if (profile.activity_level) {
    profilePatch.activity_level = profile.activity_level;
  }

  const existing_nutrition_goals = await prisma.nutrition_goals.findFirst({
    where: { user_id: req.user.id },
    select: { id: true },
  });

  const updatedUser = await prisma.$transaction(async (tx) => {
    // Registration seeds a nutrition_goals row, so `existing` is normally set.
    // Users created before have none, so create it if it's missing.
    const nutritionGoals = existing_nutrition_goals
      ? await tx.nutrition_goals.update({
          where: { id: existing_nutrition_goals.id },
          data: goalsValue,
          select: {
            calories_target: true,
            carbs_target: true,
            fat_target: true,
            protein_target: true,
          },
        })
      : await tx.nutrition_goals.create({
          data: { ...goalsValue, user_id: req.user.id },
          select: {
            calories_target: true,
            carbs_target: true,
            fat_target: true,
            protein_target: true,
          },
        });

    const savedUserInfo = await tx.users.update({
      where: { id: req.user.id },
      data: profilePatch,
      select: { name: true, email: true, dob: true, sex: true },
    });

    return { ...savedUserInfo, ...nutritionGoals };
  });
  console.log('*************************');
  console.log('Profile updating on server\n', updatedUser);
  console.log('*************************');

  return res.status(StatusCodes.CREATED).json(updatedUser);
}

/**
 * @swagger
 * /v1/users/me/onboarding-status:
 *   get:
 *     summary: Get the user's onboarding completion status
 *     description: "Returns whether the authenticated user has completed onboarding."
 *     responses:
 *       200:
 *         description: "Onboarding status for the authenticated user."
 *       401:
 *         description: "No user is authenticated."
 *       404:
 *         description: "User not found."
 */
export async function OnboardingStatus(req, res) {
  const resp = await prisma.users.findUnique({
    where: { id: req.user.id },
    select: { on_boarding: true },
  });

  if (!resp) {
    throw new NotFoundError('User not found.');
  }

  return res.status(StatusCodes.OK).json(resp);
}

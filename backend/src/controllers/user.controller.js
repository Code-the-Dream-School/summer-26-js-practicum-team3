import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import { updateUserProfile } from '../validations/joi.input.validations.js';
import { ValidationError, NotFoundError } from '../errors/index.js';

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update the current user's profile
 *     description: "Updates the authenticated user's profile. `email` and `name` are required on every call; `dob`, `sex`, and `activity_level` are optional and may be sent as \"\" or null to leave them unset. Used by the Profile page."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               dob:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "1990-05-14"
 *               sex:
 *                 type: string
 *                 enum: [male, female, prefer_not_to_say]
 *                 nullable: true
 *                 example: "female"
 *               activity_level:
 *                 type: string
 *                 enum: [sedentary, lightly_active, moderately_active, very_active]
 *                 nullable: true
 *                 example: "moderately_active"
 *     responses:
 *       200:
 *         description: "The updated profile: email, name, sex, dob, activity_level."
 *       400:
 *         description: "Missing required fields or invalid values in the request body."
 *       401:
 *         description: "No user is authenticated."
 */
export async function updateProfile(req, res) {
  const { error, value } = updateUserProfile.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  let updatedUser = await prisma.users.update({
    where: { id: req.user.id },
    data: value,
    select: {
      email: true,
      name: true,
      sex: true,
      dob: true,
      activity_level: true,
    },
  });

  if (!updatedUser) {
    throw new Error('User Updates failed');
  }

  return res.status(StatusCodes.OK).json(updatedUser);
}

/**
 * @swagger
 * /users/me/onboarding-status:
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

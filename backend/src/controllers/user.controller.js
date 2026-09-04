import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import { updateUserProfile } from '../validations/joi.input.validations.js';
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
  const { error, value } = updateUserProfile.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  let updatedUser = await prisma.users.update({
    where: { id: req.user.id },
    data: value,
  });

  if (!updatedUser) {
    throw new Error('User Updates failed');
  }

  return res.status(StatusCodes.OK).json(updatedUser);
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

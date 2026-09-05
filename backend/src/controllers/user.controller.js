import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import { updateMeSchema } from '../validations/joi.input.validations.js';
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
export async function updateOnboardingProfile(req, res) {
  const { error, value } = updateMeSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  const data = {};
  if (value.dob) data.dob = value.dob;
  if (value.sex) data.sex = value.sex;
  if (value.activity_level) data.activity_level = value.activity_level;

  const updatedUser = await prisma.users.update({
    where: { id: req.user.id },
    data,
    select: { dob: true, sex: true, activity_level: true },
  });

  return res.status(StatusCodes.OK).json({
    dob: updatedUser.dob?.toISOString().split('T')[0] ?? null,
    sex: updatedUser.sex,
    activity_level: updatedUser.activity_level,
  });
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
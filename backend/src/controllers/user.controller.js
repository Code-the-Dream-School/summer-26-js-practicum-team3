import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import { updateMeSchema } from '../validations/joi.input.validations.js';
import { ValidationError } from '../errors/index.js';
/**
 * @swagger
 * /v1/users/me:
 *   patch:
 *     summary: Save onboarding profile details (DOB, sex, activity level)
 *     description: "Stub endpoint - returns the response shape without persisting to the database yet."
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
 *       401:
 *         description: "No user is authenticated."
 */
export async function updateProfile(req, res) {
  const { error, value } = updateMeSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  const updatedUser = await prisma.users.update({
    where: { id: req.user.id },
    data: value,
  });
  if (!updatedUser) {
    throw new Error('User Updates failed');
  }
  return res.status(StatusCodes.OK).json(updatedUser);
}

export async function OnboardingStatus(req, res) {
  const resp = await prisma.users.findUnique({
    where: { id: req.user.id },
    select: { on_boarding: true },
  });

  return res.status(StatusCodes.OK).json(resp);
}

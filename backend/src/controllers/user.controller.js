import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';

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
export function updateOnboardingProfile(req, res) {
  const { dob = null, sex = null, activity_level = null } = req.body ?? {};

  return res.status(StatusCodes.OK).json({
    dob,
    sex,
    activity_level,
  });
}

export async function OnboardingStatus(req, res) {
  const resp = await prisma.users.findUnique({
    where: { id: req.user.id },
    select: { on_boarding: true },
  });

  return res.status(StatusCodes.OK).json(resp);
}

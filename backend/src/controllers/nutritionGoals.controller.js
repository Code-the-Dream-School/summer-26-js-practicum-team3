import { StatusCodes } from 'http-status-codes';

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
 *       401:
 *         description: "No user is authenticated."
 */
export function createNutritionGoals(req, res) {
  const {
    calories_target = null,
    protein_target = null,
    fat_target = null,
    carbs_target = null,
  } = req.body ?? {};

  return res.status(StatusCodes.CREATED).json({
    id: null,
    user_id: req.user.id,
    calories_target,
    protein_target,
    fat_target,
    carbs_target,
  });
}

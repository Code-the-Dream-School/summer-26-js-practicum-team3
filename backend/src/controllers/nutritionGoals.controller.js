import { StatusCodes } from 'http-status-codes';
import { prisma } from '../db.js';
import { nutritionGoalsSchema } from '../validations/joi.input.validations.js';
import { ValidationError } from '../errors/index.js';

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
  const { goals, activityLevel, dob, sex } = req.body;
  const { error, value } = nutritionGoalsSchema.validate(goals, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  // if (activityLevel || dob || sex) {
  //   let multiplier = 1;
  //   if (activityLevel) {
  //     switch (activityLevel) {
  //       case 'lightly_active':
  //         multiplier += 0.15;
  //         break;
  //       case 'moderately_active':
  //         multiplier += 0.27;
  //         break;
  //       case 'very_active':
  //         multiplier += 0.4;
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  //     if (dob) {
  //      const age = figureOutAge()
  //       if (age >= 18 && age <= 25) {
  //     multiplier += 0.1;
  //   } else if (age <= 35) {
  //     multiplier += 0.05;
  //   } else if (age <= 45) {
  //     // no adjustment
  //   } else if (age <= 55) {
  //     multiplier -= 0.05;
  //   } else if (age <= 65) {
  //     multiplier -= 0.1;
  //   } else {
  //     multiplier -= 0.15;
  //   }
  // }
  //   if (sex) {
  //     switch (sex) {
  //       case 'male':
  //         multiplier += 0.05;
  //         break;
  //       case 'female':
  //         multiplier -= 0.05;
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }
  // after all this we multiply the macro values to get their new goals
  // someone else can figure out the dob problem, heres the rest
  value.user_id = req.user.id;

  const createNutritionGoals = await prisma.nutrition_goals.create({
    data: value,
  });
  if (!createNutritionGoals) {
    throw new Error('Failed to create Nutritional Goals');
  }
  res.status(StatusCodes.CREATED).json(createNutritionGoals);
  return;
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
    const DEFAULT_BASE_MACROS = {
      calories: 2000,
      protein: 50,
      fat: 75,
      carbs: 270,
    };
    const updatedUser = await prisma.users.update({
      where: { id: req.user.id }, // assumes jwtMiddleware sets req.user
      data: {
        nutrition_goals: {
          create: {
            calories_target: DEFAULT_BASE_MACROS.calories,
            protein_target: DEFAULT_BASE_MACROS.protein,
            fat_target: DEFAULT_BASE_MACROS.fat,
            carbs_target: DEFAULT_BASE_MACROS.carbs,
          },
        },
      },
      include: {
        nutrition_goals: {
          orderBy: { id: 'desc' },
          take: 1,
        },
      },
    });

    const goal = updatedUser.nutrition_goals[0];
    return res.status(StatusCodes.OK).json({
      id: goal.id,
      calories_target: goal.calories_target,
      protein_target: goal.protein_target,
      fat_target: goal.fat_target,
      carbs_target: goal.carbs_target,
    });
  }

  return res.status(StatusCodes.OK).json({
    id: goal.id,
    calories_target: goal.calories_target,
    protein_target: goal.protein_target,
    fat_target: goal.fat_target,
    carbs_target: goal.carbs_target,
  });
}

import { prisma } from '../db.js';
import { StatusCodes } from 'http-status-codes';
import {
  recipeSchema,
  patchRecipeSchema,
} from '../validations/joi.input.validations.js';

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get a list of recipes
 *     description: Fetch recipes with pagination. You can also search by title, sort by nutrition facts, and filter recipes based on nutritional goals. Filtering kicks in only when `calories` is provided, and it expects `protein`, `carbs`, and `fat` alongside it. Daily targets are divided by three meals per day before filtering.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number you want to view.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of recipes per page.
 *       - in: query
 *         name: find
 *         schema:
 *           type: string
 *         description: Type a word to search recipe titles.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: calories
 *           enum: [protein, carbs, fat, calories]
 *         description: Pick a nutrition field to sort the results.
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           default: asc
 *           enum: [asc, desc]
 *         description: Sort going up (asc) or down (desc).
 *       - in: query
 *         name: calories
 *         schema:
 *           type: integer
 *           example: 2000
 *         description: Daily calorie target. Turns nutrition filtering on.
 *       - in: query
 *         name: protein
 *         schema:
 *           type: integer
 *           example: 50
 *         description: Daily protein target. Used only when `calories` is set.
 *       - in: query
 *         name: carbs
 *         schema:
 *           type: integer
 *           example: 275
 *         description: Daily carbohydrate target. Used only when `calories` is set.
 *       - in: query
 *         name: fat
 *         schema:
 *           type: integer
 *           example: 70
 *         description: Daily fat target. Used only when `calories` is set.
 *     responses:
 *       200:
 *         description: A list of recipes and pagination details.
 *       400:
 *         description: Invalid pagination parameters (negative page or limit).
 *       404:
 *         description: No recipes met the search criteria.
 *       500:
 *         description: Server error.
 */
export async function getRecipes(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (page < 0 || limit < 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid page number', error: 'Improper Paging' });
    return;
  }

  const whereClause = {};

  whereClause.title = req.query.find ?? null;

  function formattingMacros(num) {
    const MEALS_PER_DAY = 3;
    const singleMealValue = parseInt(num) / MEALS_PER_DAY;
    return Math.floor(singleMealValue);
  }

  whereClause.calories = req.query.calories
    ? formattingMacros(req.query.calories)
    : 667;
  whereClause.carbs = req.query.carbs ? formattingMacros(req.query.carbs) : 23;
  whereClause.fat = req.query.fat ? formattingMacros(req.query.fat) : 83;
  whereClause.protein = req.query.protein
    ? formattingMacros(req.query.protein)
    : 50;

  const searchPattern = whereClause.title ? `%${whereClause.title}%` : '%';
  const exactMatch = whereClause.title ? whereClause.title : '%';
  const startsWith = whereClause.title ? `${whereClause.title}%` : '%';

  let recipes = null;
  let total = null;

  recipes = await prisma.$queryRaw`
SELECT 
id,
instructions,
ingredients,
total_time_minutes,
servings,
title,
calories,
fat,
protein,
carbs
  FROM recipes
  WHERE title ILIKE ${searchPattern} 
  ORDER BY 
    CASE 
      WHEN title ILIKE ${exactMatch} THEN 1
      WHEN title ILIKE ${startsWith} THEN 2
      WHEN title ILIKE ${searchPattern} THEN 3
      ELSE 4
       END,
CASE WHEN calories <= ${Math.floor(whereClause.calories)} THEN 1 ELSE 0 END
+ CASE WHEN protein >= ${Math.floor(whereClause.protein)} THEN 1 ELSE 0 END
+ CASE WHEN fat <= ${Math.floor(whereClause.fat)} THEN 1 ELSE 0 END
+ CASE WHEN carbs >= ${Math.floor(whereClause.carbs)} THEN 1 ELSE 0 END
    DESC
    LIMIT ${parseInt(limit)}
    OFFSET ${parseInt(skip)}
`;

  const totalResult = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS count
    FROM recipes
    WHERE title ILIKE ${searchPattern}
  `;
  total = totalResult[0].count;

  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };

  if (recipes.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: 'No recipes could be found',
      message: 'No recipes meet the search criteria',
    });
    return;
  }

  res.status(StatusCodes.OK).json({
    recipes,
    search: whereClause.title,
    count: recipes.length,
    pagination,
  });
  return;
}

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: "Adds a recipe owned by the authenticated user. Auth is the `jwt` cookie plus a matching `X-CSRF-TOKEN` header."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Spicy Garlic Chicken"
 *               instructions:
 *                 type: string
 *                 example: "1. Chop chicken. 2. Cook chicken."
 *               ingredients:
 *                 type: string
 *                 example: "Chicken, Garlic, Spices"
 *               total_time_minutes:
 *                 type: integer
 *                 example: 30
 *               servings:
 *                 type: integer
 *                 example: 4
 *               calories:
 *                 type: integer
 *                 example: 450
 *               fat:
 *                 type: integer
 *                 example: 15
 *               protein:
 *                 type: integer
 *                 example: 35
 *               carbs:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: The recipe was successfully created.
 *       400:
 *         description: Invalid or missing fields in the request body.
 *       401:
 *         description: No user is authenticated, or the CSRF token is missing or invalid.
 *       500:
 *         description: Server or database connection error.
 */
export async function createRecipe(req, res) {
  const { error, value } = recipeSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  value.user_id = req.user.id;

  let newRecipeCreated = null;

  newRecipeCreated = await prisma.recipes.create({
    data: value,
    select: {
      id: true,
      instructions: true,
      ingredients: true,
      total_time_minutes: true,
      servings: true,
      title: true,
      calories: true,
      fat: true,
      protein: true,
      carbs: true,
    },
  });

  res.status(StatusCodes.CREATED).json(newRecipeCreated);
  return;
}

/**
 * @swagger
 * /recipes/{id}:
 *   patch:
 *     summary: Update an existing recipe
 *     description: "Modifies a recipe owned by the authenticated user. Auth is the `jwt` cookie plus a matching `X-CSRF-TOKEN` header."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The ID of the recipe you want to update."
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Spicy Garlic Chicken (Updated)"
 *               instructions:
 *                 type: string
 *                 example: "1. Chop chicken. 2. Cook chicken. 3. Serve hot."
 *               ingredients:
 *                 type: string
 *                 example: "Chicken, Garlic, Spices, Extra Love"
 *               total_time_minutes:
 *                 type: integer
 *                 example: 35
 *               servings:
 *                 type: integer
 *                 example: 4
 *               calories:
 *                 type: integer
 *                 example: 450
 *               fat:
 *                 type: integer
 *                 example: 15
 *               protein:
 *                 type: integer
 *                 example: 35
 *               carbs:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: "The recipe was successfully updated."
 *       400:
 *         description: "Invalid recipe ID or invalid fields in the request body."
 *       401:
 *         description: "No user is authenticated, or the CSRF token is missing or invalid."
 *       404:
 *         description: "No recipe with that ID belongs to the authenticated user."
 */
export async function updateRecipe(req, res) {
  const { error, value } = patchRecipeSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }

  const recipeIndex = parseInt(req.params?.id);
  const user_id = req.user.id;

  if ((recipeIndex < 0) | (user_id < 0)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Validation Error', error: 'invalid id' });
    return;
  }

  value.user_id = user_id;

  let updatedRecipe = null;

  updatedRecipe = await prisma.recipes.update({
    where: {
      id: recipeIndex,
      user_id: user_id,
    },
    data: value,
    select: {
      id: true,
      instructions: true,
      ingredients: true,
      total_time_minutes: true,
      servings: true,
      title: true,
      calories: true,
      fat: true,
      protein: true,
      carbs: true,
    },
  });

  res.status(StatusCodes.OK).json(updatedRecipe);
  return;
}

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     description: "Removes a recipe owned by the authenticated user. Auth is the `jwt` cookie plus a matching `X-CSRF-TOKEN` header."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The ID of the recipe you want to delete."
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: "The recipe was successfully deleted."
 *       400:
 *         description: "Invalid recipe ID."
 *       401:
 *         description: "No user is authenticated, or the CSRF token is missing or invalid."
 *       404:
 *         description: "No recipe with that ID belongs to the authenticated user."
 */
export async function deleteRecipe(req, res) {
  const recipeIndex = parseInt(req.params?.id);
  const user_id = req.user.id;

  if ((recipeIndex < 0) | (user_id < 0)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Validation Error', error: 'invalid id' });
    return;
  }

  await prisma.recipes.delete({
    where: {
      id: recipeIndex,
      user_id: user_id,
    },
  });

  res.status(StatusCodes.NO_CONTENT).end();
}

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
 *     description: Fetch recipes with pagination. You can also search by title and sort by nutrition facts.
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
 *           default: 9
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
 *           enum: [protein, carbs, fat, calories]
 *         description: Pick a nutrition field to sort the results.
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort going up (asc) or down (desc).
 *     responses:
 *       200:
 *         description: A list of recipes and pagination details.
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

  if (req.query.find) {
    whereClause.title = {
      contains: req.query.find,
      mode: 'insensitive',
    };
  }
  let recipes = null;
  let total = null;

  function getOrderBy(query) {
    const validSortFields = ['protein', 'carbs', 'fat', 'calories'];
    const sortBy = query.sortBy || 'calories';
    const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

    if (validSortFields.includes(sortBy)) {
      return { [sortBy]: sortDirection };
    }

    return { created_at: sortDirection };
  }

  recipes = await prisma.recipes.findMany({
    where: whereClause,
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
    skip: skip,
    take: limit,
    orderBy: getOrderBy(req.query),
  });

  total = await prisma.recipes.count({ where: whereClause });

  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };

  if (recipes.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: 'No recipes could be found',
      message: 'No recipes meet the search criteria',
    });
    return;
  }

  res.status(StatusCodes.OK).json({ recipes, pagination });
  return;
}

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: "JWT Token to pull the request user ID (Note: hardcoded for now, but will be required later)"
 *         required: false
 *         schema:
 *           type: string
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
 *   put:
 *     summary: Update an existing recipe
 *     description: "Modify an existing recipe in the database."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The ID of the recipe you want to update."
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         description: "JWT Token to pull the request user ID (Note: hardcoded for now, but will be required later)"
 *         required: false
 *         schema:
 *           type: string
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
 *         description: "Validation error or database connection issue."
 */
export async function updateRecipe(req, res, next) {
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
 *     description: "Remove a recipe from the database."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The ID of the recipe you want to delete."
 *         schema:
 *           type: integer
 *       - in: header
 *         name: Authorization
 *         description: "JWT Token to pull the request user ID (Note: hardcoded for now, but will be required later)"
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: "The recipe was successfully deleted."
 *       400:
 *         description: "Validation error or database connection issue."
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

import { prisma } from '../db.js';
import { StatusCodes } from 'http-status-codes';
import { dailyMenuRecipeSchema } from '../validations/joi.input.validations.js';
import { ValidationError, NotFoundError } from '../errors/index.js';

// Same field set recipe.controller.js already selects for /recipes,
// so a recipe looks the same whether it's coming from the catalog
// or from a daily menu entry, we do not leak user_id/created_at.
const RECIPE_SELECT = {
  id: true,
  title: true,
  instructions: true,
  ingredients: true,
  total_time_minutes: true,
  servings: true,
  calories: true,
  fat: true,
  protein: true,
  carbs: true,
};

function toDailyMenuResponse(dailyMenu) {
  if (!dailyMenu) {
    return { id: null, recipes: [] };
  }

  return {
    id: dailyMenu.id,
    recipes: dailyMenu.daily_menu_recipes.map(({ id, recipes }) => ({
      daily_menu_recipe_id: id,
      ...recipes,
    })),
  };
}

/**
 * @swagger
 * /v1/daily-menu:
 *   get:
 *     summary: Get the user's current daily menu
 *     description: "Returns the user's daily menu with assigned recipes and their macros in one query, or an empty menu if nothing has been added yet."
 *     responses:
 *       200:
 *         description: "The user's daily menu."
 *       401:
 *         description: "No user is authenticated."
 */
export async function getDailyMenu(req, res) {
  const dailyMenu = await prisma.daily_menus.findFirst({
    where: { user_id: req.user.id },
    orderBy: { created_at: 'desc' },
    include: {
      daily_menu_recipes: {
        include: { recipes: { select: RECIPE_SELECT } },
      },
    },
  });

  return res.status(StatusCodes.OK).json(toDailyMenuResponse(dailyMenu));
}

/**
 * @swagger
 * /v1/daily-menu:
 *   post:
 *     summary: Add a recipe to the user's current daily menu
 *     description: "Creates the user's daily menu entry first if one doesn't exist yet, then assigns the recipe to it."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipe_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: "The recipe was added to the daily menu."
 *       400:
 *         description: "Invalid or missing recipe_id."
 *       401:
 *         description: "No user is authenticated."
 *       404:
 *         description: "Recipe not found."
 */
export async function addRecipeToDailyMenu(req, res) {
  const { error, value } = dailyMenuRecipeSchema.validate(req.body ?? {}, {
    abortEarly: false,
  });
  if (error) {
    throw new ValidationError(error.message);
  }

  const { recipe_id } = value;

  const recipe = await prisma.recipes.findUnique({ where: { id: recipe_id } });
  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }

  // Wrapped in a transaction so two concurrent adds (double-click, two tabs)
  // can't both see "no daily menu yet" and each create their own row.
  const dailyMenuRecipe = await prisma.$transaction(async (tx) => {
    let dailyMenu = await tx.daily_menus.findFirst({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' },
    });

    if (!dailyMenu) {
      dailyMenu = await tx.daily_menus.create({
        data: { user_id: req.user.id },
      });
    }

    return tx.daily_menu_recipes.create({
      data: {
        daily_menu_id: dailyMenu.id,
        recipe_id,
      },
      include: { recipes: { select: RECIPE_SELECT } },
    });
  });

  return res.status(StatusCodes.CREATED).json({
    daily_menu_recipe_id: dailyMenuRecipe.id,
    ...dailyMenuRecipe.recipes,
  });
}

/**
 * @swagger
 * /v1/daily-menu/recipes/{id}:
 *   delete:
 *     summary: Remove a recipe from the user's current daily menu
 *     description: "Removes one recipe assignment from today's daily menu selections."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The daily_menu_recipe id (not the recipe id) to remove."
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: "The recipe was removed from the daily menu."
 *       400:
 *         description: "Invalid id."
 *       401:
 *         description: "No user is authenticated."
 *       404:
 *         description: "No matching daily menu recipe found for this user."
 */
export async function removeRecipeFromDailyMenu(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('Invalid daily menu recipe id');
  }

  const dailyMenuRecipe = await prisma.daily_menu_recipes.findUnique({
    where: { id },
    include: { daily_menus: { select: { user_id: true } } },
  });

  // Same 404 whether the row doesn't exist or belongs to another user -
  // don't leak which one it is.
  if (!dailyMenuRecipe || dailyMenuRecipe.daily_menus.user_id !== req.user.id) {
    throw new NotFoundError('Daily menu recipe not found');
  }

  await prisma.daily_menu_recipes.delete({ where: { id } });

  return res.status(StatusCodes.NO_CONTENT).end();
}

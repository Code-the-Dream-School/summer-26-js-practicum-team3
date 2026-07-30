import { prisma } from '../db.js';
/**
 * We are sending back a hard coded array of recipes
 * so that the front end can continue with develping
 * under the proper API
 */
const MOCK_RECIPE_DATA = [
  {
    title: 'How to Cook Bacon in the Oven',
    instructions: 'https://www.allrecipes.com/recipe/267904/oven-baked-bacon',
    total_time_minutes: 35,
    servings: 6,
    calories: 134,
    protein: 9,
    fat: 10,
    carbs: 0,
    ingredients: '1 (16 ounce) package bacon',
  },
  {
    title: 'Boiled Peanuts',
    instructions: 'https://www.allrecipes.com/recipe/17551/boiled-peanuts/',
    total_time_minutes: 185,
    servings: 40,
    calories: 322,
    protein: 15,
    fat: 28,
    carbs: 9,
    ingredients:
      '5 pounds raw peanuts, in shells, 1 cup salt, or to taste, water to cover',
  },
  {
    id: 967,
    user_id: 1,
    title: 'Manicotti Pancakes II',
    instructions:
      'https://www.allrecipes.com/recipe/20566/manicotti-pancakes-ii/',
    total_time_minutes: 15,
    servings: 12,
    calories: 66,
    protein: 3,
    fat: 2,
    carbs: 9,
    ingredients: '3  eggs, 1 cup milk, 1 cup all-purpose flour',
  },
];

export async function getRecipes(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

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
    const sortBy = query.sortBy || 'created_at';
    const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

    if (validSortFields.includes(sortBy)) {
      return { [sortBy]: sortDirection };
    }

    return { created_at: sortDirection };
  }

  try {
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
  } catch (error) {
    console.log('Error in get catch', error);
  }

  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };

  if (recipes.length === 0) {
    return res.status(404).json({
      error: 'No recipes could be found',
      message: 'No recipes meet the search criteria',
    });
  }

  return res.status(200).json({ recipes, pagination });
}

export async function createRecipe(req, res) {
  // if (!req.user.id) {
  //   return res
  //     .status(404)
  //     .json({ error: 'Bad Request', message: 'Need a user' });
  // }

  //This will be replaced with validations later
  const cleanedData = normalizeData(req.body);

  // cleanedData.user_id = req?.user?.id;
  cleanedData.user_id = 1;

  let newRecipeCreated = null;
  try {
    newRecipeCreated = await prisma.recipes.create({
      data: cleanedData,
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
    console.log('Marker hit without error', newRecipeCreated);
  } catch (error) {
    console.log('Create Recipe catch', error);
    res.status(500).json({
      error: error.message,
      message: 'Server/Database Connection Error',
    });
  }
  // return res.status(201).json(newRecipeCreated);
  return res.status(201).json(newRecipeCreated);
}

export async function updateRecipe(req, res) {
  res.status(200).json({ message: 'Handler being created' });
}

const normalizeData = (reqBody) => {
  const holder = {};
  for (let propName in reqBody) {
    const value = reqBody[propName];
    if (isNaN(value)) {
      holder[propName] = value.trim();
    } else {
      holder[propName] = Math.trunc(value);
    }
  }
  return holder;
};

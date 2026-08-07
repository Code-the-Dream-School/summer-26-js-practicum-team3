import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/db.js'; // Adjust path to your Prisma client instance

describe('GET /api/v1/recipes - Success Cases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/v1/recipes defaults', () => {
    const mockRecipes = [
      {
        id: '1',
        title: 'Chicken Rice',
        instructions: 'Cook chicken and rice',
        ingredients: 'chicken, rice',
        total_time_minutes: 30,
        servings: 2,
        calories: 500,
        fat: 10,
        protein: 40,
        carbs: 60,
      },
    ];

    it('returns status 200 and the list of recipes', async () => {
      vi.spyOn(prisma.recipes, 'findMany').mockResolvedValue(mockRecipes);
      vi.spyOn(prisma.recipes, 'count').mockResolvedValue(1);
      expect.assertions(2);
      const res = await request(app).get('/api/v1/recipes');

      expect(res.status).toBe(200);
      expect(res.body.recipes).toEqual(mockRecipes);
    });

    it('calculates default pagination numbers correctly', async () => {
      vi.spyOn(prisma.recipes, 'findMany').mockResolvedValue(mockRecipes);
      vi.spyOn(prisma.recipes, 'count').mockResolvedValue(1);

      const res = await request(app).get('/api/v1/recipes');

      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 9,
        total: 1,
        pages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });
  });

  describe('GET /api/v1/recipes with query filters', () => {
    const mockRecipes = [
      {
        id: '2',
        title: 'High Protein Salad',
        instructions: 'Mix greens and protein',
        ingredients: 'greens, tofu',
        total_time_minutes: 10,
        servings: 1,
        calories: 300,
        fat: 5,
        protein: 25,
        carbs: 15,
      },
    ];

    let res;
    let findManySpy;
    let countSpy;

    beforeEach(async () => {
      findManySpy = vi
        .spyOn(prisma.recipes, 'findMany')
        .mockResolvedValue(mockRecipes);
      countSpy = vi.spyOn(prisma.recipes, 'count').mockResolvedValue(10);

      res = await request(app).get('/api/v1/recipes').query({
        find: 'Salad',
        page: '2',
        limit: '5',
        sortBy: 'protein',
        sortDirection: 'asc',
      });
    });

    it('should pass search filters to Prisma where clause', () => {
      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            title: { contains: 'Salad', mode: 'insensitive' },
          },
        }),
      );

      expect(countSpy).toHaveBeenCalledWith({
        where: {
          title: { contains: 'Salad', mode: 'insensitive' },
        },
      });
    });

    it('should calculate skip and take for pagination', () => {
      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5, // (page 2 - 1) * limit 5
          take: 5,
        }),
      );
    });

    it('should pass sorting rules to Prisma', () => {
      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { protein: 'asc' },
        }),
      );
    });

    it('should return 200 with formatted pagination metadata', () => {
      expect(res.status).toBe(200);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 10,
        pages: 2,
        hasNext: false,
        hasPrev: true,
      });
    });
  });
});

describe('GET /api/v1/recipes - Failure Cases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 404 when no recipes are found matching the criteria', async () => {
    // Return an empty array to simulate no matches
    vi.spyOn(prisma.recipes, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.recipes, 'count').mockResolvedValue(0);

    const res = await request(app)
      .get('/api/v1/recipes')
      .query({ find: 'NonExistentRecipe' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: 'No recipes could be found',
      message: 'No recipes meet the search criteria',
    });
  });

  it('should return 400 with Prisma error details when a database operation fails', async () => {
    // Simulate a Prisma throw inside the try/catch block
    const mockError = new Error('Database connection failed');
    vi.spyOn(prisma.recipes, 'findMany').mockRejectedValue(mockError);

    const res = await request(app).get('/api/v1/recipes');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Prisma Error',
      error: 'Database connection failed',
    });
  });

  it('should return 404 when page parameter is negative', async () => {
    const res = await request(app).get('/api/v1/recipes').query({ page: -5 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: 'Invalid page number',
      error: 'Improper Paging',
    });
  });
});

describe('POST /api/v1/recipes - Success Cases', () => {
  const inputData = {
    title: 'Spaghetti Bolognese',
    instructions: 'Boil pasta, cook meat, mix together.',
    ingredients: 'pasta, ground beef, tomato sauce',
    total_time_minutes: 30,
    servings: 4,
    calories: 600,
    fat: 20,
    protein: 30,
    carbs: 70,
  };

  const mockCreatedRecipe = {
    id: '101',
    ...inputData,
  };

  let res;
  let createSpy;

  beforeEach(async () => {
    vi.restoreAllMocks();

    createSpy = vi
      .spyOn(prisma.recipes, 'create')
      .mockResolvedValue(mockCreatedRecipe);

    res = await request(app).post('/api/v1/recipes').send(inputData);
  });

  it('should return status 201 Created', () => {
    expect(res.status).toBe(201);
  });

  it('should return the created recipe in the response body', () => {
    expect(res.body).toEqual(mockCreatedRecipe);
  });

  it('should attach user_id and pass correct select fields to Prisma', () => {
    expect(createSpy).toHaveBeenCalledWith({
      data: expect.objectContaining({
        ...inputData,
        user_id: 1,
      }),
      select: expect.objectContaining({
        id: true,
        title: true,
      }),
    });
  });
});

describe('POST /api/v1/recipes - Failure Cases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 with Prisma error message when database creation fails', async () => {
    const mockError = new Error('Field title is missing');
    vi.spyOn(prisma.recipes, 'create').mockRejectedValue(mockError);

    const invalidInput = {
      instructions: 'Cook something without a title',
    };

    const res = await request(app).post('/api/v1/recipes').send(invalidInput);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Prisma Error',
      error: 'Field title is missing',
    });
  });
});

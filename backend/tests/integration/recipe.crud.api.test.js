import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';
import { prisma } from '../../src/db.js'; // Adjust path to your Prisma client instance

// jwtMiddleware now protects POST/PATCH/DELETE on /api/v1/recipies, so these requests
// need a valid jwt cookie and matching CSRF header to get pass it.
// user_id:1 - here matches the user_id the existind assertions below expect.

process.env.JWT_SECRET = 'test-secret';
const CSRF_TOKEN = 'test-csrf-token';
const authToken = jwt.sign(
  { id: 1, csrfToken: CSRF_TOKEN },
  process.env.JWT_SECRET,
  { expiresIn: '1h' },
);

function withAuth(req) {
  return req.set('Cookie', `jwt=${authToken}`).set('X-CSRF-TOKEN', CSRF_TOKEN);
}

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
        limit: 10,
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

  it('should return 500 with Prisma error details when a database operation fails', async () => {
    // Simulate a Prisma throw inside the try/catch block
    const mockError = new Error('Database connection failed');
    vi.spyOn(prisma.recipes, 'findMany').mockRejectedValue(mockError);

    const res = await request(app).get('/api/v1/recipes');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'Database connection failed',
    });
  });

  it('should return 404 when page parameter is negative', async () => {
    const res = await request(app).get('/api/v1/recipes').query({ page: -5 });

    expect(res.status).toBe(400);
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

    res = await withAuth(request(app).post('/api/v1/recipes')).send(inputData);
  });

  it('should return status 201 Created', () => {
    console.log(res.status);
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

    const res = await withAuth(request(app).post('/api/v1/recipes')).send(
      invalidInput,
    );

    expect(res.status).toBe(400);
    //this is only thing returned via prisma error.
    expect(res.body).toEqual({
      message: '"title" is required',
    });
  });
});

describe('PATCH /api/v1/recipes/:id - Success Cases', () => {
  const recipeId = 5;
  const updatePayload = {
    title: 'Updated Chicken Curry',
    instructions: 'Update Instructions',
    total_time_minutes: 45,
  };

  const mockUpdatedRecipe = {
    id: recipeId,
    title: 'Updated Chicken Curry',
    instructions: 'Cook curry with chicken',
    ingredients: 'chicken, curry paste, coconut milk',
    total_time_minutes: 45,
    servings: 4,
    calories: 550,
    fat: 15,
    protein: 35,
    carbs: 40,
  };

  let res;
  let updateSpy;

  beforeEach(async () => {
    vi.restoreAllMocks();

    updateSpy = vi
      .spyOn(prisma.recipes, 'update')
      .mockResolvedValue(mockUpdatedRecipe);

    res = await withAuth(
      request(app).patch(`/api/v1/recipes/${recipeId}`),
    ).send(updatePayload);
  });

  it('should return status 200 OK', () => {
    expect(res.status).toBe(200);
  });

  it('should return the updated recipe in the response body', () => {
    expect(res.body).toEqual(mockUpdatedRecipe);
  });

  it('should enforce user ownership in the Prisma where clause', () => {
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: recipeId,
          user_id: 1,
        },
      }),
    );
  });

  it('should pass updated fields and select payload to Prisma', () => {
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Updated Chicken Curry',
          total_time_minutes: 45,
          user_id: 1,
        }),
      }),
    );
  });
});

describe('PATCH /api/v1/recipes/:id - Failure Cases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 when an invalid negative ID parameter is provided', async () => {
    const res = await withAuth(request(app).patch('/api/v1/recipes/-5')).send({
      title: 'Invalid Recipe ID Update',
      instructions: 'These are required as well',
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Validation Error',
      error: 'invalid id',
    });
  });

  it('should return 500 with Prisma error details when update fails or record does not exist', async () => {
    const mockPrismaError = new Error('Record to update not found.');
    vi.spyOn(prisma.recipes, 'update').mockRejectedValue(mockPrismaError);

    const res = await withAuth(request(app).patch('/api/v1/recipes/999')).send({
      title: 'Non-existent Recipe',
      instructions: 'These are required as well',
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'Record to update not found.',
    });
  });
});

describe('DELETE /api/v1/recipes/:id - Success Cases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should delete a recipe and return 204 No Content', async () => {
    const recipeId = 12;

    const deleteSpy = vi
      .spyOn(prisma.recipes, 'delete')
      .mockResolvedValue({ id: recipeId, user_id: 1 });

    const res = await withAuth(
      request(app).delete(`/api/v1/recipes/${recipeId}`),
    );

    expect(res.status).toBe(204);
    expect(res.text).toBe('');

    // Verify Prisma delete arguments
    expect(deleteSpy).toHaveBeenCalledWith({
      where: {
        id: recipeId,
        user_id: 1,
      },
    });
  });
});

describe('DELETE /api/v1/recipes/:id - Failure Cases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 when an invalid negative ID parameter is provided', async () => {
    const res = await withAuth(request(app).delete('/api/v1/recipes/-3'));

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Validation Error',
      error: 'invalid id',
    });
  });

  it('should return 500 with Prisma error details when deletion fails or record does not exist', async () => {
    const mockPrismaError = new Error('Record to delete does not exist.');
    vi.spyOn(prisma.recipes, 'delete').mockRejectedValue(mockPrismaError);

    const res = await withAuth(request(app).delete('/api/v1/recipes/999'));

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'Record to delete does not exist.',
    });
  });
});

import { describe, it, expect } from 'vitest';
import Joi from 'joi';
import {
  userSchema,
  recipeSchema,
  patchRecipeSchema,
  nutritionGoalsSchema,
} from '../../src/validations/joi.input.validations';

describe('User Schema Validation', () => {
  const baseValidUser = {
    email: 'test@example.com',
    name: 'John Doe',
    password: 'Password123!',
  };

  it('should pass with a valid email format', () => {
    const validData = { ...baseValidUser };

    const { error } = userSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail with an invalid email format', () => {
    const invalidData = {
      ...baseValidUser,
      email: 'not-an-email',
    };
    expect.assertions(2);
    const { error } = userSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.message).toContain('"email" must be a valid email');
  });

  it('should pass with a valid strong password', () => {
    const validData = { ...baseValidUser };

    const { error } = userSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail if password missing special character or number', () => {
    const invalidData = {
      ...baseValidUser,
      password: 'nocapitalsornumbers',
    };
    expect.assertions(2);
    const { error } = userSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.message).toContain(
      'Password must be at least 8 characters long',
    );
  });

  it('should pass with a valid name length', () => {
    const validData = { ...baseValidUser };

    const { error } = userSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail if name is too short', () => {
    const invalidData = {
      ...baseValidUser,
      name: 'Jo',
    };
    expect.assertions(2);
    const { error } = userSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.message).toContain(
      '"name" length must be at least 3 characters long',
    );
  });

  it('Success: accepts a valid ISO date string (YYYY-MM-DD)', () => {
    const input = {
      name: 'Buddy',
      email: 'something@email.com',
      password: 'Stephen@13',
      dob: '1990-05-15',
    };
    const { value, error } = userSchema.validate(input);
    expect.assertions(2);
    expect(error).toBeUndefined();
    expect(value.dob).toBeInstanceOf(Date); // Joi converts ISO string to Date object
  });

  it('Failure: rejects an invalid date string format', () => {
    const input = {
      name: 'Buddy',
      email: 'something@email.com',
      password: 'Stephen@13',
      dob: '15-05-1990',
    }; // Not ISO format
    const { error } = userSchema.validate(input);
    expect.assertions(2);
    expect(error).toBeDefined();
    expect(error.message).toContain('must be in ISO 8601 date format');
  });

  it('Success: accepts one of the allowed option strings', () => {
    const input = {
      name: 'Buddy',
      email: 'something@email.com',
      password: 'Stephen@13',
      dob: '1990-05-15',
      sex: 'female',
    };
    const { value, error } = userSchema.validate(input);
    expect.assertions(2);
    expect(error).toBeUndefined();
    expect(value.sex).toBe('female');
  });

  it('Failure: rejects an option not in the allowed list', () => {
    const input = {
      name: 'Buddy',
      email: 'something@email.com',
      password: 'Stephen@13',
      dob: '1990-05-15',
      sex: 'Other',
    };
    const { error } = userSchema.validate(input);
    expect.assertions(2);
    expect(error).toBeDefined();
    expect(error.message).toContain(
      '"sex" must be one of [male, female, prefer_not_to_say, , null]',
    );
  });

  it('Success: accepts one of the allowed activity_level values', () => {
    const input = {
      name: 'Buddy',
      email: 'something@email.com',
      password: 'Stephen@13',
      dob: '1990-05-15',
      activity_level: 'moderately_active',
    };
    const { value, error } = userSchema.validate(input);
    expect.assertions(2);
    expect(error).toBeUndefined();
    expect(value.activity_level).toBe('moderately_active');
  });

  it('Failure: rejects an activity_level not in the allowed list', () => {
    const input = {
      name: 'Buddy',
      email: 'something@email.com',
      password: 'Stephen@13',
      dob: '1990-05-15',
      activity_level: 'Moderate',
    };
    const { error } = userSchema.validate(input);
    expect.assertions(2);
    expect(error).toBeDefined();
    expect(error.message).toContain(
      '"activity_level" must be one of [sedentary, lightly_active, moderately_active, very_active, , null]',
    );
  });
});

describe('Recipe Schema Validation', () => {
  it('should pass with fully valid data', () => {
    const validData = {
      total_time_minutes: 45,
      title: 'Cake',
      instructions: 'Mix and bake.',
      ingredients: 'Flour, water, yeast.',
    };

    expect.assertions(3);

    const { error, value } = recipeSchema.validate(validData);

    expect(error).toBeUndefined();
    expect(value.total_time_minutes).toBe(45);
    expect(value.ingredients).toContain('water');
  });

  it('should fail when fields are explicit empty string in required field', () => {
    const nullData = {
      total_time_minutes: 45,
      title: '',
      instructions: 'Mix and bake.',
      ingredients: 'Flour, water, yeast.',
    };

    expect.assertions(2);

    const { error, value } = recipeSchema.validate(nullData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('title');
  });

  it('should pass when unrequired fields are empty strings', () => {
    const emptyStringData = {
      title: 'is required',
      instructions: 'this is required',
      ingredients: '',
    };

    expect.assertions(2);

    const { error, value } = recipeSchema.validate(emptyStringData);

    expect(error).toBeUndefined();
    expect(value.ingredients).toBe('');
  });

  it('should fail if total_time_minutes exceeds 999', () => {
    const badData = {
      title: 'Bake to long',
      instructions: 'This takes a long time',
      total_time_minutes: 1000,
    };

    const { error } = recipeSchema.validate(badData);

    expect(error).toBeDefined();
    expect(error.details[0].message).toContain(
      'must be less than or equal to 999',
    );
  });
});

describe('Patch Recipe Schema Validation', () => {
  const baseValidPatch = {
    title: 'Spaghetti Carbonara',
    instructions: 'Boil pasta, fry guanciale, mix with egg and cheese.',
    ingredients: 'Pasta, eggs, guanciale, pecorino',
    total_time_minutes: 20,
    servings: 12,
    protein: 25,
    carbs: 60,
    calories: 650,
    fat: 30,
  };

  it('should pass when all numeric fields are valid integers within boundaries', () => {
    const validData = { ...baseValidPatch };
    expect.assertions(6);
    const { error, value } = patchRecipeSchema.validate(validData);

    expect(error).toBeUndefined();
    expect(value.total_time_minutes).toBe(20);
    expect(value.protein).toBe(25);
    expect(value.carbs).toBe(60);
    expect(value.calories).toBe(650);
    expect(value.fat).toBe(30);
  });

  it('should fail if any numeric field goes below 1 or exceeds 999', () => {
    const invalidData = {
      ...baseValidPatch,
      total_time_minutes: 1000,
      servings: 0,
    };

    const { error } = patchRecipeSchema.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('should pass when title meets the minimum length requirement', () => {
    const validData = {
      ...baseValidPatch,
      title: 'Pie',
    };

    const { error } = patchRecipeSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail if title length is below 3 characters', () => {
    const invalidData = {
      ...baseValidPatch,
      title: 'Yo',
    };

    const { error } = patchRecipeSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.message).toContain(
      '"title" length must be at least 3 characters long',
    );
  });

  it('should fail if instructions length is below 3 characters', () => {
    const invalidData = {
      ...baseValidPatch,
      instructions: 'Do',
    };

    const { error } = patchRecipeSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.message).toContain(
      '"instructions" length must be at least 3 characters long',
    );
  });
});

describe('Testing onboarding Joi validation', () => {
  const validGoal = {
    fat_target: 15.3,
    calories_target: 250,
    protein_target: 35.8,
    carbs_target: '100',
  };
  describe('Successful OnBoarding Validation Testing', () => {
    it('Successful goal object, rounding down fat', () => {
      const { value, error } = nutritionGoalsSchema.validate(validGoal);
      expect.assertions(2);
      expect(error).toBeUndefined();
      expect(value.fat_target).toBe(15);
    });

    it('Successful goal object, round up protien', () => {
      const { value, error } = nutritionGoalsSchema.validate(validGoal);
      expect.assertions(2);
      expect(error).toBeUndefined();
      expect(value.protein_target).toBe(36);
    });

    it('Successful goal object, converts string to number', () => {
      const { value, error } = nutritionGoalsSchema.validate(validGoal);
      expect.assertions(2);
      expect(error).toBeUndefined();
      expect(value.carbs_target).toBeTypeOf('number');
    });
  });
  describe('Invalid OnBoarding Validation Tests', () => {
    it('Throws Error when user_id is sent in the body (it must come from the JWT, not the client)', () => {
      const invalid = { ...validGoal, user_id: 5 };
      const { error } = nutritionGoalsSchema.validate(invalid);
      expect.assertions(1);
      expect(error.details[0].message).toContain('"user_id" is not allowed');
    });

    it('Throws Error for non-numeric string(carbs)', () => {
      const invalidStringValue = { ...validGoal, carbs: 'something' };
      const { value, error } =
        nutritionGoalsSchema.validate(invalidStringValue);
      console.log(error);
      expect.assertions(2);
      expect(value.carbs).toBeTypeOf('string');
      expect(error.details[0].message).toContain('carbs');
    });
  });
});

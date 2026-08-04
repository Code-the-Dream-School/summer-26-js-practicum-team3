import { describe, it, expect } from 'vitest';
import Joi from 'joi';
import {
  userSchema,
  recipeSchema,
  patchRecipeSchema,
} from './joi.input.validations';

/****************
 ***USER TEST***
 *****************/
import { describe, it, expect } from 'vitest';
import { userSchema } from './joi.input.validations.js'; // Adjust path if needed

// COPY AND PASTE THIS BASE OBJECT INSIDE YOUR TESTS
const baseValidUser = {
  email: 'test@example.com',
  name: 'John Doe',
  password: 'Password123!',
};

describe('User Schema Validation', () => {
  it('should pass with a valid email format', () => {
    const validData = { ...baseValidUser }; // Copy base object directly

    const { error } = userSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail with an invalid email format', () => {
    const invalidData = {
      ...baseValidUser,
      email: 'not-an-email', // Modifying just the email field
    };

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
      name: 'Jo', // Less than the min(3) limit in your schema
    };

    const { error } = userSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.message).toContain(
      '"name" length must be at least 3 characters long',
    );
  });
});

/****************
 ***RECIPE TEST***
 *****************/
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

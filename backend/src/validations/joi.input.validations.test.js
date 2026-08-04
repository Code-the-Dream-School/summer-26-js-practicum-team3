import { describe, it, expect } from 'vitest';
import Joi from 'joi';
import {
  userSchema,
  recipeSchema,
  patchRecipeSchema,
} from './joi.input.validations';

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

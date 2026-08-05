import Joi from 'joi';

/**
 * @typedef {object} userSchema
 * @prop {string} email - REQUIRED.
 * @prop {string} name - REQUIRED.
 * @prop {string} password - REQUIRED. Password must be at least 8 characters long
 *  and include upper and lower case letters, a number, and a special character
 */
const userSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  name: Joi.string().trim().min(3).max(30).required(),
  password: Joi.string()
    .trim()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long and include upper and lower case letters, a number, and a special character.',
    }),
});

/**
 * @typedef {object} recipeSchema
 * @prop {string} title - REQUIRED.
 * @prop {string} instructions - REQUIRED.
 * @prop {string|null} [ingredients] - Optional. Can be empty or null.
 * @prop {number|null} [total_time_minutes] - Optional. Number between 1 and 999.
 * @prop {number|null} [servings] - Optional. Number between 1 and 999.
 * @prop {number|null} [protein] - Optional. Number between 1 and 999.
 * @prop {number|null} [carbs] - Optional. Number between 1 and 999.
 * @prop {number|null} [calories] - Optional. Number between 1 and 9999.
 * @prop {number|null} [fat] - Optional. Number between 1 and 999.
 */
const recipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),
  instructions: Joi.string().trim().min(3).max(5000).required(),
  ingredients: Joi.string().trim().min(3).max(3000).allow('', null),
  total_time_minutes: Joi.number().integer().min(1).max(999).allow('', null),
  servings: Joi.number().integer().min(1).max(999).allow('', null),
  protein: Joi.number().integer().min(1).max(999).allow('', null),
  carbs: Joi.number().integer().min(1).max(999).allow('', null),
  calories: Joi.number().integer().min(1).max(9999).allow('', null),
  fat: Joi.number().integer().min(1).max(999).allow('', null),
});

/**
 * @typedef {object} patchRecipeSchema
 * @prop {string} title - REQUIRED.
 * @prop {string} instructions - REQUIRED.
 * @prop {string|null} [ingredients] - Optional. Can be empty or null.
 * @prop {number|null} [total_time_minutes] - Optional. Number between 1 and 999.
 * @prop {number|null} [servings] - Optional. Number between 1 and 999.
 * @prop {number|null} [protein] - Optional. Number between 1 and 999.
 * @prop {number|null} [carbs] - Optional. Number between 1 and 999.
 * @prop {number|null} [calories] - Optional. Number between 1 and 9999.
 * @prop {number|null} [fat] - Optional. Number between 1 and 999.
 */
const patchRecipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),
  instructions: Joi.string().trim().min(3).max(5000).required(),
  ingredients: Joi.string().trim().min(3).max(3000).allow('', null),
  total_time_minutes: Joi.number().integer().min(1).max(999).allow('', null),
  servings: Joi.number().integer().min(1).max(999).allow('', null),
  protein: Joi.number().integer().min(1).max(999).allow('', null),
  carbs: Joi.number().integer().min(1).max(999).allow('', null),
  calories: Joi.number().integer().min(1).max(9999).allow('', null),
  fat: Joi.number().integer().min(1).max(999).allow('', null),
})
  .min(1)
  .message('No attributes to change were specified.');

export { userSchema, recipeSchema, patchRecipeSchema };

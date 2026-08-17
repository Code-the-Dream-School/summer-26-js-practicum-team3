import Joi from 'joi';

/**
 * @typedef {object} userSchema
 * @prop {string} email - REQUIRED.
 * @prop {string} name - REQUIRED.
 * @prop {string} dob - Date Of Birth. allows ''|null
 * @prop {string} sex - one of male|female|prefer_not_to_say) . allows ''|null
 * @prop {string} activity_level - one of sedentary|lightly_active|moderately_active|very_active. allows ''|null
 * @prop {string} password - REQUIRED. Password must be at least 8 characters
 *  long and include upper and lower case letters, a number, and a special
 *  character
 */
const userSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  name: Joi.string().trim().min(3).max(30).required(),
  dob: Joi.date().iso().allow('', null), //yyyy-mm-dd
  sex: Joi.string()
    .valid('male', 'female', 'prefer_not_to_say')
    .allow('', null),
  activity_level: Joi.string()
    .valid('sedentary', 'lightly_active', 'moderately_active', 'very_active')
    .allow('', null),
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
 * @typedef {object} loginSchema 
 * @prop {string} email - REQUIRED.
 * @prop {string} password - REQUIRED. No strength rules here -
 *  login only checks the credentials that were already accepted at
 *  registration time, it doesn't re-validate password strength.
 */
const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
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
  total_time_minutes: Joi.number().integer().min(1).max(999).allow(null),
  servings: Joi.number().integer().min(1).max(999).allow(null),
  protein: Joi.number().integer().min(1).max(999).allow(null),
  carbs: Joi.number().integer().min(1).max(999).allow(null),
  calories: Joi.number().integer().min(1).max(9999).allow(null),
  fat: Joi.number().integer().min(1).max(999).allow(null),
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
  total_time_minutes: Joi.number().integer().min(1).max(999).allow(null),
  servings: Joi.number().integer().min(1).max(999).allow(null),
  protein: Joi.number().integer().min(1).max(999).allow(null),
  carbs: Joi.number().integer().min(1).max(999).allow(null),
  calories: Joi.number().integer().min(1).max(9999).allow(null),
  fat: Joi.number().integer().min(1).max(999).allow(null),
})
  .min(1)
  .message('No attributes to change were specified.');

/**
 *
 * @typedef {object} nutritionGoalsSchema
 * @prop {number} - fat_target for tailored recipes
 * @prop {number} - calories_target for tailored recipes
 * @prop {number} - protein_target for tailored recipes
 * @prop {number} - carbs_target for tailored recipes
 */
const nutritionGoalsSchema = Joi.object({
  fat_target: Joi.number().precision(0).integer().min(0).allow(null),
  calories_target: Joi.number().precision(0).integer().min(0).allow(null),
  protein_target: Joi.number().precision(0).integer().min(0).allow(null),
  carbs_target: Joi.number().precision(0).integer().min(0).allow(null),
});

export { userSchema, loginSchema, recipeSchema, patchRecipeSchema, nutritionGoalsSchema };

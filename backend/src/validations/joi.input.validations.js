import Joi from 'joi';

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

const recipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),
  instructions: Joi.string().trim().min(3).max(30).required(),
  ingredients: Joi.string().trim().min(3).max(30).allow('', null),
  total_time_minutes: Joi.number().integer().min(1).max(999).allow('', null),
  servings: Joi.number().integer().min(1).max(999).allow('', null),
  protein: Joi.number().integer().min(1).max(999).allow('', null),
  carbs: Joi.number().integer().min(1).max(999).allow('', null),
  calories: Joi.number().integer().min(1).max(9999).allow('', null),
  fat: Joi.number().integer().min(1).max(999).allow('', null),
});

const patchRecipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),
  instructions: Joi.string().trim().min(3).max(30).required(),
  ingredients: Joi.string().trim().min(3).max(30).allow('', null),
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

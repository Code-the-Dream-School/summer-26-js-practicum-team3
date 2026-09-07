// Recipe form validation — mirrors recipeSchema in the backend
// (backend/src/validations/joi.input.validations.js). Keep the two in sync.

function validateTitle(title) {
  const trimmed = title.trim();
  if (trimmed === '') return 'Title is required.';
  if (trimmed.length < 3 || trimmed.length > 30)
    return 'Title must be 3-30 characters.';
  return null;
}

function validateInstructions(instructions) {
  const trimmed = instructions.trim();
  if (trimmed === '') return 'Instructions are required.';
  if (trimmed.length < 3 || trimmed.length > 5000)
    return 'Instructions must be 3-5000 characters.';
  return null;
}

function validateIngredients(ingredients) {
  const trimmed = ingredients.trim();
  if (trimmed === '') return null;
  if (trimmed.length < 3 || trimmed.length > 3000)
    return 'Ingredients must be 3-3000 characters.';
  return null;
}

function validateServings(servings) {
  const trimmed = String(servings).trim();
  if (trimmed === '') return null;

  const number = Number(trimmed);
  if (!Number.isInteger(number)) return 'Servings must be a whole number.';
  if (number < 1 || number > 999) return 'Servings must be between 1 and 999.';
  return null;
}

function validateTotalTime(total_time_minutes) {
  const trimmed = String(total_time_minutes).trim();
  if (trimmed === '') return null;

  const number = Number(trimmed);
  if (!Number.isInteger(number)) return 'Cook time must be a whole number.';
  if (number < 1 || number > 999)
    return 'Cook time must be between 1 and 999 minutes.';
  return null;
}

function validateCalories(calories) {
  const trimmed = String(calories).trim();
  if (trimmed === '') return null;

  const number = Number(trimmed);
  if (!Number.isInteger(number)) return 'Calories must be a whole number.';
  if (number < 1 || number > 9999)
    return 'Calories must be between 1 and 9999.';
  return null;
}

function validateProtein(protein) {
  const trimmed = String(protein).trim();
  if (trimmed === '') return null;

  const number = Number(trimmed);
  if (!Number.isInteger(number)) return 'Protein must be a whole number.';
  if (number < 1 || number > 999)
    return 'Protein must be between 1 and 999 grams.';
  return null;
}

function validateCarbs(carbs) {
  const trimmed = String(carbs).trim();
  if (trimmed === '') return null;

  const number = Number(trimmed);
  if (!Number.isInteger(number)) return 'Carbs must be a whole number.';
  if (number < 1 || number > 999)
    return 'Carbs must be between 1 and 999 grams.';
  return null;
}

function validateFat(fat) {
  const trimmed = String(fat).trim();
  if (trimmed === '') return null;

  const number = Number(trimmed);
  if (!Number.isInteger(number)) return 'Fat must be a whole number.';
  if (number < 1 || number > 999) return 'Fat must be between 1 and 999 grams.';
  return null;
}

// Form field name -> its validator.
const FIELD_VALIDATORS = {
  title: validateTitle,
  instructions: validateInstructions,
  ingredients: validateIngredients,
  servings: validateServings,
  total_time_minutes: validateTotalTime,
  calories: validateCalories,
  protein: validateProtein,
  carbs: validateCarbs,
  fat: validateFat,
};

// Fields the backend stores as numbers; everything else stays a string.
const NUMERIC_FIELDS = [
  'servings',
  'total_time_minutes',
  'calories',
  'protein',
  'carbs',
  'fat',
];

// { field: message } for every invalid field, empty object when the form is valid.
function validateRecipe(formData) {
  const errors = {};
  for (const [name, value] of Object.entries(formData)) {
    const validate = FIELD_VALIDATORS[name];
    const message = validate ? validate(value ?? '') : null;
    if (message) {
      errors[name] = message;
    }
  }
  return errors;
}

// Request body: trim strings, drop empty optional fields, numeric strings -> Number.
// Run validateRecipe first.
function toRecipePayload(formData) {
  const payload = {};
  for (const [name, value] of Object.entries(formData)) {
    const raw = typeof value === 'string' ? value.trim() : value;
    if (raw === '' || raw == null) continue;
    payload[name] = NUMERIC_FIELDS.includes(name) ? Number(raw) : raw;
  }
  return payload;
}

export {
  validateTitle,
  validateInstructions,
  validateIngredients,
  validateServings,
  validateTotalTime,
  validateCalories,
  validateProtein,
  validateCarbs,
  validateFat,
  NUMERIC_FIELDS,
  validateRecipe,
  toRecipePayload,
};

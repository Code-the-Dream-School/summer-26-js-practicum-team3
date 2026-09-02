import { baseFetch } from '../utils/api-helper';

const BASE_URL = 'http://localhost:8080/api/v1';

async function patchUserProfile(formData, csrfToken) {
  const body = {};
  if (formData.dob) body.dob = formData.dob;
  if (formData.sex) body.sex = formData.sex;
  if (formData.activityLevel) body.activity_level = formData.activityLevel;

  return baseFetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify(body),
  });
}

async function postNutritionGoals(formData, csrfToken) {
  return baseFetch(`${BASE_URL}/nutrition-goals`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify({
      calories_target: formData.goals.calories,
      protein_target: formData.goals.protein,
      fat_target: formData.goals.fat,
      carbs_target: formData.goals.carbs,
    }),
  });
}
export async function saveOnboarding(formData, csrfToken) {
  const hasProfileFields = formData.dob || formData.sex || formData.activityLevel;
  const hasGoalsFields = formData.goals && (
    formData.goals.calories || formData.goals.protein ||
    formData.goals.fat || formData.goals.carbs
  );

  const calls = [];
  if (hasProfileFields) calls.push(patchUserProfile(formData, csrfToken));
  if (hasGoalsFields) calls.push(postNutritionGoals(formData, csrfToken));

  if (calls.length === 0) return null;
  const results = await Promise.all(calls);
  return results[results.length - 1];
}

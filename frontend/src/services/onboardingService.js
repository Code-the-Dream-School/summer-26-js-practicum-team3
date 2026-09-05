const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_URL = `${API_ORIGIN}/api/v1`;
 
async function patchUserProfile(formData, csrfToken) {
  const body = {};
  if (formData.dob) body.dob = formData.dob;
  if (formData.sex) body.sex = formData.sex;
  if (formData.activityLevel) body.activity_level = formData.activityLevel;
 
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify(body),
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Could not save profile details.');
    }
 
    return data;
  } catch (error) {
    throw new Error(error.message || 'Could not save profile details.');
  }
}
 
async function postNutritionGoals(formData, csrfToken) {
  try {
    const response = await fetch(`${BASE_URL}/nutrition-goals`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({
        calories_target: formData.goals.calories_target,
        protein_target: formData.goals.protein_target,
        fat_target: formData.goals.fat_target,
        carbs_target: formData.goals.carbs_target,
      }),
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Could not save nutrition goals.');
    }
 
    return data;
  } catch (error) {
    throw new Error(error.message || 'Could not save nutrition goals.');
  }
}
 
export async function saveOnboarding(formData, csrfToken) {
  const hasProfileFields = formData.dob || formData.sex || formData.activityLevel;
 
  const calls = [postNutritionGoals(formData, csrfToken)];
  if (hasProfileFields) {
    calls.push(patchUserProfile(formData, csrfToken));
  }
 
  const [goalsResult] = await Promise.all(calls);
  return goalsResult;
}
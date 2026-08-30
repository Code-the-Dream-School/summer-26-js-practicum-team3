const BASE_URL = 'http://localhost:8080/api/v1'; 

async function patchUserProfile(formData, csrfToken) {
 
  const body = {};
  if (formData.dob) body.dob = formData.dob;
  if (formData.sex) body.sex = formData.sex;
  if (formData.activityLevel) body.activity_level = formData.activityLevel;

    const res = await fetch(`${BASE_URL}/users/me`,{
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || errorBody.message || 'Could not save profile details.');
  }

  return res.json();
}

async function postNutritionGoals(formData, csrfToken) {
  const res = await fetch(`${BASE_URL}/nutrition-goals`, {
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

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || errorBody.message || 'Could not save nutrition goals.');
  }

  return res.json();
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
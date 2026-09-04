import { baseFetch } from '../utils/api-helper';

// async function patchUserProfile(formData, csrfToken) {
//   const body = {
//     dob: formData.dob,
//     sex: formData.sex,
//     activity_level: formData.activityLevel,
//   };
//   // if (formData.dob)
//   // if (formData.sex)
//   // if (formData.activityLevel)

//   return baseFetch(`${BASE_URL}/users/me`, {
//     method: 'PATCH',
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-CSRF-TOKEN': csrfToken,
//     },
//     body: JSON.stringify(body),
//   });
// }

// async function postNutritionGoals(formData, csrfToken) {
//   return baseFetch(`${BASE_URL}/nutrition-goals`, {
//     method: 'POST',
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-CSRF-TOKEN': csrfToken,
//     },
//     body: JSON.stringify({
//       calories_target: formData.goals.calories,
//       protein_target: formData.goals.protein,
//       fat_target: formData.goals.fat,
//       carbs_target: formData.goals.carbs,
//     }),
//   });
// }
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_PATH = `${API_ORIGIN}/api/v1/nutrition-goals`;

export async function saveOnboarding(formData, csrfToken) {
  const dateOFBirth = formData.dob ? new Date(formData.dob).toISOString() : '';

  const updateUser = {
    dob: dateOFBirth,
    sex: formData.sex,
    activity_level: formData.activityLevel,
  };

  const usersGoals = {
    calories_target: formData.goals.calories_target,
    protein_target: formData.goals.protein_target,
    fat_target: formData.goals.fat_target,
    carbs_target: formData.goals.carbs_target,
  };

  const body = { ...updateUser, goals: usersGoals };

  console.log('*******BODY*******');
  console.log(body);

  return baseFetch(`${BASE_PATH}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify(body),
  });
}

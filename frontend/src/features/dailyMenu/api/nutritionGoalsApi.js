const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_PATH = `${API_ORIGIN}/api/v1/nutrition-goals`;

async function getNutritionGoals() {
  try {
    const response = await fetch(BASE_PATH, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (err) {
    console.error('nurtitionGoals failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}

export { getNutritionGoals };

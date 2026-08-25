const BASE_URL = 'http://localhost:8080/api/v1/nutrition-goals';

async function getNutritionGoals() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return {status: response.status, data};

  } catch (err) {
    console.error('nurtitionGoals failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  
  }
}

export { getNutritionGoals };

const BASE_URL = 'http://localhost:8080/api/v1/daily-menu';

async function getDailyMenu() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    return { status: response.status, data };
  } catch (err) {
    console.error('getDailyMenu failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}

async function addRecipeToDailyMenu(recipeId, csrfToken) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({ recipe_id: recipeId }),
      credentials: 'include',
    });

    const data = await response.json();

    return { status: response.status, data };
  } catch (err) {
    console.error('addRecipeToDailyMenu failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}

async function removeRecipeFromDailyMenu(dailyMenuRecipeId, csrfToken) {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${dailyMenuRecipeId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
      },
      credentials: 'include',
    });

    if (response.status === 204) {
      return { status: response.status, data: null };
    }

    const data = await response.json();

    return { status: response.status, data };
  } catch (err) {
    console.error('removeRecipeFromDailyMenu failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}

export { getDailyMenu, addRecipeToDailyMenu, removeRecipeFromDailyMenu };

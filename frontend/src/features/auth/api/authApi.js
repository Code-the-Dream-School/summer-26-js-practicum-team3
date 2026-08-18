const BASE_URL = 'http://localhost:8080/api/v1/auth';

async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    });

    const data = await response.json();

    return { status: response.status, data };
  } catch (err) {
    console.error('registerUser failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await response.json();

    return { status: response.status, data };
  } catch (err) {
    console.error('loginUser failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}
async function logoutUser() {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return { status: response.status };
  } catch (err) {
    console.error('logoutUser failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}

export { registerUser, loginUser, logoutUser };

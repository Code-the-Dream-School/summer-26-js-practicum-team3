const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_PATH = `${API_ORIGIN}/api/v1/auth`;

async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${BASE_PATH}/register`, {
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
    const response = await fetch(`${BASE_PATH}/login`, {
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
    const response = await fetch(`${BASE_PATH}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return { status: response.status };
  } catch (err) {
    console.error('logoutUser failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}
async function getProfile() {
  try {
    const response = await fetch(`${BASE_PATH}/profile`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (err) {
    console.error('getProfile failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}

async function getMe (){
try {
    const response = await fetch(`${BASE_PATH}/me`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (err) {
    console.error('getMe failed:', err);
    return { status: 0, data: { message: 'Unable to reach the server.' } };
  }
}
export { registerUser, loginUser, logoutUser, getProfile, getMe };

async function registerUser (name, email, password){

    //temporary test//
  if (email === 'takenemail@test.com') {
    return {
      status: 409,
      data: {
        message: 'This email is already registered.',
      },
    };
  }

  if (password.length < 8) {
    return {
      status: 400,
      data: {
        message: 'Password must be at least 8 characters.',
      },
    };
  }

  return {
    status: 201,
    data: {
      name: name,
      csrfToken: 'fake-csrf-token-for-now',
    },
  };
}

export default registerUser
function isValidName(name) {
  return name.trim().length >= 2;
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function isValidPassword(password) {
  return password.length >= 8;
}

export { isValidName, isValidEmail, isValidPassword };

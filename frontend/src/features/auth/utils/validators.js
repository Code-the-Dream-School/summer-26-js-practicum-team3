function isValidName(name) {
  return name.trim().length >= 2;
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Mirrors the backend's userSchema.password rule (joi.input.validations.js) -
// at least 8 characters, with upper and lower case letters, a number, and a
// special character. Keep these two in sync.
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;

function isValidPassword(password) {
  return password.length >= 8 && PASSWORD_PATTERN.test(password);
}

export { isValidName, isValidEmail, isValidPassword };

// a stub for the register endpoint
const register = (req, res) => {
  res
    .status(201) // a new user was created
    .json({
      name: 'John Anyman',
      csrfTocken: 'super_secret_long_string',
    });
};

export { register };

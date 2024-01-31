const passwordValidator = (password) => {
  if (
    password.length < 8 ||
    password.length > 16 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return false;
  }
  return true;
};

module.exports = passwordValidator;

validator = require('validator');

const validateLogin = (req) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error('Invalid credentials');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Invalid credentials');
  }
};

module.exports = { validateLogin };

validator = require('validator');

const validateLogin = (req) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error('Invalid credentials');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Invalid credentials ');
  }
};

const validatePassword = (req) => {
  const { newPassword } = req.body;
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error('password is not strong enough, try new password ');
  }
};

module.exports = { validateLogin, validatePassword };

const validator = require('validator');

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  console.log(req.body);
  if (!firstName || !lastName) {
    throw new Error('Please enter the name');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter valid password');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('please enter valid email');
  }
};

module.exports = { validateSignUp };

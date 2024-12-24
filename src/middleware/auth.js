const User = require('../models/user');

const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error('Invalid token !!!!!');
    }
    const decodeToken = await jwt.verify(token, 'DEV@Tinder$123');

    const { _id } = decodeToken;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('invalid User');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send('Authentication failed' + error);
  }
};

module.exports = userAuth;
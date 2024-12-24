const express = require('express');
const userAuth = require('../middleware/auth');

const requestRoutes = express.Router();
requestRoutes.post('/sendConnectionRequest', userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + ' ' + 'sent the request');
});
module.exports = requestRoutes;

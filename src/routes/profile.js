const express = require('express');
const userAuth = require('../middleware/auth');

const profileRoutes = express.Router();

profileRoutes.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send('error:' + error);
  }
});
profileRoutes.patch('/profile/edit', async (req, res) => {
  try {
  } catch (error) {}
});

module.exports = profileRoutes;

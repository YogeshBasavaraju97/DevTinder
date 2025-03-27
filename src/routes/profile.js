const express = require("express");
const userAuth = require("../middleware/auth");
const validateEditFields = require("../util/validateAllowedFields");

const bcrypt = require("bcrypt");
const { validatePassword } = require("../util/validateLogin");

const profileRoutes = express.Router();

profileRoutes.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("error:" + error);
  }
});

profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditFields(req)) {
      throw new Error("Invalid edit field");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    const firstName = req.body.firstName;
    await loggedInUser.save();
    res.json({
      message: "data updated successfully",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("error " + error);
  }
});

profileRoutes.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validatePassword(req);
    const oldPassword = req.body.oldPassword;
    const loggedInUser = req.user;
    console.log(loggedInUser.password);

    const isPasswordExists = await loggedInUser.verifyPassword(oldPassword);
    if (!isPasswordExists) {
      throw new Error("Invalid credentials");
    }
    const newPassword = req.body.newPassword;

    const hashPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashPassword;

    await loggedInUser.save();
    res.cookie("token", null, { maxAge: 0 });

    // console.log(user);
    res.send("Password successfully changed");
  } catch (error) {
    res.send("error" + error);
  }
});

module.exports = profileRoutes;

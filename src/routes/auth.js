const express = require("express");

const { validateSignUp } = require("../util/validateSignUp");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateLogin } = require("../util/validateLogin");

const authRoutes = express.Router();

authRoutes.post("/signup", async (req, res) => {
  //validate the data
  try {
    validateSignUp(req);
    const { firstName, lastName, emailId, password } = req.body;

    //decrypt the password

    const hashPassword = await bcrypt.hash(password, 10);

    //creating new instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,

    });

    //saving data to mongoDB
    await user.save();

    res.send("user added successfully");
  } catch (error) {
    res.status(400).send("signup error  " + error);
  }
});

authRoutes.post("/login", async (req, res) => {
  try {
    //validate the data
    validateLogin(req);
    const { emailId, password } = req.body;

    //check the user if available in database

    const user = await User.findOne({ emailId: emailId });


    if (!user) {
      throw new Error("invalid credentials");
    }

    const isPasswordExists = await user.verifyPassword(password);
    if (!isPasswordExists) {
      throw new Error("Invalid credentials");
    }

    //create JWT token

    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 900000 });
    res.send(user);
  } catch (error) {
    res.status(400).send("error:" + error);
  }
});

authRoutes.post("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "successfully logged out" });
});

module.exports = authRoutes;

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "first name is too short"],
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "last is too short"],
    },
    emailId: {
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email id");
        }
      },
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18) {
          throw new Error("sorry not eligible to use the app");
        }
      },
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: Date,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 3) {
          throw new Error("max 3 skills");
        }
      },
    },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) throw new Error("invalid URL" + error);
      },
    },
    about: { type: String, default: "Please enter your bio here" },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$123", {
    expiresIn: 60 * 60,
  });

  return token;
};

userSchema.methods.verifyPassword = async function (userPassword) {
  const user = this;

  const isVerified = await bcrypt.compare(userPassword, user.password);

  return isVerified;
};

module.exports = mongoose.model("User", userSchema);

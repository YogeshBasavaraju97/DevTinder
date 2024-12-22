const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'first name is too short'],
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, 'last is too short'],
    },
    emailId: {
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('invalid email id');
        }
      },
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18) {
          throw new Error('sorry not eligible to use the app');
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
          throw new Error('max 3 skills');
        }
      },
    },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) throw new Error('invalid URL' + error);
      },
    },
    about: { type: String, default: 'Please enter your bio here' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

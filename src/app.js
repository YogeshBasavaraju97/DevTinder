const express = require('express');

const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUp } = require('./util/validateSignUp');
const { validateLogin } = require('./util/validateLogin');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./midlleware/auth');

const app = express(); //middleware to body parser

app.use(express.json()); //to convert json object to js Object
app.use(cookieParser());

app.post('/signUp', async (req, res) => {
  //validation of the data

  //creating new instance in the model

  try {
    validateSignUp(req);
    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    console.log(hashPassword);

    await user.save();
    res.send('user added successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/login', async (req, res) => {
  try {
    validateLogin(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error('invalid credentials');
    }
    const hash = user.password;

    const isPasswordExists = await bcrypt.compare(password, hash);

    if (!isPasswordExists) {
      throw new Error('Invalid credentials');
    }
    // create JWT token
    const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder$123');
    console.log(token);

    res.cookie('token', token);
    res.send('login successful');
  } catch (error) {
    res.status(400).send('error:' + error);
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    res.send(user);
  } catch (error) {
    res.status(400).send('error:' + error);
  }
});

app.get('/user', async (req, res) => {
  const email = req.body.emailId;

  try {
    const user = await User.find({ emailId: email });
    res.send(user);
  } catch (error) {
    res.status(400).send('something went wrong');
  }
});

app.get('/users', async (req, res) => {
  const users = await User.find({});
  try {
    if (users.length === 0) {
      res.send('No users found');
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send('Error while fetching the data');
  }
});

app.post('./signUp', async () => {
  console.log('creating new instances in DB');
  const user = new User(req.body);

  try {
    await user.save();
    res.send('user added successfully');
  } catch (error) {
    res.status(401).send('error while sending the data');
  }
});

app.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  try {
    const user = await User.findByIdAndDelete(userId);
    console.log(user);
    if (user == null) {
      throw new Error('user not exists');
    }
    res.send('user deleted');
  } catch (error) {
    res.send('error in deleting' + error);
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      'userId',
      'photoURL',
      'about',
      'gender',
      'age',
      'skills',
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      res.status(400).send('update not allowed');
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: 'after', //you can use "befor" or "after" to get the data
      runValidators: true, //needed in patch method to explicitly validate the data
    });
    console.log(user);
    res.send('user updated');
  } catch (error) {
    console.log(error);
    res.status(400).send('Error occured while updating');
  }
});
connectDB()
  .then(() => {
    console.log('connection successfully established');
    const PORT = 9999;

    app.listen(9999, () => {
      console.log('server successfully started');
    });
  })
  .catch((error) => {
    console.log('Error occured while connecting');
  });

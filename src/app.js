const express = require('express');

const connectDB = require('./config/database');

const app = express(); //middleware to body parser
const cookieParser = require('cookie-parser');
app.use(express.json()); //to convert json object to js Object
app.use(cookieParser());

// app.post('/signUp', async (req, res) => {

//   //validation of the data

//   //creating new instance in the model

//   try {
//     validateSignUp(req);
//     const { firstName, lastName, emailId, password } = req.body;

//     const hashPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: hashPassword,
//     });

//     console.log(hashPassword);

//     await user.save();
//     res.send('user added successfully');
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// app.get('/login', async (req, res) => {
//   try {
//     validateLogin(req);
//     const { emailId, password } = req.body;
//     const user = await User.findOne({ emailId: emailId });

//     if (!user) {
//       throw new Error('invalid credentials');
//     }

//     const isPasswordExists = await user.verifyPassword(password);

//     if (!isPasswordExists) {
//       throw new Error('Invalid credentials');
//     }
//     // create JWT token
//     const token = await user.getJWT();

//     res.cookie('token', token, { maxAge: 900000 });
//     res.send('login successful');
//   } catch (error) {
//     res.status(400).send('error:' + error);
//   }
// });

// app.get('/profile', userAuth, async (req, res) => {
//   try {
//     const user = req.user;
//     console.log(user);

//     res.send(user);
//   } catch (error) {
//     res.status(400).send('error:' + error);
//   }
// });
// app.post('/sendConnectionRequest', userAuth, async (req, res) => {
//   const user = req.user;

//   res.send(user.firstName + ' ' + 'sent the request');
// });

const auth = require('./routes/auth');
const profile = require('./routes/profile');
const connection = require('./routes/request');

app.use('/', auth);
app.use('/', profile);
app.use('/', connection);

connectDB()
  .then(() => {
    console.log('connection successfully established');
    const PORT = 9999;

    app.listen(9999, () => {
      console.log('server successfully started');
    });
  })
  .catch((error) => {
    console.log('Error while connecting');
  });

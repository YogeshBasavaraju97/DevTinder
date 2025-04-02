
const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");

const app = express(); //middleware to body parser
const cookieParser = require("cookie-parser");

const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); //to convert json object to js Object
app.use(cookieParser());



const auth = require("./routes/auth");
const profile = require("./routes/profile");
const connection = require("./routes/request");
const user = require("./routes/user");


app.use("/", auth);
app.use("/", profile);
app.use("/", connection);
app.use("/", user);

connectDB()
  .then(() => {
    console.log("connection successfully established");
    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log("server successfully started");
    });
  })
  .catch((error) => {
    console.log("Error while connecting");
  });

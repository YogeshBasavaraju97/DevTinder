const mongoose = require('mongoose');

const connectDb = async () => {
  await mongoose.connect(
    'mongodb+srv://yogeshb0697:VOD0AbWbw4Nioe15@cluster0.l5dw3.mongodb.net/devTinder'
  );
};

module.exports = connectDb;

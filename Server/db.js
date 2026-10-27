const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.warn('MongoDB connection warning (running with in-memory fallback if DB not running locally):', err.message);
  }
};

module.exports = connectDB;
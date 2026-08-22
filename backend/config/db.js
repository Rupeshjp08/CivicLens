const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/civiclens';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000 // Timeout after 3s if local MongoDB is not running
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn(`ℹ️ Operating in fallback mock-data mode until MongoDB is connected.`);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };

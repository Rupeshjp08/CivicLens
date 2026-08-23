const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/civiclens';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`🗄️ MongoDB Connected: ${conn.connection.host}:${conn.connection.port || 27017}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn(`ℹ️ Operating in fallback mock-data mode until MongoDB is connected.`);
    return false;
  }
};

const getIsConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, getIsConnected };

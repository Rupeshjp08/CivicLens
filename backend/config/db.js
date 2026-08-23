const mongoose = require('mongoose');
const dns = require('dns');

// Ensure Windows Node.js DNS resolver can query MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {
  // Use default system DNS if custom DNS cannot be set
}

let isConnected = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/civiclens';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 6000
    });
    isConnected = true;
    console.log(`🗄️ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
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

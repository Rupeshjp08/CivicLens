const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB, getIsConnected } = require('./config/db');
const seedData = require('./config/seed');

const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes');
const officerRoutes = require('./routes/officerRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// ================================
// Core Middlewares
// ================================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ================================
// Health Check Endpoint
// ================================
app.get('/api/health', (req, res) => {
  const isDbConnected = getIsConnected();
  res.status(200).json({
    success: true,
    message: 'CivicLens API is running',
    databaseConnected: isDbConnected
  });
});

// ================================
// API Routes
// ================================
app.use('/api/auth', authRoutes);
app.use('/api', complaintRoutes);
app.use('/api', officerRoutes);
app.use('/api', departmentRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', notificationRoutes);

// ================================
// 404 Route Handler
// ================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// ================================
// Centralized Error Middleware
// ================================
app.use(errorHandler);

// ================================
// Start Server with Async DB Connection
// ================================
const startServer = async () => {
  const dbConnected = await connectDB();
  if (dbConnected) {
    await seedData();
  }

  const server = app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 CivicLens Backend API Server');
    console.log(`📡 Running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️ Database Connected: ${getIsConnected()}`);
    console.log('=================================');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use by another running instance.`);
      console.error(`ℹ️ If the backend is already running on port ${PORT}, use the existing backend process.`);
    } else {
      console.error('❌ Server error:', err);
    }
  });
};

startServer();
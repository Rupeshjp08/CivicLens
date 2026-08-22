const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const complaintRoutes = require('./routes/complaintRoutes');
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Health Check
// ================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CivicLens API is running'
  });
});

// ================================
// API Routes
// ================================
app.use('/api', complaintRoutes);

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
// Start Server
// ================================
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 CivicLens Backend API Server');
  console.log(`📡 Running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log('💾 MongoDB: Not Required');
  console.log('=================================');
});
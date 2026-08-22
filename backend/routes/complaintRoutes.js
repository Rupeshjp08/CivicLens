const express = require('express');
const router = express.Router();
const {
  getHealth,
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  upvoteComplaint
} = require('../controllers/complaintController');

// Health Check Endpoint (also exposed at GET /api/health)
router.get('/health', getHealth);

// Complaint CRUD routes
router.get('/complaints', getComplaints);
router.get('/complaints/:id', getComplaintById);
router.post('/complaints', createComplaint);
router.patch('/complaints/:id', updateComplaint);
router.post('/complaints/:id/upvote', upvoteComplaint);

module.exports = router;

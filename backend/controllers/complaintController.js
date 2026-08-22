const Complaint = require('../models/Complaint');
const { getIsConnected } = require('../config/db');
const { calculatePriority } = require('../services/priorityService');

// Seed mock complaints for running without active MongoDB
let mockComplaints = [
  {
    complaintId: 'CIV-1001',
    title: 'Severe Pothole on Oak Avenue',
    description: 'Deep pothole causing vehicle damage near the central intersection.',
    category: 'Pothole',
    location: 'Oak Avenue & 5th Street, Sector 4',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress',
    priority: 'High',
    supportCount: 14,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    complaintId: 'CIV-1002',
    title: 'Broken Streetlight outside Public Library',
    description: 'Streetlight has been flickering and completely off for the last 3 days.',
    category: 'Broken Streetlight',
    location: 'Central Library Road, Block B',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    priority: 'Medium',
    supportCount: 8,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    complaintId: 'CIV-1003',
    title: 'Garbage Overflow near Metro Station',
    description: 'Uncollected municipal garbage bin overflowing on sidewalk.',
    category: 'Garbage Accumulation',
    location: 'City Metro Station Gate 2',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    status: 'In Review',
    priority: 'High',
    supportCount: 22,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    complaintId: 'CIV-1004',
    title: 'Major Water Pipeline Leakage',
    description: 'Fresh water leaking continuously onto main road for 12 hours.',
    category: 'Water Leakage',
    location: 'Green Park Housing Complex Gate 1',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress',
    priority: 'Critical',
    supportCount: 35,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  }
];

/**
 * GET /api/health
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CivicLens API is running'
  });
};

/**
 * GET /api/complaints
 */
const getComplaints = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: complaints.length, data: complaints });
    }

    // Fallback Mock Data Mode
    res.status(200).json({
      success: true,
      count: mockComplaints.length,
      data: mockComplaints,
      isMock: true
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/complaints/:id
 */
const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const complaint = await Complaint.findOne({
        $or: [{ _id: id }, { complaintId: id.toUpperCase() }]
      });
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
      return res.status(200).json({ success: true, data: complaint });
    }

    // Mock mode lookup
    const complaint = mockComplaints.find(
      (c) => c.complaintId.toLowerCase() === id.toLowerCase() || c._id === id
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({ success: true, data: complaint, isMock: true });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/complaints
 */
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, location, image } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and location'
      });
    }

    const complaintId = `CIV-${Math.floor(1000 + Math.random() * 9000)}`;
    const tempObj = { title, description, category, location, image, supportCount: 0 };
    const priority = calculatePriority(tempObj);

    if (getIsConnected()) {
      const newComplaint = await Complaint.create({
        complaintId,
        title,
        description,
        category: category || 'Other',
        location,
        image: image || '',
        priority,
        status: 'Pending'
      });
      return res.status(201).json({ success: true, data: newComplaint });
    }

    // Mock Mode creation
    const newMockComplaint = {
      _id: `mock-${Date.now()}`,
      complaintId,
      title,
      description,
      category: category || 'Other',
      location,
      image: image || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80',
      status: 'Pending',
      priority,
      supportCount: 0,
      createdAt: new Date()
    };

    mockComplaints.unshift(newMockComplaint);

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: newMockComplaint,
      isMock: true
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/complaints/:id
 */
const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    if (getIsConnected()) {
      const complaint = await Complaint.findOneAndUpdate(
        { $or: [{ _id: id }, { complaintId: id.toUpperCase() }] },
        { status, priority },
        { new: true, runValidators: true }
      );
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
      return res.status(200).json({ success: true, data: complaint });
    }

    // Mock Mode Update
    const idx = mockComplaints.findIndex(
      (c) => c.complaintId.toLowerCase() === id.toLowerCase() || c._id === id
    );

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (status) mockComplaints[idx].status = status;
    if (priority) mockComplaints[idx].priority = priority;

    res.status(200).json({
      success: true,
      data: mockComplaints[idx],
      isMock: true
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/complaints/:id/upvote
 */
const upvoteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const complaint = await Complaint.findOneAndUpdate(
        { $or: [{ _id: id }, { complaintId: id.toUpperCase() }] },
        { $inc: { supportCount: 1 } },
        { new: true }
      );
      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
      return res.status(200).json({ success: true, data: complaint });
    }

    // Mock Mode Upvote
    const idx = mockComplaints.findIndex(
      (c) => c.complaintId.toLowerCase() === id.toLowerCase() || c._id === id
    );

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    mockComplaints[idx].supportCount += 1;

    res.status(200).json({
      success: true,
      data: mockComplaints[idx],
      isMock: true
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHealth,
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  upvoteComplaint
};

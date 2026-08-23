const Complaint = require('../models/Complaint');
const { getIsConnected } = require('../config/db');
const { calculatePriority, attachPriorityAnalysis } = require('../services/priorityService');
const { createNotification } = require('../services/notificationService');

let mockComplaints = [
  {
    _id: 'mock-3913',
    complaintId: 'CIV-3913',
    title: 'Major pothole on Main Road',
    description: 'Deep hazardous crater in left lane causing heavy traffic backup and tire damage.',
    category: 'Pothole',
    location: 'Oak Avenue & 5th Street, Sector 4',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    priority: 'Critical',
    supportCount: 28,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    assignedOfficerId: 'off-1',
    assignedOfficerName: 'Eng. Marcus Vance',
    mapX: 62,
    mapY: 58,
    fieldNotes: [
      {
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'CivicLens intake',
        note: 'Complaint received and queued for municipal review.'
      }
    ]
  },
  {
    _id: 'mock-1001',
    complaintId: 'CIV-1001',
    title: 'Severe Pothole on Oak Avenue',
    description: 'Deep pothole causing vehicle damage near the central intersection.',
    category: 'Pothole',
    location: 'Oak Avenue & 5th Street, Sector 4',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress',
    priority: 'High',
    supportCount: 14,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignedOfficerId: 'off-1',
    assignedOfficerName: 'Eng. Marcus Vance',
    mapX: 64,
    mapY: 55,
    fieldNotes: [
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Roads desk',
        note: 'Assigned to field crew. Temporary cones requested.'
      }
    ]
  },
  {
    _id: 'mock-1002',
    complaintId: 'CIV-1002',
    title: 'Broken Streetlight outside Public Library',
    description: 'Streetlight has been flickering and completely off for the last 3 days.',
    category: 'Broken Streetlight',
    location: 'Central Library Road, Block B',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    priority: 'Medium',
    supportCount: 8,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignedOfficerId: null,
    assignedOfficerName: null,
    mapX: 38,
    mapY: 32,
    fieldNotes: []
  },
  {
    _id: 'mock-1003',
    complaintId: 'CIV-1003',
    title: 'Garbage Overflow near Metro Station',
    description: 'Uncollected municipal garbage bin overflowing on sidewalk.',
    category: 'Garbage Accumulation',
    location: 'City Metro Station Gate 2',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    status: 'In Review',
    priority: 'High',
    supportCount: 22,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    assignedOfficerId: 'off-4',
    assignedOfficerName: 'Insp. Alex Rivera',
    mapX: 48,
    mapY: 40,
    fieldNotes: [
      {
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        author: 'Sanitation desk',
        note: 'Pickup scheduled for next collection shift.'
      }
    ]
  },
  {
    _id: 'mock-1004',
    complaintId: 'CIV-1004',
    title: 'Major Water Pipeline Leakage',
    description: 'Fresh water leaking continuously onto main road for 12 hours.',
    category: 'Water Leakage',
    location: 'Green Park Housing Complex Gate 1',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress',
    priority: 'Critical',
    supportCount: 35,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    assignedOfficerId: 'off-2',
    assignedOfficerName: 'Tech. Sarah Jenkins',
    mapX: 78,
    mapY: 28,
    fieldNotes: [
      {
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        author: 'Water operations',
        note: 'Valve isolation crew dispatched.'
      }
    ]
  },
  {
    _id: 'mock-1006',
    complaintId: 'CIV-1006',
    title: 'Streetlight blackout on pedestrian walkway',
    description: 'Two consecutive lights out along the evening walkway.',
    category: 'Broken Streetlight',
    location: 'Commercial Hub Walkway, Sector 2',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    status: 'Resolved',
    priority: 'Medium',
    supportCount: 11,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignedOfficerId: 'off-3',
    assignedOfficerName: 'Elec. David Miller',
    mapX: 30,
    mapY: 70,
    fieldNotes: [
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'Electrical services',
        note: 'Fixture replaced and verified after dark.'
      }
    ]
  }
];

const withAnalysis = (complaint) => attachPriorityAnalysis(complaint, mockComplaints);

const findIndex = (id) =>
  mockComplaints.findIndex(
    (c) => c.complaintId.toLowerCase() === String(id).toLowerCase() || c._id === id
  );

const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CivicLens API is running',
    databaseConnected: getIsConnected()
  });
};

const getComplaints = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const dbComplaints = await Complaint.find({}).sort({ createdAt: -1 }).lean();
      const analyzed = dbComplaints.map((c) => attachPriorityAnalysis(c, dbComplaints));
      return res.status(200).json({
        success: true,
        count: analyzed.length,
        data: analyzed,
        source: 'database'
      });
    }

    const sortedComplaints = [...mockComplaints]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(withAnalysis);

    res.status(200).json({
      success: true,
      count: sortedComplaints.length,
      data: sortedComplaints,
      source: 'memory'
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawId = String(id).trim();

    if (getIsConnected()) {
      const item = await Complaint.findOne({
        $or: [
          { complaintId: { $regex: new RegExp(`^${rawId}$`, 'i') } },
          { _id: rawId.match(/^[0-9a-fA-F]{24}$/) ? rawId : null }
        ]
      }).lean();

      if (item) {
        const allDb = await Complaint.find({}).lean();
        return res.status(200).json({
          success: true,
          data: attachPriorityAnalysis(item, allDb),
          source: 'database'
        });
      }
    }

    const index = findIndex(rawId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `No complaint found for ${rawId}.`
      });
    }

    res.status(200).json({
      success: true,
      data: withAnalysis(mockComplaints[index]),
      source: 'memory'
    });
  } catch (error) {
    next(error);
  }
};

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
    const tempObj = { title, description, category, location, supportCount: 1, createdAt: new Date() };
    const priority = calculatePriority(tempObj, mockComplaints);

    if (getIsConnected()) {
      const newDoc = await Complaint.create({
        complaintId,
        title,
        description,
        category: category || 'Other',
        location,
        image: image || '',
        status: 'Pending',
        priority,
        supportCount: 1,
        mapX: 40 + Math.round(Math.random() * 40),
        mapY: 30 + Math.round(Math.random() * 40),
        fieldNotes: [
          {
            timestamp: new Date().toISOString(),
            author: 'CivicLens intake',
            note: 'Complaint received and queued for municipal review.'
          }
        ]
      });

      await createNotification({
        recipientId: 'cit-1',
        recipientRole: 'CITIZEN',
        type: 'COMPLAINT_SUBMITTED',
        title: 'Complaint Submitted Successfully',
        message: `Your complaint ${complaintId} (${title}) has been submitted and queued for municipal review.`,
        complaintId
      });

      const allDb = await Complaint.find({}).lean();
      return res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully',
        data: attachPriorityAnalysis(newDoc.toObject(), allDb),
        source: 'database'
      });
    }

    const newComplaint = {
      _id: `mock-${Date.now()}`,
      complaintId,
      title,
      description,
      category: category || 'Other',
      location,
      image: image || '',
      status: 'Pending',
      priority,
      supportCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedOfficerId: null,
      assignedOfficerName: null,
      mapX: 40 + Math.round(Math.random() * 40),
      mapY: 30 + Math.round(Math.random() * 40),
      fieldNotes: [
        {
          timestamp: new Date().toISOString(),
          author: 'CivicLens intake',
          note: 'Complaint received and queued for municipal review.'
        }
      ]
    };

    mockComplaints.unshift(newComplaint);

    await createNotification({
      recipientId: 'cit-1',
      recipientRole: 'CITIZEN',
      type: 'COMPLAINT_SUBMITTED',
      title: 'Complaint Submitted Successfully',
      message: `Your complaint ${complaintId} (${title}) has been submitted and queued for municipal review.`,
      complaintId
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: withAnalysis(newComplaint),
      source: 'memory'
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawId = String(id).trim();
    const { status, priority, note, author, assignedOfficerId, assignedOfficerName, resolutionImage } = req.body;

    // Trigger Notification helpers
    if (status === 'Resolved') {
      await createNotification({
        recipientId: 'cit-1',
        recipientRole: 'CITIZEN',
        type: 'COMPLAINT_RESOLVED',
        title: 'Complaint Verified Resolved',
        message: `Your report ${rawId} has been resolved by field crew with verified photo evidence.`,
        complaintId: rawId
      });
    } else if (status) {
      await createNotification({
        recipientId: 'cit-1',
        recipientRole: 'CITIZEN',
        type: 'STATUS_CHANGED',
        title: `Status Updated: ${status}`,
        message: `The status for report ${rawId} has been updated to ${status}.`,
        complaintId: rawId
      });
    }

    if (assignedOfficerId) {
      await createNotification({
        recipientId: assignedOfficerId || 'off-1',
        recipientRole: 'OFFICER',
        type: 'COMPLAINT_ASSIGNED',
        title: 'New Dispatch Assigned',
        message: `You have been assigned to complaint ${rawId}.`,
        complaintId: rawId
      });
    }

    if (getIsConnected()) {
      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (priority) updatePayload.priority = priority;
      if (assignedOfficerId) updatePayload.assignedOfficerId = assignedOfficerId;
      if (assignedOfficerName) updatePayload.assignedOfficerName = assignedOfficerName;
      if (resolutionImage) updatePayload.resolutionImage = resolutionImage;

      const $push = {};
      if (note) {
        $push.fieldNotes = {
          timestamp: new Date().toISOString(),
          author: author || 'Eng. Marcus Vance',
          note
        };
      }

      const updateQuery = { $set: updatePayload };
      if (Object.keys($push).length > 0) updateQuery.$push = $push;

      const updatedDoc = await Complaint.findOneAndUpdate(
        {
          $or: [
            { complaintId: { $regex: new RegExp(`^${rawId}$`, 'i') } },
            { _id: rawId.match(/^[0-9a-fA-F]{24}$/) ? rawId : null }
          ]
        },
        updateQuery,
        { new: true }
      ).lean();

      if (updatedDoc) {
        const allDb = await Complaint.find({}).lean();
        return res.status(200).json({
          success: true,
          data: attachPriorityAnalysis(updatedDoc, allDb),
          source: 'database'
        });
      }
    }

    const index = findIndex(rawId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    if (status) mockComplaints[index].status = status;
    if (priority) mockComplaints[index].priority = priority;
    if (assignedOfficerId) mockComplaints[index].assignedOfficerId = assignedOfficerId;
    if (assignedOfficerName) mockComplaints[index].assignedOfficerName = assignedOfficerName;
    if (resolutionImage) mockComplaints[index].resolutionImage = resolutionImage;

    if (note) {
      mockComplaints[index].fieldNotes = mockComplaints[index].fieldNotes || [];
      mockComplaints[index].fieldNotes.push({
        timestamp: new Date().toISOString(),
        author: author || 'Eng. Marcus Vance',
        note
      });
    }

    mockComplaints[index].updatedAt = new Date();

    res.status(200).json({
      success: true,
      data: withAnalysis(mockComplaints[index]),
      source: 'memory'
    });
  } catch (error) {
    next(error);
  }
};

const upvoteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawId = String(id).trim();

    if (getIsConnected()) {
      const updatedDoc = await Complaint.findOneAndUpdate(
        {
          $or: [
            { complaintId: { $regex: new RegExp(`^${rawId}$`, 'i') } },
            { _id: rawId.match(/^[0-9a-fA-F]{24}$/) ? rawId : null }
          ]
        },
        { $inc: { supportCount: 1 } },
        { new: true }
      ).lean();

      if (updatedDoc) {
        const allDb = await Complaint.find({}).lean();
        return res.status(200).json({
          success: true,
          data: attachPriorityAnalysis(updatedDoc, allDb),
          source: 'database'
        });
      }
    }

    const index = findIndex(rawId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    mockComplaints[index].supportCount += 1;
    mockComplaints[index].updatedAt = new Date();

    res.status(200).json({
      success: true,
      data: withAnalysis(mockComplaints[index]),
      source: 'memory'
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


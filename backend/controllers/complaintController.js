const { calculatePriority, attachPriorityAnalysis } = require('../services/priorityService');

let mockComplaints = [
  {
    _id: 'mock-3913',
    complaintId: 'CIV-3913',
    title: 'test pothole complaint',
    description: 'Testing frontend and backend integration',
    category: 'Pothole',
    location: 'Oak Avenue & 5th Street intersection, Sector 4',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    priority: 'Medium',
    supportCount: 28,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    assignedOfficerId: null,
    assignedOfficerName: null,
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
    _id: 'mock-1005',
    complaintId: 'CIV-1005',
    title: 'Second pothole near Oak Avenue junction',
    description: 'Additional crater on the same stretch as earlier Oak Avenue reports.',
    category: 'Pothole',
    location: 'Oak Avenue junction, Sector 4',
    image: '',
    status: 'Pending',
    priority: 'High',
    supportCount: 9,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    assignedOfficerId: null,
    assignedOfficerName: null,
    mapX: 60,
    mapY: 60,
    fieldNotes: []
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
    message: 'CivicLens API is running'
  });
};

const getComplaints = (req, res, next) => {
  try {
    const sortedComplaints = [...mockComplaints]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(withAnalysis);

    res.status(200).json({
      success: true,
      count: sortedComplaints.length,
      data: sortedComplaints
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = (req, res, next) => {
  try {
    const { id } = req.params;
    const index = findIndex(id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      data: withAnalysis(mockComplaints[index])
    });
  } catch (error) {
    next(error);
  }
};

const createComplaint = (req, res, next) => {
  try {
    const { title, description, category, location, image } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and location'
      });
    }

    const complaintId = `CIV-${Math.floor(1000 + Math.random() * 9000)}`;
    const tempObj = { title, description, category, location, supportCount: 0, createdAt: new Date() };
    const priority = calculatePriority(tempObj, mockComplaints);

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

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: withAnalysis(newComplaint)
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaint = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, note, author, assignedOfficerId, assignedOfficerName, resolutionImage } = req.body;
    const index = findIndex(id);

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
        author: author || 'Municipal officer',
        note
      });
    }

    mockComplaints[index].updatedAt = new Date();

    res.status(200).json({
      success: true,
      data: withAnalysis(mockComplaints[index])
    });
  } catch (error) {
    next(error);
  }
};

const upvoteComplaint = (req, res, next) => {
  try {
    const { id } = req.params;
    const index = findIndex(id);

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
      data: withAnalysis(mockComplaints[index])
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

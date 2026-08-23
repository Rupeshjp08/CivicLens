const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the complaint'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Pothole',
        'Broken Streetlight',
        'Garbage Accumulation',
        'Water Leakage',
        'Damaged Road',
        'Other'
      ],
      default: 'Other'
    },
    location: {
      type: String,
      required: [true, 'Please provide the issue location'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    supportCount: {
      type: Number,
      default: 1
    },
    assignedOfficerId: {
      type: String,
      default: null
    },
    assignedOfficerName: {
      type: String,
      default: null
    },
    resolutionImage: {
      type: String,
      default: ''
    },
    resolutionNote: {
      type: String,
      default: ''
    },
    mapX: {
      type: Number,
      default: 50
    },
    mapY: {
      type: Number,
      default: 50
    },
    fieldNotes: [
      {
        timestamp: { type: String, default: () => new Date().toISOString() },
        author: { type: String, default: 'Officer' },
        note: { type: String, required: true }
      }
    ],
    statusHistory: [
      {
        previousStatus: String,
        newStatus: String,
        changedBy: String,
        note: String,
        timestamp: { type: Date, default: Date.now }
      }
    ],
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);


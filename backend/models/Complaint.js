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
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);

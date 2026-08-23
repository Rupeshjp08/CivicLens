const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: true,
      index: true
    },
    recipientRole: {
      type: String,
      enum: ['CITIZEN', 'OFFICER', 'ADMIN'],
      default: 'CITIZEN',
      index: true
    },
    type: {
      type: String,
      enum: [
        'COMPLAINT_SUBMITTED',
        'COMPLAINT_ASSIGNED',
        'STATUS_CHANGED',
        'FIELD_UPDATE',
        'COMPLAINT_RESOLVED',
        'COMPLAINT_REOPENED',
        'SYSTEM'
      ],
      default: 'SYSTEM'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    complaintId: {
      type: String,
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

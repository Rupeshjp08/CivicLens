const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'SYSTEM'
    },
    action: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString()
    },
    details: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);

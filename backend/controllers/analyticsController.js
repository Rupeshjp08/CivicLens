const Complaint = require('../models/Complaint');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const mockAnalytics = {
  totalComplaints: 248,
  activeComplaints: 34,
  resolvedComplaints: 214,
  resolutionRate: '88.4%',
  averageResolutionHours: 18.5,
  criticalPotholesCount: 6,
  customerSatisfactionScore: '4.8 / 5.0'
};

const mockAuditLogs = [
  { id: 'log-1', actor: 'Eng. Marcus Vance', role: 'OFFICER', action: 'STATUS_UPDATE', target: '#CIV-3913', timestamp: '2026-08-23 10:42 AM', details: 'Updated status to Pending Triage' },
  { id: 'log-2', actor: 'System Auto-Engine', role: 'SYSTEM', action: 'PRIORITY_CALCULATED', target: '#CIV-1004', timestamp: '2026-08-23 09:15 AM', details: 'Assigned Critical Priority (Score 92)' },
  { id: 'log-3', actor: 'John Citizen', role: 'CITIZEN', action: 'REPORT_CREATED', target: '#CIV-3913', timestamp: '2026-08-22 06:10 AM', details: 'Submitted pothole ticket with photo proof' }
];

const mockCitizens = [
  { id: 'cit-1', name: 'John Citizen', email: 'john@example.com', reportsSubmitted: 4, verified: true, joinedDate: '2026-01-15' },
  { id: 'cit-2', name: 'Sarah Resident', email: 'sarah@example.com', reportsSubmitted: 2, verified: true, joinedDate: '2026-03-20' }
];

const getAnalytics = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const total = await Complaint.countDocuments();
      const resolved = await Complaint.countDocuments({ status: 'Resolved' });
      const active = await Complaint.countDocuments({ status: { $ne: 'Resolved' } });
      const rate = total ? ((resolved / total) * 100).toFixed(1) + '%' : '88.4%';

      return res.status(200).json({
        success: true,
        data: {
          ...mockAnalytics,
          totalComplaints: total,
          activeComplaints: active,
          resolvedComplaints: resolved,
          resolutionRate: rate
        }
      });
    }

    res.status(200).json({ success: true, data: mockAnalytics });
  } catch (err) {
    next(err);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const logs = await AuditLog.find({}).sort({ createdAt: -1 }).lean();
      if (logs.length > 0) return res.status(200).json({ success: true, data: logs });
    }
    res.status(200).json({ success: true, data: mockAuditLogs });
  } catch (err) {
    next(err);
  }
};

const getCitizens = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const citizens = await User.find({ role: 'CITIZEN' }).lean();
      if (citizens.length > 0) return res.status(200).json({ success: true, data: citizens });
    }
    res.status(200).json({ success: true, data: mockCitizens });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, getAuditLogs, getCitizens };

const Notification = require('../models/Notification');
const { getIsConnected } = require('../config/db');

// In-memory fallback notifications store
let mockNotifications = [
  {
    _id: 'notif-1',
    recipientId: 'cit-1',
    recipientRole: 'CITIZEN',
    type: 'COMPLAINT_SUBMITTED',
    title: 'Complaint Submitted',
    message: 'Your report CIV-3913 for Main Road Pothole has been logged into municipal queue.',
    complaintId: 'CIV-3913',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    _id: 'notif-2',
    recipientId: 'off-1',
    recipientRole: 'OFFICER',
    type: 'COMPLAINT_ASSIGNED',
    title: 'New Dispatch Assigned',
    message: 'You have been assigned to critical work order CIV-3913 (Oak Avenue intersection).',
    complaintId: 'CIV-3913',
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000)
  },
  {
    _id: 'notif-3',
    recipientId: 'cit-1',
    recipientRole: 'CITIZEN',
    type: 'COMPLAINT_RESOLVED',
    title: 'Issue Resolved',
    message: 'Work order CIV-1006 has been verified and marked Resolved by electrical crew.',
    complaintId: 'CIV-1006',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

const createNotification = async ({
  recipientId,
  recipientRole = 'CITIZEN',
  type = 'SYSTEM',
  title,
  message,
  complaintId = ''
}) => {
  try {
    if (getIsConnected()) {
      const notif = await Notification.create({
        recipientId,
        recipientRole,
        type,
        title,
        message,
        complaintId
      });
      return notif.toObject();
    }

    const fallbackNotif = {
      _id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientId,
      recipientRole,
      type,
      title,
      message,
      complaintId,
      isRead: false,
      createdAt: new Date()
    };
    mockNotifications.unshift(fallbackNotif);
    return fallbackNotif;
  } catch (err) {
    console.warn('⚠️ Error creating notification:', err.message);
    return null;
  }
};

const getNotificationsForUser = async (recipientId, recipientRole) => {
  try {
    if (getIsConnected()) {
      return await Notification.find({
        $or: [
          { recipientId },
          { recipientRole },
          { recipientId: 'all' }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    }

    return mockNotifications
      .filter((n) => n.recipientId === recipientId || n.recipientRole === recipientRole || n.recipientId === 'all')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);
  } catch (err) {
    console.warn('⚠️ Error fetching notifications:', err.message);
    return [];
  }
};

const getUnreadCount = async (recipientId, recipientRole) => {
  try {
    if (getIsConnected()) {
      return await Notification.countDocuments({
        $or: [
          { recipientId },
          { recipientRole },
          { recipientId: 'all' }
        ],
        isRead: false
      });
    }

    return mockNotifications.filter(
      (n) => (n.recipientId === recipientId || n.recipientRole === recipientRole || n.recipientId === 'all') && !n.isRead
    ).length;
  } catch (err) {
    return 0;
  }
};

const markAsRead = async (id, recipientId, recipientRole) => {
  try {
    if (getIsConnected()) {
      return await Notification.findOneAndUpdate(
        { _id: id, $or: [{ recipientId }, { recipientRole }] },
        { $set: { isRead: true } },
        { new: true }
      ).lean();
    }

    const idx = mockNotifications.findIndex((n) => n._id === id);
    if (idx !== -1) {
      mockNotifications[idx].isRead = true;
      return mockNotifications[idx];
    }
    return null;
  } catch (err) {
    return null;
  }
};

const markAllAsRead = async (recipientId, recipientRole) => {
  try {
    if (getIsConnected()) {
      await Notification.updateMany(
        { $or: [{ recipientId }, { recipientRole }], isRead: false },
        { $set: { isRead: true } }
      );
      return true;
    }

    mockNotifications = mockNotifications.map((n) =>
      n.recipientId === recipientId || n.recipientRole === recipientRole ? { ...n, isRead: true } : n
    );
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  createNotification,
  getNotificationsForUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};

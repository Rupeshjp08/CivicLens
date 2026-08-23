const {
  getNotificationsForUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'cit-1';
    const role = req.headers['x-user-role'] || 'CITIZEN';

    const notifications = await getNotificationsForUser(userId, role);
    const unread = await getUnreadCount(userId, role);

    res.status(200).json({
      success: true,
      unreadCount: unread,
      data: notifications
    });
  } catch (err) {
    next(err);
  }
};

const getUnreadNotificationCount = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'cit-1';
    const role = req.headers['x-user-role'] || 'CITIZEN';

    const unread = await getUnreadCount(userId, role);

    res.status(200).json({
      success: true,
      unreadCount: unread
    });
  } catch (err) {
    next(err);
  }
};

const readNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || 'cit-1';
    const role = req.headers['x-user-role'] || 'CITIZEN';

    const updated = await markAsRead(id, userId, role);
    const unread = await getUnreadCount(userId, role);

    res.status(200).json({
      success: true,
      unreadCount: unread,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

const readAllNotifications = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] || 'cit-1';
    const role = req.headers['x-user-role'] || 'CITIZEN';

    await markAllAsRead(userId, role);

    res.status(200).json({
      success: true,
      unreadCount: 0
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  getUnreadNotificationCount,
  readNotification,
  readAllNotifications
};

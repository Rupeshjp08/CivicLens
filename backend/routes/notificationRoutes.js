const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadNotificationCount,
  readNotification,
  readAllNotifications
} = require('../controllers/notificationController');

router.get('/notifications', getNotifications);
router.get('/notifications/unread-count', getUnreadNotificationCount);
router.patch('/notifications/:id/read', readNotification);
router.patch('/notifications/read-all', readAllNotifications);

module.exports = router;

import { api } from './api';

export const notificationService = {
  async getNotifications(userId, role) {
    return api.getNotifications(userId, role);
  },

  async getUnreadCount(userId, role) {
    return api.getUnreadNotificationCount(userId, role);
  },

  async markAsRead(id, userId, role) {
    return api.markNotificationAsRead(id, userId, role);
  },

  async markAllAsRead(userId, role) {
    return api.markAllNotificationsAsRead(userId, role);
  }
};

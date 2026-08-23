const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://civiclens-siu8.onrender.com';
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const API_BASE = getApiBaseUrl();

export const api = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using client fallback:', err.message);
      return { success: false, message: 'Backend disconnected' };
    }
  },

  /**
   * Auth endpoints
   */
  async login(credentials) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await res.json();
    } catch (err) {
      console.warn('API Error logging in:', err);
      return { success: false, message: err.message };
    }
  },

  async register(citizenData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citizenData)
      });
      return await res.json();
    } catch (err) {
      console.warn('API Error registering:', err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Fetch all complaints
   */
  async getComplaints() {
    try {
      const res = await fetch(`${API_BASE}/complaints`);
      return await res.json();
    } catch (err) {
      console.warn('API Error fetching complaints:', err);
      return { success: false, data: [] };
    }
  },

  /**
   * Fetch single complaint by ID
   */
  async getComplaintById(id) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`);
      return await res.json();
    } catch (err) {
      console.warn(`API Error fetching complaint ${id}:`, err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Submit new complaint
   */
  async createComplaint(complaintData) {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });
      return await res.json();
    } catch (err) {
      console.warn('API Error creating complaint:', err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Update complaint status or priority
   */
  async updateComplaint(id, updateData) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      return await res.json();
    } catch (err) {
      console.warn(`API Error updating complaint ${id}:`, err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Upvote a complaint
   */
  async upvoteComplaint(id) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/upvote`, {
        method: 'POST'
      });
      return await res.json();
    } catch (err) {
      console.warn(`API Error upvoting complaint ${id}:`, err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Officers endpoint
   */
  async getOfficers() {
    try {
      const res = await fetch(`${API_BASE}/officers`);
      return await res.json();
    } catch (err) {
      console.warn('API Error fetching officers:', err);
      return { success: false, data: [] };
    }
  },

  /**
   * Departments endpoint
   */
  async getDepartments() {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      return await res.json();
    } catch (err) {
      console.warn('API Error fetching departments:', err);
      return { success: false, data: [] };
    }
  },

  /**
   * Analytics & Audit logs
   */
  async getAnalyticsSummary() {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary`);
      return await res.json();
    } catch (err) {
      console.warn('API Error fetching analytics:', err);
      return { success: false };
    }
  },

  async getAuditLogs() {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`);
      return await res.json();
    } catch (err) {
      console.warn('API Error fetching audit logs:', err);
      return { success: false, data: [] };
    }
  },

  async getCitizens() {
    try {
      const res = await fetch(`${API_BASE}/citizens`);
      return await res.json();
    } catch (err) {
      console.warn('API Error fetching citizens:', err);
      return { success: false, data: [] };
    }
  },

  /**
   * Notifications endpoints
   */
  async getNotifications(userId = 'cit-1', role = 'CITIZEN') {
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { 'x-user-id': userId, 'x-user-role': role }
      });
      return await res.json();
    } catch (err) {
      console.warn('API Error fetching notifications:', err);
      return { success: false, unreadCount: 0, data: [] };
    }
  },

  async getUnreadNotificationCount(userId = 'cit-1', role = 'CITIZEN') {
    try {
      const res = await fetch(`${API_BASE}/notifications/unread-count`, {
        headers: { 'x-user-id': userId, 'x-user-role': role }
      });
      return await res.json();
    } catch (err) {
      return { success: false, unreadCount: 0 };
    }
  },

  async markNotificationAsRead(id, userId = 'cit-1', role = 'CITIZEN') {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'x-user-id': userId, 'x-user-role': role }
      });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  async markAllNotificationsAsRead(userId = 'cit-1', role = 'CITIZEN') {
    try {
      const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'x-user-id': userId, 'x-user-role': role }
      });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  }
};


const API_BASE = '/api';

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
  }
};

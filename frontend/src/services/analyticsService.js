import { mockAnalytics, mockAuditLogs, mockCitizens } from '../data/mockData';
import { complaintService } from './complaintService';
import { api } from './api';

export const analyticsService = {
  async getAnalyticsSummary() {
    try {
      const res = await api.getAnalyticsSummary();
      if (res && res.success && res.data) {
        return res;
      }
    } catch (err) {
      console.warn('API Analytics error, falling back:', err);
    }

    const complaintsRes = await complaintService.getComplaints();
    if (complaintsRes.success) {
      const list = complaintsRes.data;
      const total = list.length;
      const resolved = list.filter(i => i.status === 'Resolved').length;
      const rate = total ? ((resolved / total) * 100).toFixed(1) + '%' : '88.4%';
      
      return {
        success: true,
        data: {
          ...mockAnalytics,
          totalComplaints: total,
          resolutionRate: rate
        }
      };
    }
    return { success: true, data: mockAnalytics };
  },

  async getAuditLogs() {
    try {
      const res = await api.getAuditLogs();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res;
      }
    } catch (err) {
      console.warn('API Audit logs error:', err);
    }
    return { success: true, data: mockAuditLogs };
  },

  async getCitizens() {
    try {
      const res = await api.getCitizens();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res;
      }
    } catch (err) {
      console.warn('API Citizens error:', err);
    }
    return { success: true, data: mockCitizens };
  }
};


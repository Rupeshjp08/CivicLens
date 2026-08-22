import { mockAnalytics, mockAuditLogs, mockCitizens } from '../data/mockData';
import { complaintService } from './complaintService';

export const analyticsService = {
  async getAnalyticsSummary() {
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
    await new Promise(r => setTimeout(r, 250));
    return { success: true, data: mockAuditLogs };
  },

  async getCitizens() {
    await new Promise(r => setTimeout(r, 250));
    return { success: true, data: mockCitizens };
  }
};

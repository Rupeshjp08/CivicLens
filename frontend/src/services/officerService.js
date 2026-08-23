import { mockOfficers } from '../data/mockData';
import { complaintService } from './complaintService';
import { api } from './api';

export const officerService = {
  async getOfficers() {
    try {
      const res = await api.getOfficers();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res;
      }
    } catch (err) {
      console.warn('API Error fetching officers:', err);
    }
    return { success: true, data: mockOfficers };
  },

  async getOfficerAssignments(officerId = 'off-1') {
    const res = await complaintService.getComplaints();
    if (res.success) {
      const assigned = res.data.filter(
        (c) => c.assignedOfficerId === officerId || !c.assignedOfficerId
      );
      return { success: true, data: assigned, source: res.source };
    }
    return { success: false, data: [] };
  },

  async submitResolutionEvidence(complaintId, { status, note, resolutionImage, officerName }) {
    return complaintService.updateComplaint(complaintId, {
      status: status || 'In Progress',
      resolutionImage: resolutionImage || undefined,
      note: note || undefined,
      author: officerName || 'Eng. Marcus Vance'
    });
  }
};


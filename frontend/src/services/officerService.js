import { mockOfficers } from '../data/mockData';
import { complaintService } from './complaintService';

export const officerService = {
  async getOfficers() {
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
      author: officerName || 'Municipal officer'
    });
  }
};

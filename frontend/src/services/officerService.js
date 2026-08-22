import { mockOfficers } from '../data/mockData';
import { complaintService } from './complaintService';

export const officerService = {
  async getOfficers() {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, data: mockOfficers };
  },

  async getOfficerAssignments(officerId = 'off-1') {
    const res = await complaintService.getComplaints();
    if (res.success) {
      const assigned = res.data.filter(c => c.assignedOfficerId === officerId || !c.assignedOfficerId);
      return { success: true, data: assigned };
    }
    return { success: false, data: [] };
  },

  async submitResolutionEvidence(complaintId, { resolutionImage, fieldNote, officerName }) {
    return await complaintService.updateComplaint(complaintId, {
      status: 'Resolved',
      resolutionImage: resolutionImage || 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&auto=format&fit=crop&q=60',
      note: fieldNote || 'Field work completed. Resolution evidence uploaded.',
      author: officerName || 'Field Officer'
    });
  }
};

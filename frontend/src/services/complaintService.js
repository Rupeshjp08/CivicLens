import { mockComplaints } from '../data/mockData';
import { api } from './api';

let localComplaints = [...mockComplaints];

export const complaintService = {
  async getComplaints(filters = {}) {
    try {
      // Try backend first
      const res = await api.getComplaints();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.warn('Backend endpoint unavailable, returning mock complaints data:', err);
    }
    return { success: true, data: localComplaints };
  },

  async getComplaintById(id) {
    try {
      const res = await api.getComplaintById(id);
      if (res && res.success && res.data) {
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.warn(`Backend error fetching complaint ${id}, using fallback data:`, err);
    }

    const found = localComplaints.find(c => c.complaintId === id || c._id === id);
    if (found) {
      return { success: true, data: found };
    }
    return { success: false, message: `Complaint ID #${id} not found.` };
  },

  async createComplaint(data) {
    try {
      const res = await api.createComplaint(data);
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      console.warn('Backend API error creating complaint, creating client fallback ticket:', err);
    }

    const newId = `CL-2026-00${Math.floor(100 + Math.random() * 900)}`;
    const newComplaint = {
      _id: `c_${Date.now()}`,
      complaintId: newId,
      title: data.title || 'Civic Infrastructure Concern',
      category: data.category || 'Pothole',
      location: data.location || 'Sector 4, Main Street',
      description: data.description || 'Reported via Citizen Portal.',
      priority: data.category === 'Water Leakage' || data.category === 'Damaged Road' ? 'Critical' : 'High',
      status: 'Pending',
      supportCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      department: data.category === 'Water Leakage' ? 'Water & Utilities' : 'Roads & Infrastructure',
      assignedOfficerId: null,
      assignedOfficerName: 'Unassigned',
      image: data.image || null,
      resolutionImage: null,
      fieldNotes: [
        { timestamp: new Date().toLocaleString(), author: 'System Triage', note: 'Ticket ingested into Municipal Queue.' }
      ]
    };

    localComplaints.unshift(newComplaint);
    return {
      success: true,
      message: 'Complaint submitted successfully',
      data: { complaintId: newId }
    };
  },

  async updateComplaint(id, updateData) {
    try {
      const res = await api.updateComplaint(id, updateData);
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      console.warn(`Backend error updating complaint ${id}, updating local state:`, err);
    }

    localComplaints = localComplaints.map(c => {
      if (c.complaintId === id || c._id === id) {
        const updated = { ...c, ...updateData, updatedAt: new Date().toISOString() };
        if (updateData.note) {
          updated.fieldNotes = [
            ...(updated.fieldNotes || []),
            { timestamp: new Date().toLocaleString(), author: updateData.author || 'Officer / Admin', note: updateData.note }
          ];
        }
        return updated;
      }
      return c;
    });

    const updatedObj = localComplaints.find(c => c.complaintId === id || c._id === id);
    return { success: true, data: updatedObj };
  },

  async upvoteComplaint(id) {
    try {
      const res = await api.upvoteComplaint(id);
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      console.warn(`Backend error upvoting ${id}, updating local support count:`, err);
    }

    let updatedCount = 0;
    localComplaints = localComplaints.map(c => {
      if (c.complaintId === id || c._id === id) {
        updatedCount = (c.supportCount || 0) + 1;
        return { ...c, supportCount: updatedCount };
      }
      return c;
    });

    return { success: true, data: { complaintId: id, supportCount: updatedCount } };
  },

  // AI Triage calculation simulation
  calculateAITriage(category, description = '') {
    switch (category) {
      case 'Water Leakage':
        return {
          category: 'Water Main Burst',
          severity: 'CRITICAL',
          confidence: '96%',
          recommendedDepartment: 'Water & Utilities',
          estimatedSLA: '12-24 hours',
          reason: 'Potential main pipe pressure loss and clean water wastage.'
        };
      case 'Damaged Road':
        return {
          category: 'Power Grid Hazard',
          severity: 'CRITICAL',
          confidence: '94%',
          recommendedDepartment: 'Electrical Services',
          estimatedSLA: '6-12 hours',
          reason: 'Exposed wiring and live electrical hazard risk.'
        };
      case 'Pothole':
        return {
          category: 'Road & Pavement Hazard',
          severity: 'HIGH',
          confidence: '92%',
          recommendedDepartment: 'Roads & Infrastructure',
          estimatedSLA: '24-48 hours',
          reason: 'Traffic obstruction and vehicle damage hazard.'
        };
      case 'Garbage Accumulation':
        return {
          category: 'Sanitation Overflow',
          severity: 'MEDIUM',
          confidence: '90%',
          recommendedDepartment: 'Sanitation & Waste Management',
          estimatedSLA: '48-72 hours',
          reason: 'Public health and odor overflow concern.'
        };
      default:
        return {
          category: 'General Utility Fault',
          severity: 'LOW',
          confidence: '88%',
          recommendedDepartment: 'Public Works',
          estimatedSLA: '72 hours',
          reason: 'Standard municipal inspection and review.'
        };
    }
  }
};

import { mockComplaints } from '../data/mockData';
import { api } from './api';
import { rememberReportId } from '../utils/myReports';

let localComplaints = [...mockComplaints];
let lastBackendOk = true;

const isObjectIdLike = (id) => /^[a-f0-9]{24}$/i.test(String(id || '').trim());

export const complaintService = {
  lastBackendOk() {
    return lastBackendOk;
  },

  async getComplaints() {
    try {
      const res = await api.getComplaints();
      if (res && res.success && Array.isArray(res.data)) {
        lastBackendOk = true;
        localComplaints = res.data;
        return { success: true, data: res.data, source: 'api' };
      }
      lastBackendOk = false;
    } catch (err) {
      lastBackendOk = false;
      console.warn('Backend endpoint unavailable, returning local complaints data:', err);
    }
    return { success: true, data: localComplaints, source: 'demo', offline: true };
  },

  async getComplaintById(id) {
    if (!id || !String(id).trim()) {
      return { success: false, message: 'Enter a complaint reference ID.' };
    }

    const raw = String(id).trim();
    const queryId = raw.toLowerCase();

    try {
      const res = await api.getComplaintById(encodeURIComponent(raw));
      if (res && res.success && res.data) {
        lastBackendOk = true;
        return { success: true, data: res.data, source: 'api' };
      }
      if (res && res.success === false && res.message) {
        lastBackendOk = true;
        const local = localComplaints.find(
          (c) =>
            c.complaintId?.toLowerCase() === queryId ||
            c._id?.toLowerCase() === queryId
        );
        if (local) return { success: true, data: local, source: 'local' };
        return { success: false, message: res.message };
      }
    } catch (err) {
      lastBackendOk = false;
      console.warn(`Backend error fetching complaint ${raw}:`, err);
    }

    const found = localComplaints.find(
      (c) =>
        c.complaintId?.toLowerCase() === queryId ||
        c._id?.toLowerCase() === queryId
    );

    if (found) {
      return { success: true, data: found, source: 'demo', offline: !lastBackendOk };
    }

    if (isObjectIdLike(raw)) {
      return {
        success: false,
        message: 'That looks like an internal record id. Use a public reference such as CIV-3913.'
      };
    }

    return {
      success: false,
      message: lastBackendOk
        ? `No complaint found for ${raw}.`
        : 'Unable to reach the CivicLens API. Check that the backend is running on port 5000.'
    };
  },

  async createComplaint(data) {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        image: data.image || ''
      };
      const res = await api.createComplaint(payload);
      if (res && res.success && res.data) {
        lastBackendOk = true;
        rememberReportId(res.data.complaintId);
        localComplaints.unshift(res.data);
        return { ...res, source: 'api' };
      }
      if (res && res.success === false) {
        lastBackendOk = true;
        return res;
      }
    } catch (err) {
      lastBackendOk = false;
      console.warn('Backend API error creating complaint:', err);
    }

    return {
      success: false,
      message: 'Unable to submit this complaint to the CivicLens API. Confirm the backend is running on port 5000 and try again.'
    };
  },

  async updateComplaint(id, updateData) {
    try {
      const res = await api.updateComplaint(encodeURIComponent(id), updateData);
      if (res && res.success) {
        lastBackendOk = true;
        localComplaints = localComplaints.map((c) =>
          c.complaintId === id || c._id === id ? { ...c, ...res.data } : c
        );
        return res;
      }
    } catch (err) {
      console.warn(`Backend error updating complaint ${id}:`, err);
    }

    const queryId = id?.toLowerCase();
    localComplaints = localComplaints.map((c) => {
      if (c.complaintId?.toLowerCase() === queryId || c._id?.toLowerCase() === queryId) {
        const updated = { ...c, ...updateData, updatedAt: new Date().toISOString() };
        if (updateData.note) {
          updated.fieldNotes = [
            ...(updated.fieldNotes || []),
            {
              timestamp: new Date().toISOString(),
              author: updateData.author || 'Municipal officer',
              note: updateData.note
            }
          ];
        }
        return updated;
      }
      return c;
    });

    const updatedObj = localComplaints.find(
      (c) => c.complaintId?.toLowerCase() === queryId || c._id?.toLowerCase() === queryId
    );
    return { success: Boolean(updatedObj), data: updatedObj, offline: true };
  },

  async addNote(id, payload) {
    return this.updateComplaint(id, payload);
  },

  async upvoteComplaint(id) {
    try {
      const res = await api.upvoteComplaint(encodeURIComponent(id));
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      console.warn(`Backend error upvoting ${id}:`, err);
    }

    let updatedCount = 0;
    const queryId = id?.toLowerCase();
    localComplaints = localComplaints.map((c) => {
      if (c.complaintId?.toLowerCase() === queryId || c._id?.toLowerCase() === queryId) {
        updatedCount = (c.supportCount || 0) + 1;
        return { ...c, supportCount: updatedCount };
      }
      return c;
    });

    return { success: true, data: { complaintId: id, supportCount: updatedCount }, offline: true };
  }
};

import { mockDepartments } from '../data/mockData';
import { api } from './api';

export const departmentService = {
  async getDepartments() {
    try {
      const res = await api.getDepartments();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res;
      }
    } catch (err) {
      console.warn('API Error fetching departments:', err);
    }
    return { success: true, data: mockDepartments };
  },

  async getDepartmentById(id) {
    const res = await this.getDepartments();
    if (res.success && Array.isArray(res.data)) {
      const dept = res.data.find(d => d.id === id || d._id === id || d.code === id);
      if (dept) return { success: true, data: dept };
    }
    return { success: false, message: 'Department not found' };
  }
};


import { mockDepartments } from '../data/mockData';

export const departmentService = {
  async getDepartments() {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, data: mockDepartments };
  },

  async getDepartmentById(id) {
    const dept = mockDepartments.find(d => d.id === id);
    if (dept) return { success: true, data: dept };
    return { success: false, message: 'Department not found' };
  }
};

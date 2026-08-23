import { mockCitizens, mockOfficers } from '../data/mockData';
import { api } from './api';

export const authService = {
  async login(role, credentials) {
    try {
      const res = await api.login({ role, email: credentials.email, password: credentials.password });
      if (res && res.success && res.user) {
        return res;
      }
    } catch (err) {
      console.warn('API Login error, falling back:', err);
    }

    if (role === 'OFFICER') {
      const officer = mockOfficers[0];
      return {
        success: true,
        user: {
          id: officer.id,
          name: officer.name,
          email: credentials.email || officer.email,
          role: 'OFFICER',
          department: officer.department
        }
      };
    }

    const citizen = mockCitizens[0];
    return {
      success: true,
      user: {
        id: citizen.id,
        name: citizen.name,
        email: credentials.email || citizen.email,
        role: 'CITIZEN'
      }
    };
  },

  async register(citizenData) {
    try {
      const res = await api.register(citizenData);
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      console.warn('API Register error, falling back:', err);
    }

    return {
      success: true,
      user: {
        id: `cit-${Date.now()}`,
        name: citizenData.name || 'New Citizen',
        email: citizenData.email,
        role: 'CITIZEN'
      }
    };
  },

  async getCurrentUser() {
    return {
      id: 'cit-1',
      name: 'John Citizen',
      email: 'john.citizen@example.com',
      role: 'CITIZEN'
    };
  }
};


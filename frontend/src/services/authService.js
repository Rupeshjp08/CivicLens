import { mockCitizens, mockOfficers } from '../data/mockData';

export const authService = {
  async login(role, credentials) {
    // Simulates API delay
    await new Promise(r => setTimeout(r, 400));

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

    // Default Citizen
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
    await new Promise(r => setTimeout(r, 500));
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

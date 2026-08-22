import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'cit-1',
    name: 'John Citizen',
    email: 'john.citizen@example.com',
    role: 'CITIZEN'
  });

  const switchRole = (newRole) => {
    if (newRole === 'OFFICER') {
      setUser({
        id: 'off-1',
        name: 'Eng. Marcus Vance',
        email: 'marcus.vance@govtech.city',
        role: 'OFFICER',
        department: 'Roads & Infrastructure'
      });
    } else {
      setUser({
        id: 'cit-1',
        name: 'John Citizen',
        email: 'john.citizen@example.com',
        role: 'CITIZEN'
      });
    }
  };

  const login = (role, userData) => {
    const assignedRole = role === 'OFFICER' ? 'OFFICER' : 'CITIZEN';
    setUser({ ...userData, role: assignedRole });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'CITIZEN', switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

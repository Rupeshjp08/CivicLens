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
    if (newRole === 'ADMIN') {
      setUser({
        id: 'adm-1',
        name: 'Administrator Operations',
        email: 'admin@govtech.city',
        role: 'ADMIN',
        department: 'Municipal Operations Center'
      });
    } else if (newRole === 'OFFICER') {
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
    setUser({ ...userData, role });
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

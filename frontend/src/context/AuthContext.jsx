import React, { createContext, useContext, useEffect, useState } from 'react';
import { seedDemoReports } from '../utils/myReports';

const AuthContext = createContext();
const SESSION_KEY = 'civiclens_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role === 'CITIZEN' || parsed?.role === 'OFFICER') {
          setUser(parsed);
          if (parsed.role === 'CITIZEN') seedDemoReports();
        }
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setReady(true);
  }, []);

  const persist = (nextUser) => {
    setUser(nextUser);
    if (nextUser) sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    else sessionStorage.removeItem(SESSION_KEY);
  };

  const login = (role, userData) => {
    const assignedRole = role === 'OFFICER' ? 'OFFICER' : 'CITIZEN';
    const next = { ...userData, role: assignedRole };
    if (assignedRole === 'CITIZEN') seedDemoReports();
    persist(next);
  };

  const logout = () => {
    persist(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ role, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="page-shell" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading session…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    const to = (user.role === 'OFFICER' || user.role === 'ADMIN') ? '/officer/dashboard' : '/citizen/dashboard';
    return <Navigate to={to} replace />;
  }

  return children;
}

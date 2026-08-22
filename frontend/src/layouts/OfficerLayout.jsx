import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, MapPin, History, LogOut, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OfficerLayout() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: 'calc(100vh - 65px)' }}>
      {/* Officer Mobile Sub-header */}
      <div style={{ background: '#0e1420', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Truck color="#10B981" size={20} />
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name || 'Field Officer'}</span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>{user?.department || 'Field Operations'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <NavLink to="/officer/dashboard" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={15} />
            <span>Tasks</span>
          </NavLink>
          <NavLink to="/officer/assignments" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
            <CheckSquare size={15} />
            <span>Queue</span>
          </NavLink>
          <NavLink to="/officer/map" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
            <MapPin size={15} />
            <span>Field Map</span>
          </NavLink>
          <NavLink to="/officer/history" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
            <History size={15} />
            <span>History</span>
          </NavLink>
        </div>
      </div>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.75rem 1.25rem 4rem 1.25rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Home, 
  PlusCircle, 
  Search, 
  Compass, 
  LayoutDashboard,
  MapPin,
  BarChart3,
  Sliders,
  Bell,
  Truck,
  Menu,
  X,
  User,
  List,
  Layers,
  History,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, switchRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOfficer = location.pathname.startsWith('/officer') || role === 'OFFICER';

  const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: Home },
    { to: '/report', label: 'Report', icon: PlusCircle },
    { to: '/track', label: 'Track', icon: Search },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/citizen/notifications', label: 'Notifications', icon: Bell },
    { to: '/citizen/profile', label: 'Profile', icon: User }
  ];

  const officerLinks = [
    { to: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/officer/queue', label: 'Priority Queue', icon: Sliders },
    { to: '/officer/complaints', label: 'Complaints', icon: List },
    { to: '/officer/clusters', label: 'Clusters', icon: Layers },
    { to: '/officer/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/officer/history', label: 'History', icon: History }
  ];

  const links = isOfficer ? officerLinks : citizenLinks;

  return (
    <header className="top-header">
      <div className="top-header-inner">
        {/* Brand & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <NavLink to={isOfficer ? '/officer/dashboard' : '/'} className="header-brand">
            <div className="brand-icon-box">
              <Building2 size={19} />
            </div>
            <span>CivicLens</span>
          </NavLink>

          <div className="system-status-pill">
            <span className="pulse-dot" />
            <span>Municipal Mesh Connected</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: 2, listStyle: 'none' }}>
            {links.map(link => {
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={15} />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right: Role Switcher & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Notification bell for Citizen */}
          {!isOfficer && (
            <button
              type="button"
              className="btn-ghost btn-icon"
              onClick={() => navigate('/citizen/notifications')}
              style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36, height: 36,
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: 'var(--text-muted)',
                border: 'none'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute',
                top: 4, right: 4,
                width: 7, height: 7,
                borderRadius: '50%',
                background: 'var(--status-critical)',
                border: '2px solid var(--bg-panel)'
              }} />
            </button>
          )}

          {/* 2-Role Switcher (Citizen vs Officer) */}
          <div className="portal-switcher">
            <button
              type="button"
              className={`switcher-btn ${!isOfficer ? 'active' : ''}`}
              onClick={() => { switchRole('CITIZEN'); navigate('/citizen/dashboard'); setMobileOpen(false); }}
            >
              <User size={13} />
              <span>Citizen</span>
            </button>
            <button
              type="button"
              className={`switcher-btn ${isOfficer ? 'active' : ''}`}
              onClick={() => { switchRole('OFFICER'); navigate('/officer/dashboard'); setMobileOpen(false); }}
            >
              <Truck size={13} />
              <span>Officer</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              width: 36, height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {mobileOpen && (
        <div className="mobile-nav-dropdown" style={{
          position: 'absolute',
          top: '100%', left: 0, right: 0,
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-color)',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
          animation: 'slideUp var(--duration-normal) var(--ease-out)',
          zIndex: 99
        }}>
          {links.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                style={{ padding: 'var(--space-3) var(--space-4)' }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

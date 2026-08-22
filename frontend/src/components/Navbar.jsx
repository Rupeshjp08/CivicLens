import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Home, 
  PlusCircle, 
  Search, 
  Compass, 
  ShieldAlert,
  Activity,
  LayoutDashboard,
  MapPin,
  BarChart3,
  Sliders,
  Bell,
  User,
  Truck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, switchRole } = useAuth();

  const isAdmin = location.pathname.startsWith('/admin') || role === 'ADMIN';
  const isOfficer = location.pathname.startsWith('/officer') || role === 'OFFICER';

  return (
    <header className="top-header">
      <div className="top-header-inner">
        {/* Brand & Live Mesh Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <NavLink to="/" className="header-brand">
            <div className="brand-icon-box">
              <Building2 size={20} />
            </div>
            <span>CivicLens</span>
          </NavLink>

          <div className="system-status-pill">
            <span className="pulse-dot" />
            <span>Municipal Mesh Connected</span>
          </div>
        </div>

        {/* Dynamic Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isAdmin && !isOfficer ? (
            <ul style={{ display: 'flex', gap: '0.35rem', listStyle: 'none' }}>
              <li>
                <NavLink to="/" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`} end>
                  <Home size={15} />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/report" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <PlusCircle size={15} />
                  <span>Report</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/track" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <Search size={15} />
                  <span>Track</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/explore" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <Compass size={15} />
                  <span>Explore</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/citizen/notifications" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <Bell size={15} />
                  <span>Updates</span>
                </NavLink>
              </li>
            </ul>
          ) : isAdmin ? (
            <ul style={{ display: 'flex', gap: '0.35rem', listStyle: 'none' }}>
              <li>
                <NavLink to="/admin" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`} end>
                  <LayoutDashboard size={15} />
                  <span>Overview</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/management" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <Sliders size={15} />
                  <span>Triage</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/hotspots" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <MapPin size={15} />
                  <span>Hotspots</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/analytics" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <BarChart3 size={15} />
                  <span>Analytics</span>
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul style={{ display: 'flex', gap: '0.35rem', listStyle: 'none' }}>
              <li>
                <NavLink to="/officer/dashboard" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <Truck size={15} />
                  <span>Dispatches</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/officer/assignments" className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}>
                  <Sliders size={15} />
                  <span>Queue</span>
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* Portal Switcher & Account Direct Gateway */}
        <div className="portal-switcher">
          <button
            type="button"
            className={`switcher-btn ${!isAdmin && !isOfficer ? 'active' : ''}`}
            onClick={() => { switchRole('CITIZEN'); navigate('/'); }}
          >
            <span>Citizen</span>
          </button>
          <button
            type="button"
            className={`switcher-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => { switchRole('ADMIN'); navigate('/admin'); }}
          >
            <ShieldAlert size={14} />
            <span>Admin</span>
          </button>
          <button
            type="button"
            className={`switcher-btn ${isOfficer ? 'active' : ''}`}
            onClick={() => { switchRole('OFFICER'); navigate('/officer/dashboard'); }}
          >
            <Truck size={14} />
            <span>Officer</span>
          </button>
        </div>
      </div>
    </header>
  );
}

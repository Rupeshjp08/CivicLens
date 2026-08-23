import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Building2, Menu, X, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const links = [
  { to: '/citizen/dashboard', label: 'Overview', end: true },
  { to: '/citizen/report', label: 'Report Issue' },
  { to: '/citizen/complaints', label: 'My Complaints' },
  { to: '/citizen/track', label: 'Track' },
  { to: '/citizen/explore', label: 'Explore' },
  { to: '/citizen/notifications', label: 'Notifications' },
  { to: '/citizen/profile', label: 'Profile' }
];

export default function CitizenHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="header-brand" onClick={() => setOpen(false)}>
          <div className="brand-icon-box" aria-hidden="true">
            <Building2 size={18} />
          </div>
          <span>CivicLens</span>
        </Link>

        <nav className="desktop-nav" aria-label="Citizen">
          <ul className="site-nav">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <NotificationDropdown />

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost btn-icon desktop-nav"
            aria-label="Log Out"
            title="Log Out of Citizen Portal"
            style={{ color: 'var(--text-muted)' }}
          >
            <LogOut size={18} />
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-icon nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav-panel${open ? ' is-open' : ''}`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'flex-start', color: '#EF4444', gap: '0.5rem', marginTop: '0.5rem' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}

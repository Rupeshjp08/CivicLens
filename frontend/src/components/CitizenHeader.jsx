import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Building2, Menu, X, Bell } from 'lucide-react';

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

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/citizen/dashboard" className="header-brand" onClick={() => setOpen(false)}>
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
          <Link
            to="/citizen/notifications"
            className="btn btn-ghost btn-icon"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </Link>
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
      </div>
    </header>
  );
}

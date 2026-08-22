import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';

const links = [
  { to: '/citizen/report', label: 'Report an Issue' },
  { to: '/track', label: 'Track Complaint' },
  { to: '/explore', label: 'Explore Issues' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' }
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="header-brand" onClick={() => setOpen(false)}>
          <div className="brand-icon-box" aria-hidden="true">
            <Building2 size={18} />
          </div>
          <span>CivicLens</span>
        </Link>

        <nav className="desktop-nav" aria-label="Public">
          <ul className="site-nav">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-secondary btn-sm desktop-nav">
            Sign In
          </Link>
          <Link to="/citizen/report" className="btn btn-primary btn-sm desktop-nav">
            Report an Issue
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
            className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/login" className="btn btn-secondary" onClick={() => setOpen(false)}>
          Sign In
        </Link>
        <Link to="/citizen/report" className="btn btn-primary" onClick={() => setOpen(false)}>
          Report an Issue
        </Link>
      </div>
    </header>
  );
}

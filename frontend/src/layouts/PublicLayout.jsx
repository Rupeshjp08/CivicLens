import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useDocumentTheme } from './useDocumentTheme';

export default function PublicLayout() {
  const location = useLocation();
  const isOfficerLogin = location.pathname.startsWith('/officer/login');
  useDocumentTheme(isOfficerLogin ? 'officer' : 'public');

  return (
    <div className="civic-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PublicHeader />
      <main id="main-content" className="civic-main">
        <div className={location.pathname === '/' ? 'landing-wrap' : 'content-container'}>
          <Outlet />
        </div>
      </main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>CivicLens</span>
          <nav aria-label="Footer">
            <NavLink to="/how-it-works">How it works</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/officer/login">Officer portal</NavLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useDocumentTheme } from './useDocumentTheme';

export default function PublicLayout() {
  useDocumentTheme('public');

  return (
    <div className="civic-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PublicHeader />
      <main id="main-content" className="civic-main">
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

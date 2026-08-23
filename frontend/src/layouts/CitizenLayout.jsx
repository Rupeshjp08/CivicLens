import React from 'react';
import { Outlet } from 'react-router-dom';
import CitizenHeader from '../components/CitizenHeader';
import { useDocumentTheme } from './useDocumentTheme';
import RequireAuth from '../components/RequireAuth';

export default function CitizenLayout() {
  useDocumentTheme('citizen');

  return (
    <RequireAuth role="CITIZEN">
      <div className="civic-shell">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <CitizenHeader />
        <main id="main-content" className="civic-main">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

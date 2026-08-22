import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sliders,
  List,
  Layers,
  Map,
  BarChart3,
  History,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocumentTheme } from './useDocumentTheme';

const navItems = [
  { label: 'Command Center', path: '/officer/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Priority Queue', path: '/officer/queue', icon: Sliders },
  { label: 'Complaints', path: '/officer/complaints', icon: List, end: true },
  { label: 'Clusters', path: '/officer/clusters', icon: Layers },
  { label: 'Map', path: '/officer/map', icon: Map },
  { label: 'Analytics', path: '/officer/analytics', icon: BarChart3 },
  { label: 'History', path: '/officer/history', icon: History },
  { label: 'Profile', path: '/officer/profile', icon: User }
];

export default function OfficerLayout() {
  useDocumentTheme('officer');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="officer-shell">
      <a href="#officer-main" className="skip-link">Skip to content</a>

      <header className="officer-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button
            type="button"
            className="btn btn-ghost btn-icon nav-toggle"
            aria-label={mobileOpen ? 'Close operations menu' : 'Open operations menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="header-brand" style={{ fontSize: 'var(--text-lg)' }}>
            <span className="brand-icon-box" aria-hidden="true">
              <Building2 size={16} />
            </span>
            CivicLens
          </span>
        </div>
        <span className="text-caption">Municipal operations</span>
      </header>

      <div className="officer-body">
        <div
          className={`ops-backdrop${mobileOpen ? ' is-visible' : ''}`}
          onClick={closeMobile}
          aria-hidden="true"
        />

        <aside
          className={`ops-sidebar admin-sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' is-open' : ''}`}
          style={{ width: mobileOpen ? undefined : collapsed ? 64 : 256 }}
        >
          <div
            style={{
              padding: collapsed && !mobileOpen ? 'var(--space-3)' : 'var(--space-4)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: collapsed && !mobileOpen ? 'center' : 'space-between',
              alignItems: 'center',
              minHeight: 52
            }}
          >
            {(!collapsed || mobileOpen) && (
              <span
                className="font-mono"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em'
                }}
              >
                Operations
              </span>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-icon ops-collapse-btn"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: 28, height: 28 }}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          <nav aria-label="Officer" style={{ flex: 1, padding: 'var(--space-3) 0' }}>
            <div className="admin-sidebar-section">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={{
                      justifyContent: collapsed && !mobileOpen ? 'center' : 'flex-start',
                      padding: collapsed && !mobileOpen ? 'var(--space-3)' : 'var(--space-2) var(--space-4)'
                    }}
                    title={collapsed ? item.label : undefined}
                    onClick={closeMobile}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
                    {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div
            style={{
              padding: 'var(--space-3)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}
          >
            {(!collapsed || mobileOpen) && (
              <div
                style={{
                  padding: 'var(--space-3)',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.name || 'Officer'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {user?.department || 'Municipal staff'}
                </div>
              </div>
            )}

            <button
              type="button"
              className="sidebar-link"
              onClick={() => {
                switchRole('CITIZEN');
                closeMobile();
                navigate('/');
              }}
              style={{
                justifyContent: collapsed && !mobileOpen ? 'center' : 'flex-start',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: 'var(--text-sm)',
                fontWeight: 600
              }}
            >
              <LogOut size={15} aria-hidden="true" />
              {(!collapsed || mobileOpen) && <span>Exit to public site</span>}
            </button>
          </div>
        </aside>

        <main id="officer-main" className="officer-main">
          <div className="ops-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

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
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocumentTheme } from './useDocumentTheme';
import RequireAuth from '../components/RequireAuth';

const navItems = [
  { label: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Priority Queue', path: '/officer/queue', icon: Sliders },
  { label: 'Assignments', path: '/officer/assignments', icon: List },
  { label: 'Map', path: '/officer/map', icon: Map },
  { label: 'Clusters', path: '/officer/clusters', icon: Layers },
  { label: 'Analytics', path: '/officer/analytics', icon: BarChart3 },
  { label: 'History', path: '/officer/history', icon: History }
];

export default function OfficerLayout() {
  useDocumentTheme('officer');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMobile = () => setMobileOpen(false);

  return (
    <RequireAuth role="OFFICER">
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
          <span className="header-brand" style={{ fontSize: '1.25rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#16A34A',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 3px 8px rgba(22, 163, 74, 0.3)'
              }}
              aria-hidden="true"
            >
              <Building2 size={17} />
            </span>
            <span>
              <span style={{ color: '#0F172A', fontWeight: 800 }}>Civic</span>
              <span style={{ color: '#16A34A', fontWeight: 800 }}>Lens</span>
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(22, 163, 74, 0.08)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              color: '#16A34A',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }}></span>
            Municipal operations
          </span>
        </div>
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
                OPERATIONS MENU
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
                  padding: '0.75rem',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(22, 163, 74, 0.1)',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  MV
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || 'Eng. Marcus Vance'}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16A34A' }}></span>
                    {user?.department || 'Roads & Infrastructure'}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              className="sidebar-link"
              onClick={() => {
                logout();
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
    </RequireAuth>
  );
}

import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sliders, 
  List, 
  Layers, 
  BarChart3, 
  History, 
  User, 
  Truck, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OfficerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Priority Queue', path: '/officer/queue', icon: Sliders },
    { label: 'Complaints', path: '/officer/complaints', icon: List },
    { label: 'Clusters', path: '/officer/clusters', icon: Layers },
    { label: 'Analytics', path: '/officer/analytics', icon: BarChart3 },
    { label: 'History', path: '/officer/history', icon: History },
    { label: 'Profile', path: '/officer/profile', icon: User }
  ];

  const statusMap = {
    'On Field': { color: '#10B981', label: 'On Field' },
    'Available': { color: '#3B82F6', label: 'Available' },
    'Busy': { color: '#F59E0B', label: 'Busy' }
  };
  const userStatus = statusMap['On Field'];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: 'var(--bg-canvas)' }}>
      {/* Officer Operations Sidebar */}
      <aside 
        className="admin-sidebar" 
        style={{ width: collapsed ? 64 : 256 }}
      >
        {/* Sidebar Header */}
        <div style={{ 
          padding: collapsed ? 'var(--space-3)' : 'var(--space-4)', 
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: collapsed ? 'center' : 'space-between', 
          alignItems: 'center',
          minHeight: 52
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Truck size={16} color="var(--status-emerald)" />
              <span className="font-mono" style={{ 
                fontSize: 10, 
                fontWeight: 800, 
                color: 'var(--status-emerald)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em' 
              }}>
                Officer Command
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 28, height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation items */}
        <nav style={{ flex: 1, padding: 'var(--space-3) 0', overflowY: 'auto' }}>
          <div className="admin-sidebar-section">
            {!collapsed && (
              <div className="admin-sidebar-label">Operations</div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  style={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? 'var(--space-3)' : 'var(--space-2) var(--space-4)',
                    margin: collapsed ? '1px var(--space-1)' : '1px var(--space-2)'
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div style={{ 
          padding: 'var(--space-3)', 
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }}>
          {!collapsed && (
            <div style={{ 
              padding: 'var(--space-3)', 
              background: 'var(--bg-elevated)', 
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.name || 'Officer Marcus Vance'}
                </span>
                <span style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 9, fontWeight: 700,
                  color: userStatus.color
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: userStatus.color }} />
                  {userStatus.label}
                </span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                {user?.department || 'Roads & Infrastructure'}
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => { switchRole('CITIZEN'); navigate('/citizen/dashboard'); }}
            className="sidebar-link"
            style={{ 
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'var(--status-critical)',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              padding: collapsed ? 'var(--space-3)' : 'var(--space-2) var(--space-4)'
            }}
          >
            <LogOut size={15} />
            {!collapsed && <span>Switch to Citizen</span>}
          </button>
        </div>
      </aside>

      {/* Main Outlet */}
      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-6) var(--space-16) var(--space-6)', minWidth: 0, maxWidth: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

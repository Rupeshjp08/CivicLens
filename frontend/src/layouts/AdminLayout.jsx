import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sliders, 
  MapPin, 
  BarChart3, 
  Building2, 
  Users, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Incident Triage', path: '/admin/management', icon: Sliders },
    { label: 'Hotspot Map', path: '/admin/hotspots', icon: MapPin },
    { label: 'Analytics Engine', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Field Officers', path: '/admin/officers', icon: Users },
    { label: 'SLA Monitor', path: '/admin/sla', icon: Clock },
    { label: 'Escalations', path: '/admin/escalations', icon: AlertTriangle },
    { label: 'Citizens Directory', path: '/admin/citizens', icon: ShieldCheck },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText }
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)', background: 'var(--bg-canvas)' }}>
      {/* Collapsible Admin Sidebar */}
      <aside style={{
        width: collapsed ? '72px' : '250px',
        background: '#0d121c',
        borderRight: '1px solid var(--border-color)',
        transition: 'width 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: '65px',
        height: 'calc(100vh - 65px)',
        zIndex: 90
      }}>
        {/* Toggle Button */}
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: collapsed ? 'center' : 'space-between', alignItems: 'center' }}>
          {!collapsed && (
            <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ADMIN COMMAND
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-secondary"
            style={{ padding: '0.3rem', borderRadius: '4px' }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav style={{ flex: 1, padding: '0.85rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `switcher-btn ${isActive ? 'active' : ''}`}
                style={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '0.65rem' : '0.6rem 0.85rem',
                  fontSize: '0.86rem'
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={16} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Switcher */}
        <div style={{ padding: '0.85rem 0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { switchRole('CITIZEN'); navigate('/'); }}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', fontSize: '0.82rem', padding: '0.5rem' }}
          >
            <LogOut size={15} color="#EF4444" />
            {!collapsed && <span>Return to Citizen</span>}
          </button>
        </div>
      </aside>

      {/* Main Admin Outlet */}
      <main style={{ flex: 1, padding: '2rem 1.75rem 4rem 1.75rem', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}

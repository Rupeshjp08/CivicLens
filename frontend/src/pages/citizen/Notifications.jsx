import React from 'react';
import { Bell, CheckCircle2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 'n1',
      title: 'Work Order Dispatched for #CL-2026-00101',
      message: 'Field Crew 3 under Eng. Marcus Vance has been assigned to patch Sector 4 Pothole.',
      timestamp: '10 minutes ago',
      type: 'dispatch',
      unread: true
    },
    {
      id: 'n2',
      title: 'Status Updated to VERIFIED RESOLVED',
      message: 'Streetlight blackout #CL-2026-00104 marked resolved by Electrical Services.',
      timestamp: '2 hours ago',
      type: 'resolved',
      unread: false
    },
    {
      id: 'n3',
      title: 'Emergency Priority Alert Triggered',
      message: 'Water main burst #CL-2026-00102 auto-classified as CRITICAL Priority.',
      timestamp: '1 day ago',
      type: 'alert',
      unread: false
    }
  ];

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
            NOTIFICATIONS CENTER
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>System & Ticket Updates</h1>
        </div>

        <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
          Mark All as Read
        </button>
      </div>

      <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map((item) => (
          <div
            key={item.id}
            style={{
              background: item.unread ? '#182030' : '#0d121c',
              border: item.unread ? '1px solid var(--brand-blue)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.15rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: item.type === 'resolved' ? 'var(--status-emerald-bg)' : item.type === 'alert' ? 'var(--status-critical-bg)' : 'rgba(59, 130, 246, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {item.type === 'resolved' ? <CheckCircle2 size={18} color="#10B981" /> : item.type === 'alert' ? <ShieldAlert size={18} color="#EF4444" /> : <Bell size={18} color="#3B82F6" />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</h4>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.timestamp}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

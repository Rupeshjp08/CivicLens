import React from 'react';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SLAMonitor() {
  const slaMetrics = [
    { title: 'Within SLA Velocity', count: 320, percent: '92%', color: '#10B981' },
    { title: 'Approaching SLA ( < 6 hrs)', count: 24, percent: '6%', color: '#F59E0B' },
    { title: 'Overdue / SLA Breach', count: 8, percent: '2%', color: '#EF4444' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <Clock color="#3B82F6" size={24} />
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Service Level Agreement (SLA) Monitor</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Municipal SLA compliance tracking, automated escalation velocity, and overdue ticket audit.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {slaMetrics.map((item, idx) => (
          <div key={idx} className="panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${item.color}` }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>{item.title}</div>
            <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem', color: item.color }}>{item.count} Tickets</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{item.percent} of active queue</div>
          </div>
        ))}
      </div>
    </div>
  );
}

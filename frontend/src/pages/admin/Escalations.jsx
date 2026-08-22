import React from 'react';
import { AlertTriangle, Send, ShieldAlert } from 'lucide-react';

export default function Escalations() {
  const escalations = [
    { id: 'ESC-901', complaintId: 'CL-2026-00102', title: 'Main Water Line Burst Overflowing', level: 'Level 2 Escalation', dept: 'Water & Utilities', officer: 'Tech. Sarah Jenkins', time: '14 min ago' },
    { id: 'ESC-902', complaintId: 'CL-2026-00105', title: 'Live Transformer Wire Hazard', level: 'Level 3 Emergency', dept: 'Electrical Services', officer: 'Elec. David Miller', time: '32 min ago' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <AlertTriangle color="#EF4444" size={24} />
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Emergency Escalations Queue</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          High-priority emergency alerts and SLA breach escalations requiring immediate municipal dispatch override.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {escalations.map((esc) => (
          <div key={esc.id} className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #EF4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#EF4444', background: 'rgba(239, 68, 68, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  {esc.level}
                </span>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--brand-blue)' }}>#{esc.complaintId}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{esc.title}</h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Assigned: {esc.officer} ({esc.dept}) | {esc.time}
              </div>
            </div>

            <button type="button" onClick={() => alert(`Emergency dispatch re-triggered for ${esc.complaintId}`)} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
              <Send size={15} />
              <span>Trigger Override Dispatch</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';

export default function OfficerHistory() {
  const historyItems = [
    { id: 'CL-2026-00104', title: 'Streetlight Blackout Walkway', date: '2026-08-20', status: 'Verified Resolved', rating: '98% SLA Score' },
    { id: 'CL-2026-00088', title: 'Guardrail Repair Sector 2', date: '2026-08-15', status: 'Verified Resolved', rating: '96% SLA Score' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          WORK HISTORY & AUDIT
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Completed Field Work</h1>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Task Title</th>
              <th>Date Resolved</th>
              <th>Status</th>
              <th>Performance Score</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((h) => (
              <tr key={h.id}>
                <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>#{h.id}</td>
                <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{h.title}</td>
                <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{h.date}</td>
                <td><span className="badge badge-resolved">{h.status}</span></td>
                <td className="font-mono" style={{ fontWeight: 700, color: '#10B981' }}>{h.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

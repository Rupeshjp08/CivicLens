import React, { useEffect, useState } from 'react';
import { FileText, Clock, Shield } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    analyticsService.getAuditLogs().then(res => {
      if (res.success) setLogs(res.data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <FileText color="#3B82F6" size={24} />
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Municipal Audit Logs & Trail</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Immutable system timeline recording status transitions, officer dispatches, and emergency triage triggers.
        </p>
      </div>

      <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {logs.map((log) => (
          <div key={log.id} style={{ background: '#182030', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', background: 'rgba(59, 130, 246, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  {log.role}
                </span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{log.actor}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{log.action}</p>
            </div>

            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {log.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

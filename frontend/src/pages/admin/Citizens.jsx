import React, { useEffect, useState } from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

export default function Citizens() {
  const [citizens, setCitizens] = useState([]);

  useEffect(() => {
    analyticsService.getCitizens().then(res => {
      if (res.success) setCitizens(res.data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <ShieldCheck color="#3B82F6" size={24} />
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Registered Citizens Directory</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Privacy-compliant citizen directory and participation activity metrics.
        </p>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Citizen Name</th>
              <th>Account Email</th>
              <th>Total Reports</th>
              <th>Verified Resolved</th>
              <th>Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {citizens.map((cit) => (
              <tr key={cit.id}>
                <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{cit.name}</td>
                <td className="font-mono">{cit.email}</td>
                <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>{cit.complaintsCount}</td>
                <td className="font-mono" style={{ fontWeight: 700, color: '#10B981' }}>{cit.resolvedCount}</td>
                <td><span className="badge badge-resolved">{cit.status}</span></td>
                <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cit.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Users, Truck, CheckCircle2, Phone, Mail } from 'lucide-react';
import { officerService } from '../../services/officerService';

export default function Officers() {
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    officerService.getOfficers().then(res => {
      if (res.success) setOfficers(res.data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <Users color="#3B82F6" size={24} />
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Field Officers Roster</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Directory of deployed field engineers, task capacity, and contact channels.
        </p>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Officer Name</th>
              <th>Department</th>
              <th>Status</th>
              <th>Active Tasks</th>
              <th>Completed Tasks</th>
              <th>SLA Rating</th>
              <th>Contact Info</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((off) => (
              <tr key={off.id}>
                <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{off.name}</td>
                <td>{off.department}</td>
                <td>
                  <span className={`badge ${off.status === 'On Field' ? 'badge-progress' : off.status === 'Busy' ? 'badge-pending' : 'badge-resolved'}`}>
                    {off.status}
                  </span>
                </td>
                <td className="font-mono" style={{ fontWeight: 700, color: '#F59E0B' }}>{off.activeTasks}</td>
                <td className="font-mono" style={{ fontWeight: 700, color: '#10B981' }}>{off.completedTasks}</td>
                <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>{off.slaRate}</td>
                <td className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {off.phone} | {off.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

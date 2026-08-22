import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, MapPin, ArrowRight } from 'lucide-react';
import { officerService } from '../../services/officerService';

export default function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    officerService.getOfficerAssignments().then(res => {
      if (res.success) setAssignments(res.data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          WORK ORDER QUEUE
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Assigned Dispatches</h1>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Work Order ID</th>
              <th>Issue Title</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item) => (
              <tr key={item.complaintId || item._id}>
                <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>#{item.complaintId}</td>
                <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</td>
                <td><span className={`badge badge-${item.priority?.toLowerCase() || 'medium'}`}>{item.priority}</span></td>
                <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.location}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => navigate(`/officer/complaints/${item.complaintId}`)}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                  >
                    <span>Open Work Order</span>
                    <ArrowRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

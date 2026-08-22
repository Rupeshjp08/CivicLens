import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckSquare, Clock, AlertTriangle, ArrowRight, MapPin, Send } from 'lucide-react';
import { officerService } from '../../services/officerService';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    officerService.getOfficerAssignments().then(res => {
      setLoading(false);
      if (res.success) setAssignments(res.data);
    });
  }, []);

  const criticalTasks = assignments.filter(a => a.priority === 'Critical' || a.priority === 'High');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          FIELD OPERATIONS DASHBOARD
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Today's Field Assignments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Active dispatches requiring site inspection, repair work, or resolution evidence upload.
        </p>
      </div>

      {/* Critical Immediate Dispatch Banner */}
      {criticalTasks.length > 0 && (
        <div className="panel" style={{ padding: '1.25rem', borderLeft: '4px solid #EF4444', background: 'rgba(239, 68, 68, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="#EF4444" />
            <div>
              <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.95rem' }}>CRITICAL DISPATCH PRIORITIZED</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {criticalTasks[0].title} — {criticalTasks[0].location}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/officer/complaints/${criticalTasks[0].complaintId}`)}
            className="btn btn-danger"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          >
            <span>Open High Priority Work Order</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Task Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading assignments...</div>
        ) : (
          assignments.map((item) => (
            <div key={item.complaintId || item._id} className="panel" style={{ padding: '1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-medium font-mono">#{item.complaintId}</span>
                  <span className={`badge badge-${item.priority?.toLowerCase() || 'medium'}`}>{item.priority} Priority</span>
                  <span className="badge badge-progress">{item.status}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</h3>
                <div className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                  <MapPin size={14} color="#3B82F6" />
                  <span>{item.location}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/officer/complaints/${item.complaintId}`)}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', background: '#10B981', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <span>Inspect & Complete</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

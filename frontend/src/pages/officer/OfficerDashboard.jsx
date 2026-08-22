import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, AlertTriangle, ArrowRight, MapPin, CheckSquare, Clock, ShieldCheck } from 'lucide-react';
import { officerService } from '../../services/officerService';
import StatusBadge from '../../components/StatusBadge';
import PriorityScore from '../../components/PriorityScore';
import KpiCard from '../../components/KpiCard';
import EmptyState from '../../components/EmptyState';

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
  const activeCount = assignments.filter(a => a.status !== 'Resolved').length;
  const completedCount = assignments.filter(a => a.status === 'Resolved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          OFFICER OPERATIONS DASHBOARD
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Field Assignments & Priority Dispatches</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Active municipal dispatches requiring site inspection, repair work, or resolution evidence upload.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KpiCard
          value={assignments.length}
          label="Total Assigned Tasks"
          subtitle="Assigned to your field team"
          icon={Truck}
          accentColor="#3B82F6"
          loading={loading}
        />
        <KpiCard
          value={activeCount}
          label="Active In Progress"
          subtitle="Pending field completion"
          icon={Clock}
          accentColor="#F59E0B"
          loading={loading}
        />
        <KpiCard
          value={criticalTasks.length}
          label="Critical Dispatches"
          subtitle="Immediate priority hazard"
          icon={AlertTriangle}
          accentColor="#EF4444"
          loading={loading}
        />
        <KpiCard
          value={completedCount}
          label="Resolved Dispatches"
          subtitle="Verified complete today"
          icon={ShieldCheck}
          accentColor="#10B981"
          loading={loading}
        />
      </div>

      {/* Critical Immediate Dispatch Banner */}
      {criticalTasks.length > 0 && (
        <div className="alert-banner alert-banner-critical">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle className="alert-icon" size={22} color="#EF4444" />
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
            <span>Open Work Order</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Task Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Active Dispatch Queue
        </div>

        {loading ? (
          <EmptyState type="loading" title="Loading field assignments..." message="Retrieving officer dispatch list." />
        ) : assignments.length === 0 ? (
          <EmptyState type="empty" title="No active assignments" message="All field tickets assigned to you are currently clear." />
        ) : (
          assignments.map((item) => (
            <div key={item.complaintId || item._id} className="panel panel-interactive" style={{ padding: '1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-medium font-mono">#{item.complaintId}</span>
                  <StatusBadge type="priority" value={item.priority} />
                  <StatusBadge type="status" value={item.status} />
                  <PriorityScore complaint={item} size="sm" showBreakdown={false} />
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
                <span>Inspect & Work</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

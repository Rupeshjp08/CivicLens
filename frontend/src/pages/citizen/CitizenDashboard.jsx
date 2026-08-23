import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Search, 
  ArrowRight, 
  MapPin, 
  Calendar
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import KpiCard from '../../components/KpiCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityScore from '../../components/PriorityScore';
import EmptyState from '../../components/EmptyState';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintService.getComplaints().then(res => {
      setLoading(false);
      if (res.success && res.data) {
        setComplaints(res.data);
      }
    });
  }, []);

  const totalReports = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'In Review' || c.status === 'Pending').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Good day, {user?.name || 'Citizen'} 👋</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Your municipal activity and submitted complaint progression at a glance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/report" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Report an Issue</span>
          </Link>
          <Link to="/track" className="btn btn-secondary">
            <Search size={16} />
            <span>Track Reference</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <KpiCard
          value={totalReports}
          label="Total Reports Submitted"
          subtitle="Registered in municipal database"
          icon={FileText}
          accentColor="#3B82F6"
          loading={loading}
        />
        <KpiCard
          value={inProgressCount}
          label="Active In Work / Triage"
          subtitle="Under engineering review"
          icon={Clock}
          accentColor="#F59E0B"
          loading={loading}
        />
        <KpiCard
          value={resolvedCount}
          label="Verified Resolved"
          subtitle="Field work verified complete"
          icon={CheckCircle2}
          accentColor="#10B981"
          loading={loading}
        />
      </div>

      {/* Active Complaints Feed */}
      <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Your Active Complaints</h2>
          <Link to="/explore" style={{ fontSize: '0.85rem', color: 'var(--brand-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Explore Community Feed <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <EmptyState type="loading" title="Loading reports..." message="Fetching your submitted municipal tickets." />
        ) : complaints.length === 0 ? (
          <EmptyState 
            type="empty" 
            title="No complaints submitted yet" 
            message="Click 'Report an Issue' above to log your first concern with municipal operations." 
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map((item) => (
              <div 
                key={item.complaintId || item._id} 
                style={{ 
                  background: 'var(--bg-elevated)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-medium font-mono">#{item.complaintId}</span>
                    <StatusBadge type="status" value={item.status} />
                    <StatusBadge type="priority" value={item.priority} />
                    <PriorityScore complaint={item} size="sm" showBreakdown={false} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                    <span className="font-mono"><MapPin size={13} color="#3B82F6" style={{ display: 'inline', marginRight: '0.2rem' }} />{item.location}</span>
                    <span className="font-mono"><Calendar size={13} color="#3B82F6" style={{ display: 'inline', marginRight: '0.2rem' }} />{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/track?id=${item.complaintId}`)}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <span>Track Status</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

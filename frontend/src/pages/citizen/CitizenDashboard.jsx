import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Search, 
  Compass, 
  ArrowRight, 
  MapPin, 
  Calendar,
  AlertTriangle,
  User
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'badge-pending';
      case 'In Review': return 'badge-review';
      case 'In Progress': return 'badge-progress';
      case 'Resolved': return 'badge-resolved';
      case 'Rejected': return 'badge-rejected';
      default: return 'badge-pending';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Good afternoon, {user?.name || 'Citizen'} 👋</h1>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #38BDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total Reports Submitted</span>
            <FileText color="#38BDF8" size={20} />
          </div>
          <h2 className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem' }}>{loading ? '...' : totalReports}</h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registered in municipal database</span>
        </div>

        <div className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Active In Triage / Work</span>
            <Clock color="#F59E0B" size={20} />
          </div>
          <h2 className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem' }}>{loading ? '...' : inProgressCount}</h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Under engineering review</span>
        </div>

        <div className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Verified Resolved</span>
            <CheckCircle2 color="#10B981" size={20} />
          </div>
          <h2 className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem' }}>{loading ? '...' : resolvedCount}</h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Field work verified complete</span>
        </div>
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
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading reports...</div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No complaints submitted yet. Click "Report an Issue" to log your first concern.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map((item) => (
              <div 
                key={item.complaintId || item._id} 
                style={{ 
                  background: '#182030', 
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span className="badge badge-medium font-mono">#{item.complaintId}</span>
                    <span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                    <span className={`badge badge-${item.priority?.toLowerCase() || 'medium'}`}>{item.priority} Priority</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
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

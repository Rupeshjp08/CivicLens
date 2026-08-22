import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Sliders,
  BarChart3
} from 'lucide-react';
import { api } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComplaints().then(res => {
      setLoading(false);
      if (res.success && res.data) {
        const list = res.data;
        setStats({
          total: list.length,
          pending: list.filter(i => i.status === 'Pending' || i.status === 'In Review').length,
          inProgress: list.filter(i => i.status === 'In Progress').length,
          resolved: list.filter(i => i.status === 'Resolved').length,
          highPriority: list.filter(i => i.priority === 'High' || i.priority === 'Critical').length
        });
      }
    });
  }, []);

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert color="#818cf8" size={24} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Admin Dashboard</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Developer 3 Portal: Municipal Command & Operational Center
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/management" className="btn btn-secondary">
            <Sliders size={16} />
            <span>Manage Issues</span>
          </Link>
          <Link to="/admin/analytics" className="btn btn-primary">
            <BarChart3 size={16} />
            <span>View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>Total Issues</span>
            <FileText color="#38bdf8" size={20} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {loading ? '...' : stats.total}
          </h2>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #facc15' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>Pending Review</span>
            <Clock color="#facc15" size={20} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {loading ? '...' : stats.pending}
          </h2>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #60a5fa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>In Progress</span>
            <TrendingUp color="#60a5fa" size={20} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {loading ? '...' : stats.inProgress}
          </h2>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #4ade80' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>Resolved</span>
            <CheckCircle color="#4ade80" size={20} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {loading ? '...' : stats.resolved}
          </h2>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>Critical / High Priority</span>
            <AlertTriangle color="#ef4444" size={20} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {loading ? '...' : stats.highPriority}
          </h2>
        </div>
      </div>

      {/* Admin Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Complaint Management</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Review incoming citizen reports, update status (Pending ➔ In Progress ➔ Resolved), and adjust auto-calculated priority levels.
          </p>
          <Link to="/admin/management" className="btn btn-secondary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            Open Management Table <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Civic Analytics & Metrics</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Visualize department performance, response efficiency, category breakdowns, and municipal hot-spots.
          </p>
          <Link to="/admin/analytics" className="btn btn-secondary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            Open Analytics Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

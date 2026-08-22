import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Sliders,
  BarChart3,
  MapPin,
  Activity,
  Zap
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <ShieldAlert color="#3B82F6" size={24} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Admin Operations Center</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Central Municipal Command: Incident Triage, Field Dispatches & Analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/management" className="btn btn-secondary">
            <Sliders size={16} />
            <span>Triage Table</span>
          </Link>
          <Link to="/admin/hotspots" className="btn btn-secondary">
            <MapPin size={16} color="#3B82F6" />
            <span>Hotspot Map</span>
          </Link>
          <Link to="/admin/analytics" className="btn btn-primary">
            <BarChart3 size={16} />
            <span>Analytics Engine</span>
          </Link>
        </div>
      </div>

      {/* Operational Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.25rem'
      }}>
        <div className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #38BDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total Ingested Reports</span>
            <FileText color="#38BDF8" size={20} />
          </div>
          <h2 className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
            {loading ? '...' : stats.total}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registered in database</span>
        </div>

        <div className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Pending Review</span>
            <Clock color="#F59E0B" size={20} />
          </div>
          <h2 className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
            {loading ? '...' : stats.pending}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Awaiting field triage</span>
        </div>

        <div className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Field Work In Progress</span>
            <TrendingUp color="#3B82F6" size={20} />
          </div>
          <h2 className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
            {loading ? '...' : stats.inProgress}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Crews active on site</span>
        </div>

        <div className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Verified Resolved</span>
            <CheckCircle color="#10B981" size={20} />
          </div>
          <h2 className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-primary)' }}>
            {loading ? '...' : stats.resolved}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Closed ticket backlog</span>
        </div>

        <div className="panel" style={{ padding: '1.5rem', borderLeft: '4px solid #EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>High / Critical Alerts</span>
            <AlertTriangle color="#EF4444" size={20} />
          </div>
          <h2 className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: '#EF4444' }}>
            {loading ? '...' : stats.highPriority}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Immediate hazard priority</span>
        </div>
      </div>

      {/* Operational Module Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.35rem' }}>
        <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} color="#3B82F6" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Incident Triage Table</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Review incoming citizen reports, update status (Pending ➔ Field Work ➔ Resolved), adjust priority levels, and open the slide-over inspector drawer.
          </p>
          <Link to="/admin/management" className="btn btn-primary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            <span>Open Triage Table</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="#F59E0B" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Hotspot Density Map</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Monitor sector workload distribution, dominant incident categories, and trigger emergency field unit dispatches per city sector.
          </p>
          <Link to="/admin/hotspots" className="btn btn-secondary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            <span>Open Hotspot Analyzer</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} color="#10B981" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Analytics & SLA Metrics</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Track overall resolution velocity, category distributions, community upvote volumes, and SLA compliance targets.
          </p>
          <Link to="/admin/analytics" className="btn btn-secondary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            <span>Open Analytics Engine</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

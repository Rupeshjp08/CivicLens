import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Sliders,
  BarChart3,
  MapPin
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import KpiCard from '../../components/KpiCard';

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
    complaintService.getComplaints().then(res => {
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
            <Truck color="#10B981" size={24} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Officer Operations Command</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Central Municipal Operations: Incident Triage Queue, Field Dispatches & Analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/officer/queue" className="btn btn-secondary">
            <Sliders size={16} />
            <span>Priority Queue</span>
          </Link>
          <Link to="/officer/clusters" className="btn btn-secondary">
            <MapPin size={16} color="#3B82F6" />
            <span>Clusters Map</span>
          </Link>
          <Link to="/officer/analytics" className="btn btn-primary">
            <BarChart3 size={16} />
            <span>Analytics Engine</span>
          </Link>
        </div>
      </div>

      {/* Operational Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <KpiCard
          value={stats.total}
          label="Total Ingested Reports"
          subtitle="Registered in database"
          icon={FileText}
          accentColor="#38BDF8"
          loading={loading}
        />
        <KpiCard
          value={stats.pending}
          label="Pending Review"
          subtitle="Awaiting field triage"
          icon={Clock}
          accentColor="#F59E0B"
          loading={loading}
        />
        <KpiCard
          value={stats.inProgress}
          label="Field Work In Progress"
          subtitle="Crews active on site"
          icon={TrendingUp}
          accentColor="#3B82F6"
          loading={loading}
        />
        <KpiCard
          value={stats.resolved}
          label="Verified Resolved"
          subtitle="Closed ticket backlog"
          icon={CheckCircle}
          accentColor="#10B981"
          loading={loading}
        />
        <KpiCard
          value={stats.highPriority}
          label="High / Critical Alerts"
          subtitle="Immediate hazard priority"
          icon={AlertTriangle}
          accentColor="#EF4444"
          loading={loading}
        />
      </div>

      {/* Operational Module Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.35rem' }}>
        <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} color="#3B82F6" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Priority Triage Queue</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Review incoming citizen reports, update status (Pending ➔ Field Work ➔ Resolved), adjust priority levels, and open the slide-over inspector drawer.
          </p>
          <Link to="/officer/queue" className="btn btn-primary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            <span>Open Triage Queue</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="#F59E0B" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Hotspot & Cluster Map</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Monitor sector workload distribution, dominant incident categories, and trigger emergency field unit dispatches per city sector.
          </p>
          <Link to="/officer/clusters" className="btn btn-secondary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            <span>Open Cluster Map</span>
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
          <Link to="/officer/analytics" className="btn btn-secondary" style={{ marginTop: 'auto', width: 'fit-content' }}>
            <span>Open Analytics Engine</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

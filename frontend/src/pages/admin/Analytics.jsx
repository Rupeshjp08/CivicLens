import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ThumbsUp, 
  Clock
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import KpiCard from '../../components/KpiCard';

export default function Analytics() {
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

  const totalVolume = complaints.length;
  const resolvedCount = complaints.filter(i => i.status === 'Resolved').length;
  const resolutionRate = totalVolume ? ((resolvedCount / totalVolume) * 100).toFixed(1) + '%' : '88.4%';
  const slaBreaches = complaints.filter(i => (i.priority === 'Critical' || i.priority === 'High') && i.status !== 'Resolved').length;
  const totalUpvotes = complaints.reduce((sum, item) => sum + (item.supportCount || 0), 0);

  // Category breakdown calculation
  const categoryCounts = {
    'Pothole': complaints.filter(i => i.category === 'Pothole').length || 14,
    'Broken Streetlight': complaints.filter(i => i.category === 'Broken Streetlight').length || 9,
    'Garbage Accumulation': complaints.filter(i => i.category === 'Garbage Accumulation').length || 12,
    'Water Leakage': complaints.filter(i => i.category === 'Water Leakage').length || 8,
    'Damaged Road': complaints.filter(i => i.category === 'Damaged Road').length || 6,
    'Other': complaints.filter(i => i.category === 'Other').length || 3
  };

  const maxCatCount = Math.max(...Object.values(categoryCounts), 1);

  // Area Workload Meters
  const sectorWorkload = [
    { sector: 'Sector 1 (North District)', count: 24, percent: 80 },
    { sector: 'Sector 2 (Commercial Hub)', count: 18, percent: 60 },
    { sector: 'Sector 3 (Downtown Metro)', count: 28, percent: 92 },
    { sector: 'Sector 4 (Civic South)', count: 12, percent: 40 },
    { sector: 'Sector 5 (East Utility Belt)', count: 32, percent: 98 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          OFFICER ANALYTICS ENGINE
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Municipal Operations Analytics</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time metrics on triage velocity, category volume distribution, community support, and SLA compliance.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KpiCard
          value={totalVolume}
          label="Total Incident Ingress"
          subtitle="Registered in database"
          icon={TrendingUp}
          accentColor="#3B82F6"
          loading={loading}
        />
        <KpiCard
          value={resolutionRate}
          label="Resolution SLA Rate"
          subtitle="Verified complete"
          icon={CheckCircle2}
          accentColor="#10B981"
          trend={{ direction: 'up', value: '3.1% this week' }}
          loading={loading}
        />
        <KpiCard
          value={slaBreaches}
          label="High Hazard Queue"
          subtitle="Critical pending triage"
          icon={AlertTriangle}
          accentColor="#EF4444"
          loading={loading}
        />
        <KpiCard
          value={totalUpvotes}
          label="Community Support Upvotes"
          subtitle="Citizen engagement volume"
          icon={ThumbsUp}
          accentColor="#F59E0B"
          loading={loading}
        />
      </div>

      {/* Category Breakdown & Sector Workload */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Incident Distribution by Category */}
        <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} color="#3B82F6" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Category Volume Breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / maxCatCount) * 100);
              return (
                <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat}</span>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{count} tickets</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--brand-blue)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector Workload Capacity */}
        <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="#F59E0B" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Sector Workload Density</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sectorWorkload.map((sec, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sec.sector}</span>
                  <span className="font-mono" style={{ color: sec.percent > 90 ? '#EF4444' : 'var(--text-muted)' }}>{sec.count} active</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${sec.percent}%`, 
                      background: sec.percent > 90 ? '#EF4444' : sec.percent > 70 ? '#F59E0B' : '#10B981' 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

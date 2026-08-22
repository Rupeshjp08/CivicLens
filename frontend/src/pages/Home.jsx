import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Droplet, 
  Construction, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
  Activity,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import KpiCard from '../components/KpiCard';

export default function Home() {
  const [apiHealth, setApiHealth] = useState(null);

  useEffect(() => {
    api.checkHealth().then(data => setApiHealth(data));
  }, []);

  const categories = [
    { title: 'Potholes & Hazards', categoryVal: 'Pothole', icon: Construction, desc: 'Road damage, asphalt craters & structural hazards', color: '#F97316' },
    { title: 'Sanitation & Overflow', categoryVal: 'Garbage Accumulation', icon: Trash2, desc: 'Uncollected waste, garbage overflow & bio-hazards', color: '#38BDF8' },
    { title: 'Water Leakage & Mains', categoryVal: 'Water Leakage', icon: Droplet, desc: 'Pipe bursts, drainage blockages & clean water wastage', color: '#60A5FA' },
    { title: 'Power Grid & Lighting', categoryVal: 'Broken Streetlight', icon: Zap, desc: 'Broken streetlights, blackouts & electrical hazards', color: '#FACC15' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Mesh System Status Indicator */}
      <div className="panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={18} color="#3B82F6" />
          <span style={{ fontSize: '0.88rem' }}><strong style={{ color: 'var(--text-primary)' }}>Municipal Mesh Health:</strong> {apiHealth ? apiHealth.message : 'Verifying node response...'}</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
          <span>Real-time Citizen Triage Active</span>
        </div>
      </div>

      {/* Hero Operational Banner */}
      <div className="panel hero-mesh" style={{ padding: '3rem 2.25rem', background: '#0D131D', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(59, 130, 246, 0.12)', 
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '4px',
            padding: '0.25rem 0.75rem',
            fontSize: '0.8rem',
            color: '#60A5FA',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '1.25rem'
          }}>
            <Activity size={14} />
            <span>Civic Dispatch System</span>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Smart City Operations & Real-Time Incident Response
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.25rem', lineHeight: 1.6 }}>
            Empowering citizens to report critical municipal concerns—from structural road hazards to sanitation bursts—directly into local city engineering triage workflows.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/report" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
              <Send size={16} />
              <span>Submit Issue Report</span>
            </Link>
            <Link to="/explore" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem' }}>
              <span>Explore Public Feed</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time Civic Impact Counters using KpiCard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <KpiCard
          value="88.4%"
          label="SLA Resolution Rate"
          subtitle="On-time municipal resolution"
          icon={CheckCircle2}
          accentColor="#10B981"
          trend={{ direction: 'up', value: '4.2% vs last month' }}
        />
        <KpiCard
          value="< 48 Hrs"
          label="Avg Response Velocity"
          subtitle="Dispatch to field assignment"
          icon={Clock}
          accentColor="#F59E0B"
        />
        <KpiCard
          value="1,420+"
          label="Dispatches Resolved"
          subtitle="Verified community issues"
          icon={TrendingUp}
          accentColor="#3B82F6"
          trend={{ direction: 'up', value: '12% this week' }}
        />
      </div>

      {/* Quick-Launch Category Reporting Grid */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Quick-Launch Category Reporting
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="panel panel-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: `${cat.color}15`, 
                  border: `1px solid ${cat.color}35`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Icon size={22} color={cat.color} />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{cat.desc}</p>

                <Link 
                  to={`/report?category=${cat.categoryVal}`} 
                  style={{ 
                    color: 'var(--brand-blue)', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    marginTop: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  File Category Report <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

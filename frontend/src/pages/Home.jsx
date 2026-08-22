import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  Lightbulb, 
  Trash2, 
  Droplet, 
  Construction, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';

export default function Home() {
  const [apiHealth, setApiHealth] = useState(null);

  useEffect(() => {
    api.checkHealth().then(data => setApiHealth(data));
  }, []);

  const categories = [
    { title: 'Potholes', icon: Construction, desc: 'Road damage & hazards', color: '#f97316' },
    { title: 'Broken Streetlights', icon: Lightbulb, desc: 'Night illumination issues', color: '#facc15' },
    { title: 'Garbage Accumulation', icon: Trash2, desc: 'Sanitation & overflow', color: '#38bdf8' },
    { title: 'Water Leakage', icon: Droplet, desc: 'Pipe bursts & wastage', color: '#60a5fa' }
  ];

  return (
    <div className="home-page" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* API Connection Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        background: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.88rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="#38bdf8" />
          <span><strong>API Status:</strong> {apiHealth ? apiHealth.message : 'Checking connection...'}</span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Developer 1: Citizen Portal</span>
      </div>

      {/* Hero Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '2.75rem', 
            fontWeight: 800, 
            marginBottom: '1rem',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFill-color: 'transparent'
          }}>
            Smart Civic Issue Reporting & Real-Time Tracking
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '2rem' }}>
            Empowering citizens to report municipal concerns like potholes, broken streetlights, and sanitation issues directly to local authorities.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
              <span>Report an Issue</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem' }}>
              Explore Reported Issues
            </Link>
          </div>
        </div>
      </div>

      {/* Common Issue Categories */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Report Public Issues in Your Neighborhood
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.25rem' 
        }}>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: 'var(--radius-sm)', 
                  background: `${cat.color}15`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Icon size={24} color={cat.color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{cat.desc}</p>
                <Link to="/report" style={{ 
                  color: 'var(--brand-primary)', 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  marginTop: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  File Report <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Platform Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.25rem' 
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Clock size={28} color="#facc15" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>&lt; 48 Hours</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Average Response Time</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <CheckCircle2 size={28} color="#4ade80" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>88.4%</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Resolution Rate</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <TrendingUp size={28} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>1,420+</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Issues Resolved</p>
        </div>
      </div>
    </div>
  );
}

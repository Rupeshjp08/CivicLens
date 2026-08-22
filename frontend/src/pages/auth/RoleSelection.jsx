import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Truck, ArrowRight, ShieldCheck, Sliders } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleSelect = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2.5rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '9999px', padding: '0.35rem 1rem', fontSize: '0.82rem', color: '#60A5FA', fontWeight: 700, marginBottom: '1rem' }}>
          <ShieldCheck size={16} />
          <span>CIVICLENS MUNICIPAL GATEWAY</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome to CivicLens</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.35rem' }}>
          Select your portal to access tailored tools and municipal operations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* Citizen Portal */}
        <div className="panel" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={26} color="#3B82F6" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Citizen Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
              Report local municipal issues, upload photo evidence, track live status, upvote community concerns, and explore your city's public feed.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelect('CITIZEN', '/')}
            className="btn btn-primary"
            style={{ marginTop: 'auto', width: '100%', padding: '0.75rem 1.25rem' }}
          >
            <span>Enter Citizen Portal</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Officer Operations Portal */}
        <div className="panel" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '4px solid #10B981' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={26} color="#10B981" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Officer Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
              Operational command dashboard for staff and field officers: triage queue, cluster management, priority scoring, analytics, and dispatch resolution.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelect('OFFICER', '/officer/dashboard')}
            className="btn btn-secondary"
            style={{ marginTop: 'auto', width: '100%', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10B981', padding: '0.75rem 1.25rem' }}
          >
            <span>Enter Officer Operations</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

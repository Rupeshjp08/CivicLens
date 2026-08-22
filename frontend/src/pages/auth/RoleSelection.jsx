import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, ShieldAlert, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleSelect = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  return (
    <div style={{ maxWidth: '880px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '9999px', padding: '0.35rem 1rem', fontSize: '0.82rem', color: '#60A5FA', fontWeight: 700, marginBottom: '1rem' }}>
          <ShieldCheck size={16} />
          <span>CIVICLENS MUNICIPAL GATEWAY</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome to CivicLens</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.35rem' }}>
          Choose your operational portal to access tailored tools and features.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {/* Citizen Portal */}
        <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color="#3B82F6" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Citizen Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Report local municipal issues, upload photo evidence, track live progress, and explore community feeds.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelect('CITIZEN', '/')}
            className="btn btn-primary"
            style={{ marginTop: 'auto', width: '100%' }}
          >
            <span>Enter Citizen Portal</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Administrative Portal */}
        <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={24} color="#c084fc" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Admin Operations</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Central Municipal Command: Perform incident triage, monitor SLA compliance, inspect drawer logs, and assign crews.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelect('ADMIN', '/admin')}
            className="btn btn-secondary"
            style={{ marginTop: 'auto', width: '100%', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
          >
            <span>Enter Operations Center</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Field Officer Portal */}
        <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '4px solid #10B981' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={24} color="#10B981" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Field Officer Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Action-oriented mobile workflow for field engineers to inspect assignments, launch GPS navigation, and upload resolution proof.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelect('OFFICER', '/officer/dashboard')}
            className="btn btn-secondary"
            style={{ marginTop: 'auto', width: '100%', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10B981' }}
          >
            <span>Enter Field Work Portal</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

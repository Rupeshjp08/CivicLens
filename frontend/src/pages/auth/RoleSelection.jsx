import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleSelect = (role, path) => {
    if (switchRole) switchRole(role);
    navigate(path);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '1.5rem auto 3rem', padding: '0 1rem' }}>
      {/* Back to Public Home Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.84rem',
            fontWeight: 700,
            color: '#64748B',
            textDecoration: 'none',
            transition: 'color 150ms ease'
          }}
        >
          <ArrowLeft size={15} color="#16A34A" />
          <span>Back to CivicLens</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            borderRadius: '9999px',
            padding: '0.35rem 0.95rem',
            fontSize: '0.78rem',
            color: '#16A34A',
            fontWeight: 800,
            letterSpacing: '0.05em',
            marginBottom: '0.85rem'
          }}
        >
          <ShieldCheck size={15} />
          <span>SECURE CIVIC ACCESS</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', margin: 0 }}>
          Welcome to <span style={{ color: '#0F172A' }}>Civic</span><span style={{ color: '#16A34A' }}>Lens</span>
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.4rem', maxWidth: '540px', marginInLine: 'auto' }}>
          Choose the portal that matches your role to access tailored civic tools and municipal operations.
        </p>
      </div>

      {/* Portal Gateway Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* 1. Citizen Portal Card */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => handleSelect('CITIZEN', '/login')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('CITIZEN', '/login'); }}
          className="panel panel-interactive"
          style={{
            padding: '2.25rem',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB'
              }}
            >
              <User size={26} />
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#2563EB',
                background: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                letterSpacing: '0.05em'
              }}
            >
              FOR RESIDENTS
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Citizen Portal
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.45rem', lineHeight: 1.6, margin: 0 }}>
              Report civic issues, track complaints, and stay informed about local resolutions.
            </p>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button
              type="button"
              className="btn"
              style={{
                width: '100%',
                padding: '0.75rem 1.25rem',
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>Continue as Citizen</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 2. Municipal Officer Portal Card */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => handleSelect('OFFICER', '/officer/login')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('OFFICER', '/officer/login'); }}
          className="panel panel-interactive"
          style={{
            padding: '2.25rem',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(22, 163, 74, 0.08)',
                border: '1px solid rgba(22, 163, 74, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A'
              }}
            >
              <Building2 size={26} />
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#16A34A',
                background: 'rgba(22, 163, 74, 0.08)',
                border: '1px solid rgba(22, 163, 74, 0.2)',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                letterSpacing: '0.05em'
              }}
            >
              FOR MUNICIPAL STAFF
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Municipal Officer Portal
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.45rem', lineHeight: 1.6, margin: 0 }}>
              Manage assignments, inspect complaints, dispatch field teams, and resolve civic issues.
            </p>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button
              type="button"
              className="btn"
              style={{
                width: '100%',
                padding: '0.75rem 1.25rem',
                background: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 3px 10px rgba(22, 163, 74, 0.25)'
              }}
            >
              <span>Continue as Officer</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


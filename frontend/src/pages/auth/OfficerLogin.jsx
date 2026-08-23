import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Truck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Zap,
  Map,
  Camera,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Clock,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function OfficerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('marcus.vance@govtech.city');
  const [password, setPassword] = useState('officerKey123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await authService.login('OFFICER', { email, password });
    setLoading(false);
    if (res && res.success && res.user) {
      login(res.user.role, res.user);
      const targetRoute = (res.user.role === 'OFFICER' || res.user.role === 'ADMIN')
        ? '/officer/dashboard'
        : '/citizen/dashboard';
      navigate(targetRoute, { replace: true });
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Demo Mode: Password reset instructions sent to official officer mailbox.');
  };

  const handleAutoFillDemo = () => {
    setEmail('marcus.vance@govtech.city');
    setPassword('officerKey123');
  };

  const featureCards = [
    {
      icon: Zap,
      title: 'Real-time Dispatch',
      desc: 'Get instant updates on newly assigned complaints in your zone.'
    },
    {
      icon: Map,
      title: 'Smart Navigation',
      desc: 'Open routes in Google Maps and reach issues faster with GPS integration.'
    },
    {
      icon: Camera,
      title: 'Evidence Capture',
      desc: 'Upload before/after photos and document every field action.'
    },
    {
      icon: ShieldCheck,
      title: 'Status Updates',
      desc: 'Update resolutions, add notes and keep citizens informed.'
    }
  ];

  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Secure & Verified',
      sub: '256-bit encryption'
    },
    {
      icon: Clock,
      title: '24/7 Operations',
      sub: 'Always monitoring'
    },
    {
      icon: Zap,
      title: 'Smart Prioritization',
      sub: 'AI-powered scoring'
    },
    {
      icon: Users,
      title: 'Citizen Focused',
      sub: 'Transparent updates'
    }
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* 2-Column Desktop Grid */}
      <div className="officer-login-grid">
        {/* Left Hero Column */}
        <div className="officer-left-hero">
          {/* Subtle Background SVG Pattern */}
          <div className="officer-bg-map-pattern" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#CBD5E1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotGrid)" opacity="0.6" />
              {/* Subtle Map lines */}
              <path d="M -50 120 Q 200 80 450 220 T 900 180" fill="none" stroke="#E2E8F0" strokeWidth="2" />
              <path d="M -20 280 Q 300 240 550 380 T 1000 320" fill="none" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="6 6" />
              {/* City skyline vector outline near bottom */}
              <path d="M0 440 L20 440 L20 400 L40 400 L40 370 L70 370 L70 440 L90 440 L90 350 L130 350 L130 440 L160 440 L160 380 L190 380 L190 440 L240 440 L240 330 L280 330 L280 440 L330 440 L330 390 L370 390 L370 440 L420 440 L420 360 L460 360 L460 440 L500 440" fill="none" stroke="#CBD5E1" strokeWidth="1.5" opacity="0.35" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                background: 'rgba(22, 163, 74, 0.1)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
                color: '#16A34A',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              <Truck size={14} />
              CIVICLENS FIELD OPERATIONS
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 4vw, 3.4rem)',
                fontWeight: 850,
                color: '#0F172A',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                marginBottom: '1rem'
              }}
            >
              Officer <span style={{ color: '#16A34A' }}>Dispatch</span> Portal
            </h1>

            <p style={{ fontSize: '1.12rem', fontWeight: 700, color: '#172033', marginBottom: '0.4rem', lineHeight: 1.5 }}>
              Fast, mobile-first entry point for municipal engineers.
            </p>

            <p style={{ fontSize: '0.96rem', color: '#64748B', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '520px' }}>
              Access assigned tasks, update field status and resolve issues efficiently.
            </p>

            {/* 2x2 Feature Cards Grid */}
            <div className="officer-feature-grid">
              {featureCards.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="officer-feature-card">
                    <div className="officer-feature-icon-box">
                      <Icon size={20} />
                    </div>
                    <h3>{feat.title}</h3>
                    <p>{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Login Card Column */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="officer-login-card">
            {/* Header Icon & Title */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'rgba(22, 163, 74, 0.1)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem auto',
                  color: '#16A34A'
                }}
              >
                <Truck size={26} />
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Officer Dispatch Portal
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Sign in with your official credentials
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Badge / Officer Email */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="officer-email" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#172033', marginBottom: '0.35rem', display: 'block' }}>
                  Badge / Officer Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="officer-email"
                    type="email"
                    className="form-control font-mono"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.5rem', height: '46px', borderRadius: '8px', fontSize: '0.9rem' }}
                    required
                  />
                  <Mail
                    size={17}
                    color="#64748B"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>
              </div>

              {/* Passcode */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="officer-password" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#172033', marginBottom: '0.35rem', display: 'block' }}>
                  Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="officer-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control font-mono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '46px', borderRadius: '8px', fontSize: '0.9rem' }}
                    required
                  />
                  <Lock
                    size={17}
                    color="#64748B"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Secondary Controls (Remember me & Forgot passcode) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#16A34A', borderRadius: '4px' }}
                  />
                  Remember me
                </label>
                <a href="#forgot" onClick={handleForgotPassword} style={{ color: '#16A34A', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot passcode?
                </a>
              </div>

              {/* Primary Sign In Button */}
              <button type="submit" className="officer-btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Logging into Field Dispatch...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Field Portal</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Divider OR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* Secondary Action: Back to CivicLens */}
            <Link to="/" className="officer-btn-secondary">
              <ArrowLeft size={15} />
              <span>Back to CivicLens</span>
            </Link>

            {/* Demo Credentials Card */}
            <div className="officer-demo-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#15803D', fontSize: '0.8rem', fontWeight: 700 }}>
                  <ShieldCheck size={15} />
                  <span>Demo Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  style={{
                    background: 'rgba(22, 163, 74, 0.12)',
                    border: '1px solid rgba(22, 163, 74, 0.3)',
                    color: '#15803D',
                    borderRadius: '6px',
                    padding: '0.15rem 0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Auto-fill
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem', color: '#334155' }} className="font-mono">
                <div>
                  <span style={{ color: '#64748B' }}>Email: </span>
                  <strong>marcus.vance@govtech.city</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Passcode: </span>
                  <strong>officerKey123</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Bar */}
      <div className="officer-trust-bar">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="officer-trust-item">
              <div className="officer-trust-icon">
                <Icon size={20} />
              </div>
              <div>
                <div className="officer-trust-title">{item.title}</div>
                <div className="officer-trust-sub">{item.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


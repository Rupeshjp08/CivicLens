import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function OfficerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('marcus.vance@govtech.city');
  const [password, setPassword] = useState('officerKey123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await authService.login('OFFICER', { email, password });
    setLoading(false);
    if (res.success) {
      login('OFFICER', res.user);
      navigate('/officer/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
      <div className="panel" style={{ padding: '2.25rem', borderLeft: '4px solid #10B981' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
            <Truck size={24} color="#10B981" />
          </div>
          <div className="font-mono" style={{ fontSize: '0.75rem', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            CIVICLENS FIELD OPERATIONS
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.2rem' }}>Officer Dispatch Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Fast, mobile-optimized entry point for assigned municipal engineers.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="officer-email">Badge / Officer Email</label>
            <input
              id="officer-email"
              type="email"
              className="form-control font-mono"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="officer-password">Passcode</label>
            <input
              id="officer-password"
              type="password"
              className="form-control font-mono"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', background: '#10B981', borderColor: 'rgba(255,255,255,0.2)' }}>
            <span>{loading ? 'Logging into Field Dispatch...' : 'Sign In to Field Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

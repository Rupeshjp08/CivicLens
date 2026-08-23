import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ShieldCheck, Check, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Citizen',
    email: user?.email || 'john.citizen@example.com',
    phone: '+1 (555) 019-8234',
    address: 'Sector 4, Main District'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          ACCOUNT SETTINGS
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Citizen Profile</h1>
      </div>

      {saved && (
        <div className="panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', background: 'var(--status-emerald-bg)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Check size={18} />
          <span>Profile parameters updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="profile-name">Full name</label>
          <input
            id="profile-name"
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="profile-email">Email address</label>
          <input
            id="profile-email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="profile-phone">Phone number</label>
          <input
            id="profile-phone"
            type="text"
            className="form-control font-mono"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="profile-address">Neighborhood or sector</label>
          <input
            id="profile-address"
            type="text"
            className="form-control"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
          <span>Save Profile Preferences</span>
        </button>
      </form>

      {/* Session / Logout Section */}
      <div className="panel" style={{ padding: '1.5rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>Sign Out of Session</div>
          <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>End your current authenticated session and return to the home page.</div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="btn"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.82rem',
            background: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}


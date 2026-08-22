import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { api } from '../services/api';

export default function TrackComplaint() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async (idToSearch) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setComplaint(null);

    const res = await api.getComplaintById(idToSearch.trim());
    setLoading(false);

    if (res.success && res.data) {
      setComplaint(res.data);
    } else {
      setError(res.message || 'Complaint ID not found. Please verify the code.');
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchStatus(initialId);
    }
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStatus(searchId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'badge-pending';
      case 'In Review': return 'badge-review';
      case 'In Progress': return 'badge-progress';
      case 'Resolved': return 'badge-resolved';
      case 'Rejected': return 'badge-rejected';
      default: return 'badge-pending';
    }
  };

  const statusSteps = ['Pending', 'In Review', 'In Progress', 'Resolved'];

  const getStepState = (step, currentStatus) => {
    if (currentStatus === 'Rejected') return 'rejected';
    const currentIndex = statusSteps.indexOf(currentStatus);
    const stepIndex = statusSteps.indexOf(step);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Track Complaint Status</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Enter your unique Complaint Reference ID (e.g. CIV-1001) to check live status updates.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Complaint ID (e.g., CIV-1001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={18} />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="card" style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          borderColor: 'rgba(239, 68, 68, 0.3)',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          color: '#f87171'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Complaint Result Details */}
      {complaint && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-medium">{complaint.complaintId}</span>
                <span className={`badge ${getStatusBadge(complaint.status)}`}>{complaint.status}</span>
                <span className={`badge badge-${complaint.priority?.toLowerCase() || 'medium'}`}>{complaint.priority} Priority</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{complaint.title}</h2>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} />
              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Timeline Step Progress Bar */}
          {complaint.status !== 'Rejected' && (
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.6)', 
              padding: '1.5rem', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {statusSteps.map((step, idx) => {
                  const state = getStepState(step, complaint.status);
                  const isCompleted = state === 'completed';
                  const isCurrent = state === 'current';

                  return (
                    <div key={idx} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        margin: '0 auto 0.5rem auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        background: isCompleted || isCurrent ? 'var(--brand-primary)' : 'var(--bg-surface-hover)',
                        color: isCompleted || isCurrent ? '#0f172a' : 'var(--text-muted)',
                        boxShadow: isCurrent ? '0 0 12px rgba(56, 189, 248, 0.6)' : 'none'
                      }}>
                        {isCompleted ? <CheckCircle size={18} /> : idx + 1}
                      </div>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? 'var(--brand-primary)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
                      }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Category</strong>
              <span>{complaint.category}</span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Location</strong>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="#38bdf8" /> {complaint.location}
              </span>
            </div>
          </div>

          <div>
            <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Description</strong>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{complaint.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

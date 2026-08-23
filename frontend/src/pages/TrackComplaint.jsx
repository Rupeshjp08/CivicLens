import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Search, MapPin, Calendar, CheckCircle, User, FileText } from 'lucide-react';
import { complaintService } from '../services/complaintService';
import StatusBadge from '../components/StatusBadge';
import PriorityScore from '../components/PriorityScore';
import EmptyState from '../components/EmptyState';

export default function TrackComplaint({ lookupId = '' }) {
  const [searchParams] = useSearchParams();
  const { id: routeId } = useParams();
  const initialId = lookupId || searchParams.get('id') || routeId || '';

  const [searchId, setSearchId] = useState(initialId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async (idToSearch) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setComplaint(null);

    const res = await complaintService.getComplaintById(idToSearch.trim());
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

  const statusSteps = [
    { key: 'Pending', label: 'Reported' },
    { key: 'In Review', label: 'Triage & Assigned' },
    { key: 'In Progress', label: 'Field Work In Progress' },
    { key: 'Resolved', label: 'Verified Resolved' }
  ];

  const getStepState = (stepKey, currentStatus) => {
    if (currentStatus === 'Rejected') return 'rejected';
    const keys = statusSteps.map(s => s.key);
    const currentIndex = keys.indexOf(currentStatus);
    const stepIndex = keys.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const mockFieldNotes = (complaint?.fieldNotes && complaint.fieldNotes.length > 0)
    ? complaint.fieldNotes
    : [
        {
          timestamp: new Date(complaint?.createdAt || Date.now()).toLocaleDateString(),
          author: 'CivicLens intake',
          note: 'Complaint received and queued for municipal review.'
        }
      ];

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          LIVE TICKET MONITOR
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Track Complaint Status</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Enter your Reference ID (e.g. CIV-2026-00101 or CIV-1001) to view stage progression, smart priority score, and engineering field notes.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="panel" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div className="track-search-row">
          <label htmlFor="complaint-id-search" className="sr-only">Complaint ID</label>
          <input
            id="complaint-id-search"
            type="text"
            className="form-control font-mono"
            placeholder="Enter Complaint ID (e.g., CIV-3913)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={16} />
            <span>{loading ? 'Searching...' : 'Track Ticket'}</span>
          </button>
        </div>
      </form>

      {/* Loading / Error States */}
      {loading && <EmptyState type="loading" title="Searching database..." message="Retrieving complaint ticket details." />}
      {error && <EmptyState type="error" title="Ticket Not Found" message={error} />}

      {/* Complaint Detail Overview */}
      {complaint && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span className="badge badge-medium font-mono">#{complaint.complaintId}</span>
                  <StatusBadge type="status" value={complaint.status} />
                  <StatusBadge type="priority" value={complaint.priority} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{complaint.title}</h2>
              </div>

              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="font-mono">
                <Calendar size={14} color="#3B82F6" />
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Smart Priority Engine Display */}
            <div style={{ background: 'var(--bg-canvas)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                Smart Priority Engine Score
              </div>
              <PriorityScore complaint={complaint} size="md" showBreakdown={true} />
            </div>

            {/* 4-Stage Operational Stepper */}
            {complaint.status !== 'Rejected' && (
              <div style={{ background: 'var(--bg-canvas)', padding: '1.75rem 1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {statusSteps.map((step, idx) => {
                    const state = getStepState(step.key, complaint.status);
                    const isCompleted = state === 'completed';
                    const isCurrent = state === 'current';

                    return (
                      <div key={idx} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          margin: '0 auto 0.6rem auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          background: isCompleted || isCurrent ? 'var(--brand-blue)' : 'var(--bg-elevated)',
                          border: isCompleted || isCurrent ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-color)',
                          color: isCompleted || isCurrent ? '#ffffff' : 'var(--text-muted)'
                        }}>
                          {isCompleted ? <CheckCircle size={18} /> : idx + 1}
                        </div>
                        <span style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? '#60A5FA' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
                        }}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{complaint.category}</div>
              </div>
              <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location & Landmark</div>
                <div className="font-mono" style={{ fontWeight: 600, color: '#38BDF8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} color="#3B82F6" /> {complaint.location}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-canvas)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Detailed Report Description</div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{complaint.description}</p>
              {complaint.image && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Citizen Photo Evidence</div>
                  <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '240px', maxWidth: '400px' }}>
                    <img src={complaint.image} alt="Report Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
            </div>

            {complaint.resolutionImage && (
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <CheckCircle size={18} color="#10B981" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Field Resolution Evidence (After Repair)</span>
                </div>
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '240px', maxWidth: '400px', marginBottom: '0.5rem' }}>
                  <img src={complaint.resolutionImage} alt="Resolution Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Verified resolution proof uploaded by field officer upon completing work order.
                </div>
              </div>
            )}
          </div>

          {/* Official Field Notes Timeline */}
          <div className="panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <FileText size={18} color="#3B82F6" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Official Engineering Field Notes</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mockFieldNotes.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={13} color="#38BDF8" /> {item.author}
                    </span>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{item.timestamp}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

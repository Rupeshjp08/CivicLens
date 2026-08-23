import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  UploadCloud, 
  ArrowLeft, 
  FileText, 
  Loader2,
  User,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { officerService } from '../../services/officerService';
import { useAuth } from '../../context/AuthContext';
import { compressImage } from '../../utils/imageCompressor';
import StatusBadge from '../../components/StatusBadge';
import PriorityScore from '../../components/PriorityScore';
import EmptyState from '../../components/EmptyState';

export default function OfficerComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Field officer input state
  const [status, setStatus] = useState('In Progress');
  const [fieldNote, setFieldNote] = useState('');
  const [resolutionImage, setResolutionImage] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    complaintService.getComplaintById(id).then(res => {
      setLoading(false);
      if (res.success && res.data) {
        setComplaint(res.data);
        setStatus(res.data.status || 'In Progress');
        if (res.data.resolutionImage) setResolutionImage(res.data.resolutionImage);
      }
    });
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setResolutionImage(compressed);
      } catch (err) {
        console.error('Failed to compress image:', err);
      }
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await officerService.submitResolutionEvidence(id, {
      status,
      note: fieldNote,
      resolutionImage,
      officerName: user?.name || user?.username || 'Eng. Marcus Vance'
    });
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('Work order evidence submitted & ticket status updated successfully!');
      setTimeout(() => navigate('/officer/queue'), 1500);
    }
  };

  if (loading) {
    return <EmptyState type="loading" title="Loading work order details..." message="Querying officer dispatch system." />;
  }

  if (!complaint) {
    return <EmptyState type="error" title="Work Order Not Found" message="The requested dispatch ticket could not be found." onRetry={() => navigate('/officer/queue')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '980px', margin: '0 auto' }}>
      {/* 1. Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/officer/queue')}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderRadius: '9999px', background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A', fontWeight: 700 }}
        >
          <ArrowLeft size={15} color="#16A34A" />
          <span>Back to Priority Queue</span>
        </button>
      </div>

      {/* 2. Success Banner */}
      {successMsg && (
        <div className="panel" style={{ padding: '1rem 1.25rem', background: 'rgba(22, 163, 74, 0.08)', border: '1px solid rgba(22, 163, 74, 0.25)', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, borderRadius: '16px' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. Title Header Panel */}
      <div className="panel" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <span className="badge font-mono" style={{ background: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: '0.78rem' }}>
                #{complaint.complaintId}
              </span>
              <StatusBadge type="priority" value={complaint.priority} />
              <StatusBadge type="status" value={complaint.status} />
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                {complaint.category}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', margin: 0 }}>
              {complaint.title}
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
              <MapPin size={15} color="#2563EB" />
              <span>{complaint.location}</span>
            </div>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(complaint.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              padding: '0.55rem 1.1rem',
              fontSize: '0.82rem',
              background: '#16A34A',
              color: '#FFFFFF',
              borderRadius: '9999px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 3px 10px rgba(22, 163, 74, 0.25)'
            }}
          >
            <Navigation size={15} />
            <span>Launch GPS Route</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 4. Horizontal Status Stepper */}
      <div className="panel" style={{ padding: '1.35rem 1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
          WORK ORDER OPERATIONAL PROGRESSION
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['Pending', 'In Review', 'In Progress', 'Resolved'].map((stepKey, idx) => {
            const steps = ['Pending', 'In Review', 'In Progress', 'Resolved'];
            const currentIdx = steps.indexOf(complaint.status || 'Pending');
            const isCompleted = idx < currentIdx || complaint.status === 'Resolved';
            const isCurrent = complaint.status === stepKey;

            let stepBg = '#F8FAFC';
            let stepBorder = '#E2E8F0';
            let stepColor = '#64748B';

            if (isCurrent) {
              stepBg = 'rgba(37, 99, 235, 0.08)';
              stepBorder = 'rgba(37, 99, 235, 0.3)';
              stepColor = '#2563EB';
            } else if (isCompleted) {
              stepBg = 'rgba(22, 163, 74, 0.08)';
              stepBorder = 'rgba(22, 163, 74, 0.3)';
              stepColor = '#16A34A';
            }

            return (
              <div
                key={stepKey}
                style={{
                  flex: 1,
                  minWidth: '130px',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  background: stepBg,
                  border: `1px solid ${stepBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: isCurrent ? '#2563EB' : isCompleted ? '#16A34A' : '#E2E8F0',
                    color: isCurrent || isCompleted ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {isCompleted && !isCurrent ? '✓' : idx + 1}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: isCurrent ? 800 : 600, color: stepColor }}>
                  {stepKey}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Incident Report, Priority Score & Engineering Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Priority Engine Gauge */}
          <div className="panel" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Priority Score & Hazard Breakdown
            </div>
            <PriorityScore complaint={complaint} size="md" showBreakdown={true} />
          </div>

          {/* Description Card */}
          <div className="panel" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
              Citizen Incident Report
            </div>
            <p style={{ color: '#0F172A', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>{complaint.description}</p>

            {complaint.image && (
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Citizen Photo Evidence</div>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', maxHeight: '220px' }}>
                  <img src={complaint.image} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
          </div>

          {/* Timeline of Engineering Activity */}
          <div className="panel" style={{ padding: '1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={15} color="#16A34A" />
              <span>Engineering Activity Timeline</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(complaint.fieldNotes && complaint.fieldNotes.length > 0
                ? complaint.fieldNotes
                : [
                    {
                      timestamp: new Date(complaint.createdAt).toLocaleDateString(),
                      author: 'CivicLens System Intake',
                      note: 'Incident logged in municipal queue and assigned to engineering triage.'
                    }
                  ]
              ).map((fn, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    padding: '0.85rem',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px'
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#16A34A',
                      marginTop: '0.35rem',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>{fn.author}</span>
                      <span className="font-mono" style={{ color: '#94A3B8' }}>{fn.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>{fn.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Officer Resolution Form */}
        <div className="panel" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#16A34A" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Field Resolution & Evidence</h3>
          </div>

          <form onSubmit={handleResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>Update Ticket Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ borderRadius: '8px', border: '1px solid #E2E8F0', padding: '0.5rem' }}
              >
                <option value="In Progress">In Progress (Field Crews Active)</option>
                <option value="In Review">In Review (Quality Inspection)</option>
                <option value="Resolved">Resolved (Work Completed)</option>
                <option value="Rejected">Rejected (Invalid Report)</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>Field Engineering Inspection Notes</label>
              <textarea
                className="form-control"
                placeholder="Log site measurements, asphalt depth, replaced parts, or crew details..."
                value={fieldNote}
                onChange={(e) => setFieldNote(e.target.value)}
                style={{ minHeight: '110px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              />
            </div>

            {/* Resolution Proof Upload */}
            <div className="form-group">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>Field Resolution Photo Proof</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#F8FAFC',
                  transition: 'all 150ms ease'
                }}
              >
                {resolutionImage ? (
                  <div>
                    <img src={resolutionImage} alt="Resolution" style={{ maxHeight: '120px', borderRadius: '8px', marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>✓ Resolution evidence attached! Click to replace.</div>
                  </div>
                ) : (
                  <div>
                    <UploadCloud size={24} color="#16A34A" style={{ marginBottom: '0.35rem' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Upload After-Repair Proof</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Click to select compressed site photo</div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginTop: '0.5rem',
                background: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 700,
                boxShadow: '0 3px 10px rgba(22, 163, 74, 0.25)'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Submitting Evidence...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Submit Field Evidence & Update Status</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  UploadCloud, 
  ArrowLeft, 
  FileText, 
  Loader2
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
      officerName: user?.name || user?.username || 'Municipal Officer'
    });
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('Work order evidence submitted & ticket status updated successfully!');
      setTimeout(() => navigate('/officer/dashboard'), 1500);
    }
  };

  if (loading) {
    return <EmptyState type="loading" title="Loading work order details..." message="Querying officer dispatch system." />;
  }

  if (!complaint) {
    return <EmptyState type="error" title="Work Order Not Found" message="The requested dispatch ticket could not be found." onRetry={() => navigate('/officer/dashboard')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/officer/dashboard')}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Officer Dashboard</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="panel panel-glow-green" style={{ padding: '1rem', background: 'var(--status-emerald-bg)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700 }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Title Header Panel */}
      <div className="panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-medium font-mono">#{complaint.complaintId}</span>
              <StatusBadge type="priority" value={complaint.priority} />
              <StatusBadge type="status" value={complaint.status} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{complaint.title}</h1>
            <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
              <MapPin size={14} />
              <span>{complaint.location}</span>
            </div>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(complaint.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem' }}
          >
            <Navigation size={15} />
            <span>Launch GPS Route</span>
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Complaint Detail & Priority Engine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Priority Engine Gauge */}
          <div className="panel" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Priority Score & Hazard Breakdown
            </div>
            <PriorityScore complaint={complaint} size="md" showBreakdown={true} />
          </div>

          {/* Description Card */}
          <div className="panel" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
              Citizen Incident Report
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{complaint.description}</p>

            {complaint.image && (
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Citizen Photo Evidence</div>
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '220px' }}>
                  <img src={complaint.image} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Officer Resolution Form */}
        <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#10B981" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Field Resolution & Evidence</h3>
          </div>

          <form onSubmit={handleResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group">
              <label>Update Ticket Status</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="In Progress">In Progress (Field Crews Active)</option>
                <option value="In Review">In Review (Quality Inspection)</option>
                <option value="Resolved">Resolved (Work Completed)</option>
                <option value="Rejected">Rejected (Invalid Report)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Field Engineering Inspection Notes</label>
              <textarea
                className="form-control"
                placeholder="Log site measurements, asphalt depth, replaced parts, or crew details..."
                value={fieldNote}
                onChange={(e) => setFieldNote(e.target.value)}
                style={{ minHeight: '110px' }}
              />
            </div>

            {/* Resolution Proof Upload */}
            <div className="form-group">
              <label>Field Resolution Photo Proof</label>
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
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--bg-canvas)'
                }}
              >
                {resolutionImage ? (
                  <div>
                    <img src={resolutionImage} alt="Resolution" style={{ maxHeight: '120px', borderRadius: 'var(--radius-xs)', marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}>Photo attached! Click to replace.</div>
                  </div>
                ) : (
                  <div>
                    <UploadCloud size={24} color="#3B82F6" style={{ marginBottom: '0.35rem' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Upload After-Repair Proof</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Click to upload site photo</div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: '#10B981' }}
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

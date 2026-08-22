import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  UploadCloud, 
  Check, 
  ArrowLeft, 
  FileText, 
  ShieldAlert,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { officerService } from '../../services/officerService';
import { useAuth } from '../../context/AuthContext';

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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResolutionImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await officerService.submitResolutionEvidence(id, {
      resolutionImage,
      fieldNote: fieldNote || 'Field repair work verified complete. Site restored.',
      officerName: user?.name || 'Eng. Marcus Vance'
    });
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('Work order updated! Resolution evidence logged into municipal audit.');
      setComplaint(prev => ({ ...prev, status: 'Resolved', resolutionImage }));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading work order details...</div>;
  if (!complaint) return <div style={{ textAlign: 'center', padding: '4rem' }}>Work order #{id} not found.</div>;

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary" style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} />
        <span>Back to Assignments</span>
      </button>

      {/* Header Banner */}
      <div className="panel" style={{ padding: '1.75rem', borderLeft: '4px solid #10B981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-medium font-mono">#{complaint.complaintId}</span>
              <span className={`badge badge-${complaint.priority?.toLowerCase() || 'medium'}`}>{complaint.priority} Priority</span>
              <span className="badge badge-progress">{complaint.status}</span>
            </div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>{complaint.title}</h1>
            <div className="font-mono" style={{ color: '#38BDF8', fontSize: '0.85rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} color="#3B82F6" />
              <span>{complaint.location}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert(`Launching GPS navigation to: ${complaint.location}`)}
            className="btn btn-primary"
            style={{ background: '#3B82F6' }}
          >
            <Navigation size={16} />
            <span>Navigate GPS</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="panel" style={{ padding: '1rem', background: 'var(--status-emerald-bg)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* BEFORE VS AFTER RESOLUTION EVIDENCE COMPARISON VIEW */}
      <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Evidence Comparison (Before vs. After Repair)</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Before Photo */}
          <div style={{ background: '#0d121c', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              BEFORE (Citizen Submitted Photo)
            </div>
            <div style={{ height: '200px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#182030', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {complaint.image ? (
                <img src={complaint.image} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No photo attached by citizen</span>
              )}
            </div>
          </div>

          {/* After Photo (Resolution Evidence) */}
          <div style={{ background: '#0d121c', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              AFTER (Field Resolution Proof)
            </div>
            <div style={{ height: '200px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#182030', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {resolutionImage ? (
                <img src={resolutionImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Upload resolution photo below</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Field Work Submission Form */}
      <form onSubmit={handleResolveSubmit} className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Submit Field Resolution</h3>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Update Status Workflow</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="In Progress">Field Work In Progress</option>
            <option value="Resolved">Mark Verified Resolved</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Upload Resolution Evidence Photo</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}
          >
            <UploadCloud size={18} color="#10B981" />
            <span>{resolutionImage ? 'Change Resolution Photo' : 'Capture / Select Resolution Evidence Photo'}</span>
          </button>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Field Notes / Engineering Details</label>
          <textarea
            rows={3}
            className="form-control"
            placeholder="Document materials used, equipment deployed, or site restoration notes..."
            value={fieldNote}
            onChange={(e) => setFieldNote(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem', background: '#10B981', borderColor: 'rgba(255,255,255,0.2)' }}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Logging Work Order...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>Complete & Mark Resolved</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

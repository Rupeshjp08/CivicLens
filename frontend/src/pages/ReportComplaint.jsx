import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Send,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Construction,
  Lightbulb,
  Trash2,
  Droplet,
  Zap,
  HelpCircle,
  X,
  LocateFixed,
  Loader2,
  Copy,
  Check,
  UploadCloud,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { calculatePriorityScore } from '../utils/priority';
import { compressImage } from '../utils/imageCompressor';

const CATEGORIES = [
  { title: 'Pothole', label: 'Potholes & Hazards', icon: Construction, desc: 'Road damage, craters and vehicle hazards' },
  { title: 'Garbage Accumulation', label: 'Sanitation Overflow', icon: Trash2, desc: 'Uncollected waste and overflow' },
  { title: 'Water Leakage', label: 'Water Main Burst', icon: Droplet, desc: 'Leaks, bursts and water wastage' },
  { title: 'Broken Streetlight', label: 'Lighting & Safety', icon: Lightbulb, desc: 'Dark streets and failed lighting' },
  { title: 'Damaged Road', label: 'Power Grid Failure', icon: Zap, desc: 'Electrical or road-structure hazards (mapped to Damaged Road)' },
  { title: 'Other', label: 'Other Utility Concern', icon: HelpCircle, desc: 'Other municipal infrastructure issues' }
];

const PRESET_LOCATIONS = [
  'Oak Avenue & 5th Street intersection, Sector 4',
  'Central Library Road, Block B',
  'City Metro Station Gate 2',
  'Green Park Housing Complex Gate 1',
  'Commercial Hub Walkway, Sector 2'
];

const STEPS = [
  { n: 1, label: 'Issue' },
  { n: 2, label: 'Location' },
  { n: 3, label: 'Evidence' },
  { n: 4, label: 'Review' },
  { n: 5, label: 'Submitted' }
];

export default function ReportComplaint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category') || 'Pothole';
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES.some((c) => c.title === preselectedCategory) ? preselectedCategory : 'Pothole',
    location: '',
    description: '',
    image: '',
    locationSource: ''
  });
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsNote, setGpsNote] = useState('');
  const [fileDetails, setFileDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (CATEGORIES.some((c) => c.title === preselectedCategory)) {
      setFormData((prev) => ({ ...prev, category: preselectedCategory }));
    }
  }, [preselectedCategory]);

  const preview = calculatePriorityScore({
    ...formData,
    supportCount: 1,
    createdAt: new Date().toISOString()
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePrecisionGps = () => {
    setDetectingGps(true);
    setErrorMessage(null);
    setGpsNote('');

    if (!('geolocation' in navigator)) {
      setDetectingGps(false);
      setGpsNote('This browser does not provide location. Choose a municipal area below or type an address.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          locationSource: 'browser'
        }));
        setGpsNote('Approximate coordinates from your browser. You can edit this to add a landmark.');
        setDetectingGps(false);
      },
      () => {
        setGpsNote('Location permission was not granted. Enter an address or pick a known municipal area.');
        setDetectingGps(false);
      },
      { timeout: 8000, maximumAge: 0 }
    );
  };

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please choose a JPG, PNG or WebP image.');
      return;
    }
    setErrorMessage(null);
    try {
      const compressed = await compressImage(file);
      setFormData((prev) => ({ ...prev, image: compressed }));
      setFileDetails({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(2)} MB` });
    } catch (err) {
      setErrorMessage('Failed to process photo.');
    }
  };

  const handleNextStep = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!formData.category || !formData.title.trim() || !formData.description.trim()) {
        setErrorMessage('Choose a category and enter a title and description.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.location.trim()) {
        setErrorMessage('Enter a location or choose a municipal area.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setErrorMessage('Please complete the required fields.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    const res = await complaintService.createComplaint(formData);
    setLoading(false);
    if (res.success && res.data?.complaintId) {
      setSubmitted(res.data);
      setCurrentStep(5);
    } else {
      setErrorMessage(res.message || 'Unable to submit this complaint.');
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="page-kicker">Report an issue</p>
        <h1>Tell the city what needs attention</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Five steps: issue, location, evidence, review, then your complaint ID.
        </p>
      </div>

      <div className="panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <ol className="report-stepper" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {STEPS.map((step, idx) => (
            <li key={step.n} className="report-stepper-item">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: currentStep >= step.n ? 'var(--primary)' : 'var(--bg-hover)',
                  color: currentStep >= step.n ? '#fff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                {currentStep > step.n ? <Check size={14} /> : step.n}
              </div>
              <span style={{ fontSize: 13, fontWeight: currentStep === step.n ? 700 : 500 }}>{step.label}</span>
              {idx < STEPS.length - 1 && <div className="report-stepper-line" />}
            </li>
          ))}
        </ol>
      </div>

      {errorMessage && (
        <div className="panel" role="alert" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: 8, color: 'var(--danger)' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {currentStep < 5 && (
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2>01 Issue</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const selected = formData.category === cat.title;
                  return (
                    <button
                      type="button"
                      key={cat.title}
                      onClick={() => setFormData((p) => ({ ...p, category: cat.title }))}
                      className="panel"
                      style={{
                        textAlign: 'left',
                        padding: '1rem',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={18} color="var(--primary)" />
                      <div style={{ fontWeight: 700, marginTop: 8 }}>{cat.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cat.desc}</div>
                    </button>
                  );
                })}
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} placeholder="Short summary of the issue" />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" className="form-control" rows={4} value={formData.description} onChange={handleChange} placeholder="What is wrong, who is affected, and how long it has been happening." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Continue to location <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2>02 Location</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Type a landmark or address. You may also request coordinates from your browser if you allow it.
              </p>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <label htmlFor="location">Location</label>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handlePrecisionGps} disabled={detectingGps}>
                    {detectingGps ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
                    Use browser location
                  </button>
                </div>
                <input id="location" name="location" className="form-control" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value, locationSource: 'manual' }))} placeholder="Street, landmark, or sector" />
                {gpsNote && <p className="form-helper">{gpsNote}</p>}
              </div>
              <div>
                <p className="text-caption" style={{ marginBottom: 8 }}>Municipal areas (demo-safe presets)</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {PRESET_LOCATIONS.map((loc) => (
                    <button
                      type="button"
                      key={loc}
                      className="btn btn-secondary btn-sm"
                      onClick={() => setFormData((p) => ({ ...p, location: loc, locationSource: 'preset' }))}
                    >
                      <MapPin size={12} /> {loc.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Continue to evidence <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2>03 Evidence</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Photos are optional. The API stores an image URL when provided. Large camera files stay on this device and are not uploaded as a binary file.
              </p>
              <input type="file" ref={fileInputRef} accept="image/*" hidden onChange={(e) => e.target.files && processFile(e.target.files[0])} />
              {!formData.image ? (
                <button type="button" className="panel" style={{ padding: '2rem', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={28} color="var(--primary)" />
                  <div style={{ fontWeight: 600, marginTop: 8 }}>Add a photo</div>
                  <div className="text-caption">JPG or PNG, up to 5MB</div>
                </button>
              ) : (
                <div className="panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <img src={formData.image} alt="Selected evidence" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div>{fileDetails?.name}</div>
                    <div className="text-caption">{fileDetails?.size}</div>
                  </div>
                  <button type="button" className="btn btn-ghost btn-icon" aria-label="Remove photo" onClick={() => setFormData((p) => ({ ...p, image: '' }))}>
                    <X size={16} />
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                  Review <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2>04 Review</h2>
              <dl className="review-grid">
                <dt>Issue</dt>
                <dd>{formData.title}</dd>
                <dt>Category</dt>
                <dd>{CATEGORIES.find((c) => c.title === formData.category)?.label} ({formData.category})</dd>
                <dt>Description</dt>
                <dd>{formData.description}</dd>
                <dt>Location</dt>
                <dd>{formData.location}</dd>
                <dt>Evidence</dt>
                <dd>{formData.image ? 'Photo attached on this device' : 'No photo attached'}</dd>
              </dl>
              <div className="panel" style={{ padding: '1rem', background: 'var(--bg-panel-subtle)' }}>
                <p className="text-caption" style={{ fontWeight: 700, marginBottom: 6 }}>Priority preview</p>
                <p>
                  Estimated score {preview.total} / 100 ({preview.level}). The official score is calculated when the complaint is saved.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? 'Submitting…' : 'Submit complaint'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {currentStep === 5 && submitted && (
        <div className="panel success-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <CheckCircle2 size={40} color="var(--success)" />
          <h2 style={{ marginTop: 12 }}>Complaint submitted successfully</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Keep this reference. You can track status at any time.</p>
          <div className="panel" style={{ margin: '1.25rem auto', maxWidth: 360, padding: '1rem' }}>
            <div className="text-caption">Complaint reference</div>
            <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
              {submitted.complaintId}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(submitted.complaintId);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy ID'}
            </button>
            <Link to={`/citizen/track?id=${submitted.complaintId}`} className="btn btn-primary">
              Track Complaint
            </Link>
            <Link to={`/citizen/complaints/${submitted.complaintId}`} className="btn btn-secondary">
              View Complaint
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSubmitted(null);
                setCurrentStep(1);
                setFormData({ title: '', category: 'Pothole', location: '', description: '', image: '', locationSource: '' });
              }}
            >
              Report Another Issue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

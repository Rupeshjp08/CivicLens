import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Sparkles, 
  Copy, 
  Check, 
  UploadCloud,
  Flame,
  ArrowRight,
  ArrowLeft,
  QrCode,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { complaintService } from '../services/complaintService';

export default function ReportComplaint() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category') || 'Pothole';

  const fileInputRef = useRef(null);

  const categories = [
    { title: 'Pothole', label: 'Potholes & Hazards', icon: Construction, color: '#F97316', priority: 'High', emergencyTrigger: false, desc: 'Road craters, pavement damage & vehicle risks' },
    { title: 'Garbage Accumulation', label: 'Sanitation Overflow', icon: Trash2, color: '#38BDF8', priority: 'Medium', emergencyTrigger: false, desc: 'Public waste accumulation & bio-hazard concerns' },
    { title: 'Water Leakage', label: 'Water Mains Burst', icon: Droplet, color: '#60A5FA', priority: 'High', emergencyTrigger: true, desc: 'High-pressure main pipe leaks & clean water loss' },
    { title: 'Broken Streetlight', label: 'Lighting & Safety', icon: Lightbulb, color: '#FACC15', priority: 'Medium', emergencyTrigger: false, desc: 'Unlit pedestrian paths & dark intersection hazards' },
    { title: 'Damaged Road', label: 'Power Grid Failure', icon: Zap, color: '#EF4444', priority: 'Critical', emergencyTrigger: true, desc: 'Live wire hazards, transformer failure & power outage' },
    { title: 'Other', label: 'Other Utility Concern', icon: HelpCircle, color: '#A855F7', priority: 'Low', emergencyTrigger: false, desc: 'General municipal infrastructure feedback' }
  ];

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    category: preselectedCategory,
    location: '',
    description: '',
    image: ''
  });

  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [copied, setCopied] = useState(false);

  const activeCategoryObj = categories.find(c => c.title === formData.category) || categories[0];
  const aiTriage = complaintService.calculateAITriage(formData.category, formData.description);

  const handleCategorySelect = (catTitle) => {
    setFormData(prev => ({ ...prev, category: catTitle }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Step 2: Geo-Tagging Precision GPS
  const handlePrecisionGps = () => {
    setDetectingGps(true);
    setErrorMessage(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° W (Sector 4 - Live GPS)`
          }));
          setDetectingGps(false);
        },
        () => {
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              location: '37.7749° N, 122.4194° W (Sector 4 - Central Hub)'
            }));
            setDetectingGps(false);
          }, 700);
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          location: '37.7749° N, 122.4194° W (Sector 4 - Central Hub)'
        }));
        setDetectingGps(false);
      }, 700);
    }
  };

  // Step 3: Photo Upload
  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit.');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      setFileDetails({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleNextStep = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!formData.category) {
        setErrorMessage('Please select an issue category.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.location.trim() || !formData.title.trim()) {
        setErrorMessage('Please provide an issue title and location.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await complaintService.createComplaint(formData);
    setLoading(false);

    if (res.success) {
      const generatedId = res.data?.complaintId || `CL-2026-00${Math.floor(100 + Math.random() * 900)}`;
      setSubmittedId(generatedId);
      setShowSuccessModal(true);
    } else {
      setErrorMessage(res.message || 'Failed to register report. Please retry.');
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submittedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          CITIZEN TRIAGE WIZARD
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Smart Issue Reporting</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Guided 3-step reporting workflow with real-time AI triage simulation and GPS geo-tagging.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: currentStep >= 1 ? 'var(--brand-blue)' : 'var(--bg-panel-subtle)', 
              color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' 
            }}>
              1
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentStep === 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>Step 1</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category & AI Triage</div>
            </div>
          </div>

          <div style={{ flex: 1, height: '2px', background: 'var(--border-color)', margin: '0 1rem' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: currentStep >= 2 ? 'var(--brand-blue)' : 'var(--bg-panel-subtle)', 
              color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' 
            }}>
              2
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentStep === 2 ? 'var(--text-primary)' : 'var(--text-muted)' }}>Step 2</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Location & Geo-Tag</div>
            </div>
          </div>

          <div style={{ flex: 1, height: '2px', background: 'var(--border-color)', margin: '0 1rem' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: currentStep >= 3 ? 'var(--brand-blue)' : 'var(--bg-panel-subtle)', 
              color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' 
            }}>
              3
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentStep === 3 ? 'var(--text-primary)' : 'var(--text-muted)' }}>Step 3</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Evidence & Submit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="panel" style={{ padding: '1rem', marginBottom: '1.5rem', background: 'var(--status-critical-bg)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Wizard Container */}
      <form onSubmit={handleSubmit}>
        
        {/* STEP 1: CATEGORY SELECTION */}
        {currentStep === 1 && (
          <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>Step 1: Select Issue Category</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Select the option that best describes the municipal fault. System AI will automatically evaluate triage urgency.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.title;

                return (
                  <div
                    key={cat.title}
                    onClick={() => handleCategorySelect(cat.title)}
                    style={{
                      background: isSelected ? '#182030' : '#0d121c',
                      border: isSelected ? '2px solid var(--brand-blue)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ 
                        width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', 
                        background: `${cat.color}15`, border: `1px solid ${cat.color}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Icon size={20} color={cat.color} />
                      </div>

                      <span className={`badge badge-${cat.priority.toLowerCase()}`}>
                        {cat.priority}
                      </span>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.label}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI TRIAGE PANEL (SIGNATURE FEATURE) */}
            <div style={{ background: '#182030', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Bot size={20} color="#3B82F6" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI TRIAGE ANALYSIS
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Classified Fault</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{aiTriage.category}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Assessed Severity</div>
                  <span className={`badge badge-${aiTriage.severity.toLowerCase()}`}>{aiTriage.severity}</span>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Confidence Score</div>
                  <div className="font-mono" style={{ fontWeight: 700, color: '#10B981' }}>{aiTriage.confidence}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Recommended Dept</div>
                  <div style={{ fontWeight: 700, color: '#38BDF8', fontSize: '0.9rem' }}>{aiTriage.recommendedDepartment}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Estimated SLA Window</div>
                  <div className="font-mono" style={{ fontWeight: 700, color: '#F59E0B' }}>{aiTriage.estimatedSLA}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={handleNextStep} className="btn btn-primary">
                <span>Continue to Location</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & GEO-TAGGING */}
        {currentStep === 2 && (
          <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>Step 2: Title & Location Geo-Tagging</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Provide a short title and precise landmark or use GPS geo-location for automatic positioning.
              </p>
            </div>

            {/* Issue Title Input */}
            <div className="form-group">
              <label htmlFor="title">Issue Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                placeholder="e.g., Hazardous Pothole at Main Street & Sector 4 Intersection"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location & GPS Simulator */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor="location" style={{ marginBottom: 0 }}>Landmark / GPS Address *</label>
                <button
                  type="button"
                  onClick={handlePrecisionGps}
                  disabled={detectingGps}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                >
                  {detectingGps ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Locking GPS Satellites...</span>
                    </>
                  ) : (
                    <>
                      <LocateFixed size={14} color="#3B82F6" />
                      <span>Use Precision GPS</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-control font-mono"
                  placeholder="e.g., 37.7749° N, 122.4194° W (Sector 4)"
                  value={formData.location}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <MapPin size={18} color="#3B82F6" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="button" onClick={handleNextStep} className="btn btn-primary">
                <span>Continue to Evidence</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EVIDENCE & REVIEW */}
        {currentStep === 3 && (
          <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>Step 3: Description & Evidence Review</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Add detailed observations, drop optional photo evidence, and complete submission.
              </p>
            </div>

            {/* Description Textarea */}
            <div className="form-group">
              <label htmlFor="description">Detailed Observations *</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="form-control"
                placeholder="Provide details on hazard dimensions, duration, or immediate public risk..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Photo Uploader */}
            <div className="form-group">
              <label>Photo Evidence (Optional Drag & Drop)</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && processFile(e.target.files[0])}
                accept="image/*"
                style={{ display: 'none' }}
              />

              {!formData.image ? (
                <div
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.75rem',
                    textAlign: 'center',
                    background: '#0d121c',
                    cursor: 'pointer'
                  }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud size={32} color="#3B82F6" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Drop photo here, or <span style={{ color: 'var(--brand-blue)' }}>browse files</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Supports PNG, JPG up to 5MB
                  </div>
                </div>
              ) : (
                <div style={{ background: '#0d121c', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{fileDetails?.name || 'Photo Evidence'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fileDetails?.size || 'Attached'}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="btn btn-danger" style={{ padding: '0.35rem 0.65rem' }}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Submission Summary Box */}
            <div style={{ background: '#182030', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Category:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formData.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Location:</span>
                <span className="font-mono" style={{ color: '#38BDF8' }}>{formData.location || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Assessed Department:</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>{aiTriage.recommendedDepartment}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.85rem 1.75rem' }}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Dispatching Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Complaint Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* TICKET GENERATED MODAL */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--status-emerald-bg)', border: '2px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
              <CheckCircle2 size={34} color="#10B981" />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Complaint Ticket Generated
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your ticket has been logged in municipal dispatch. Real-time engineering triage has been alerted.
            </p>

            {/* Monospace Reference ID & QR Code */}
            <div style={{ background: '#0d121c', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Official Reference Code</div>
                <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-blue)', marginTop: '0.15rem' }}>
                  #{submittedId}
                </div>
              </div>

              {/* QR Code Placeholder SVG */}
              <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={40} color="#090C10" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              <button
                type="button"
                onClick={handleCopyId}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                <span>{copied ? 'Reference Code Copied' : 'Copy Reference Code'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/track?id=${submittedId}`)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <span>Track Progress Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

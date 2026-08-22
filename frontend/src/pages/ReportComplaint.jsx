import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ReportComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Pothole',
    location: '',
    description: '',
    image: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      setResult({ success: false, message: 'Please complete all required fields.' });
      return;
    }

    setLoading(true);
    setResult(null);

    const res = await api.createComplaint(formData);
    setLoading(false);

    if (res.success) {
      setResult({ 
        success: true, 
        message: `Complaint submitted successfully! Your tracking ID is: ${res.data.complaintId}`,
        complaintId: res.data.complaintId
      });
      // Reset form
      setFormData({ title: '', category: 'Pothole', location: '', description: '', image: '' });
    } else {
      setResult({ success: false, message: res.message || 'Failed to submit complaint.' });
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Report a Civic Issue</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Help us maintain your city. Provide details about the issue so municipal crews can respond.
        </p>
      </div>

      {result && (
        <div className="card" style={{
          marginBottom: '1.5rem',
          background: result.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderColor: result.success ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {result.success ? <CheckCircle2 color="#4ade80" size={24} /> : <AlertCircle color="#f87171" size={24} />}
          <div>
            <div style={{ fontWeight: 700, color: result.success ? '#4ade80' : '#f87171' }}>
              {result.success ? 'Report Submitted' : 'Error'}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{result.message}</div>
            {result.complaintId && (
              <button 
                onClick={() => navigate(`/track?id=${result.complaintId}`)} 
                className="btn btn-secondary" 
                style={{ marginTop: '0.75rem', padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
              >
                Track Status Now
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label htmlFor="title">Issue Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-control"
            placeholder="e.g. Deep Pothole near Main Street Intersection"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Pothole">Pothole</option>
              <option value="Broken Streetlight">Broken Streetlight</option>
              <option value="Garbage Accumulation">Garbage Accumulation</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Damaged Road">Damaged Road</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location / Landmark *</label>
            <input
              id="location"
              name="location"
              type="text"
              className="form-control"
              placeholder="e.g. Oak Ave, Sector 4, near Bank"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Description *</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="form-control"
            placeholder="Describe the issue size, severity, duration, or any safety concerns..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Photo URL (Optional Placeholder)</label>
          <input
            id="image"
            name="image"
            type="url"
            className="form-control"
            placeholder="https://example.com/photo.jpg"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
        >
          <Send size={18} />
          <span>{loading ? 'Submitting Report...' : 'Submit Complaint'}</span>
        </button>
      </form>
    </div>
  );
}

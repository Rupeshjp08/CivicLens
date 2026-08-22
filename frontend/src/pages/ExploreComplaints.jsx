import React, { useEffect, useState } from 'react';
import { ThumbsUp, MapPin, Filter, Search, Tag, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ExploreComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    const res = await api.getComplaints();
    setLoading(false);
    if (res.success && res.data) {
      setComplaints(res.data);
    }
  };

  const handleUpvote = async (id) => {
    const res = await api.upvoteComplaint(id);
    if (res.success && res.data) {
      setComplaints(prev =>
        prev.map(item =>
          item.complaintId === res.data.complaintId || item._id === res.data._id
            ? { ...item, supportCount: res.data.supportCount }
            : item
        )
      );
    }
  };

  const filteredComplaints = complaints.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Pothole', 'Broken Streetlight', 'Garbage Accumulation', 'Water Leakage', 'Damaged Road', 'Other'];

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

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Explore Public Issues</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse community-submitted civic issues. Upvote issues in your area to raise urgency!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, landmark, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaint List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading civic issues...
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={36} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
          <h3>No issues found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredComplaints.map((item) => (
            <div key={item.complaintId || item._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {item.image && (
                <div style={{ height: '160px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="badge badge-medium">{item.complaintId}</span>
                  <span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Tag size={14} color="#38bdf8" /> <span>{item.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} color="#38bdf8" /> <span>{item.location}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${item.priority?.toLowerCase() || 'medium'}`}>{item.priority} Priority</span>
                <button
                  onClick={() => handleUpvote(item.complaintId || item._id)}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                >
                  <ThumbsUp size={14} />
                  <span>Upvote ({item.supportCount || 0})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

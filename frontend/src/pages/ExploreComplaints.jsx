import React, { useEffect, useState } from 'react';
import { ThumbsUp, MapPin, Filter, Search, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ExploreComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Upvoted track
  const [upvotedItems, setUpvotedItems] = useState({});

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
    const isAlreadyUpvoted = upvotedItems[id];
    
    // Instant optimistic increment
    setComplaints(prev =>
      prev.map(item => {
        const match = item.complaintId === id || item._id === id;
        if (match) {
          const currentCount = item.supportCount || 0;
          return {
            ...item,
            supportCount: isAlreadyUpvoted ? currentCount - 1 : currentCount + 1
          };
        }
        return item;
      })
    );

    setUpvotedItems(prev => ({ ...prev, [id]: !isAlreadyUpvoted }));

    // Send API call in background
    api.upvoteComplaint(id);
  };

  const categories = ['All', 'Pothole', 'Broken Streetlight', 'Garbage Accumulation', 'Water Leakage', 'Damaged Road', 'Other'];
  const statuses = ['All', 'Pending', 'In Review', 'In Progress', 'Resolved'];
  const areas = ['All', 'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5'];

  const filteredComplaints = complaints.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesArea = selectedArea === 'All' || (item.location && item.location.toLowerCase().includes(selectedArea.toLowerCase()));
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesStat && matchesArea && matchesSearch;
  });

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          MUNICIPAL INCIDENT FEED
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Explore Public Issues & Community Support</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review community reported concerns. Upvote issues in your sector to raise triage dispatch priority.
        </p>
      </div>

      {/* Filter Bar & Chips Panel */}
      <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#3B82F6" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, landmark, or Complaint ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} color="var(--text-muted)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Category:</span>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Status:</span>
              <select
                className="form-control"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {statuses.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Area:</span>
              <select
                className="form-control"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          Fetching live incident feed...
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '4rem' }}>
          <AlertCircle size={42} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No issues found matching filters</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Adjust search query, area sector, or category dropdowns.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.35rem' }}>
          {filteredComplaints.map((item) => {
            const itemId = item.complaintId || item._id;
            const isUpvoted = upvotedItems[itemId];

            return (
              <div key={itemId} className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', padding: '1.5rem' }}>
                {item.image && (
                  <div style={{ height: '170px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-medium font-mono">#{item.complaintId}</span>
                    <span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Tag size={14} color="#38BDF8" /> <span>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="font-mono">
                    <MapPin size={14} color="#3B82F6" /> <span>{item.location}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge badge-${item.priority?.toLowerCase() || 'medium'}`}>{item.priority} Priority</span>
                  
                  <button
                    type="button"
                    onClick={() => handleUpvote(itemId)}
                    className={`btn ${isUpvoted ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <ThumbsUp size={14} />
                    <span>{isUpvoted ? 'Upvoted' : 'Upvote'} ({item.supportCount || 0})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

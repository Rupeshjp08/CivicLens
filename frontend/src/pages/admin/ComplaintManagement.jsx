import React, { useEffect, useState } from 'react';
import { 
  Sliders, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Eye, 
  X, 
  MapPin, 
  ThumbsUp, 
  Calendar, 
  Tag, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Slide-Over Inspector Drawer State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await api.getComplaints();
    setLoading(false);
    if (res.success && res.data) {
      setComplaints(res.data);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    const res = await api.updateComplaint(id, { status: newStatus });
    setUpdatingId(null);

    if (res.success && res.data) {
      setComplaints(prev =>
        prev.map(item =>
          (item.complaintId === id || item._id === id) ? { ...item, status: newStatus } : item
        )
      );

      if (selectedComplaint && (selectedComplaint.complaintId === id || selectedComplaint._id === id)) {
        setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
      }
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    setUpdatingId(id);
    const res = await api.updateComplaint(id, { priority: newPriority });
    setUpdatingId(null);

    if (res.success && res.data) {
      setComplaints(prev =>
        prev.map(item =>
          (item.complaintId === id || item._id === id) ? { ...item, priority: newPriority } : item
        )
      );

      if (selectedComplaint && (selectedComplaint.complaintId === id || selectedComplaint._id === id)) {
        setSelectedComplaint(prev => ({ ...prev, priority: newPriority }));
      }
    }
  };

  const categories = ['All', 'Pothole', 'Broken Streetlight', 'Garbage Accumulation', 'Water Leakage', 'Damaged Road', 'Other'];
  const statuses = ['All', 'Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];

  const filteredComplaints = complaints.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.complaintId || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
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

  // Mock SLA calculation helper
  const getSlaTimer = (item) => {
    if (item.status === 'Resolved') return { text: 'Closed', color: '#10B981' };
    if (item.priority === 'Critical' || item.priority === 'High') return { text: '< 12h Emergency', color: '#EF4444' };
    return { text: '< 36h On Track', color: '#F59E0B' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Sliders color="#3B82F6" size={24} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Incident Triage & Field Management</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            High-density operational management table. Click any row to open the slide-over inspector drawer.
          </p>
        </div>
      </div>

      {/* Filter Controls Panel */}
      <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#3B82F6" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, title, or landmark..."
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
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Priority:</span>
            <select
              className="form-control"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
              {priorities.map((p, i) => <option key={i} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* High Density Custom Data Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading municipal reports...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No complaint reports match your current filter parameters.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Category</th>
                <th>Issue Title & Landmark</th>
                <th>SLA Timer</th>
                <th>Priority Tag</th>
                <th>Status Control</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((item) => {
                const itemId = item.complaintId || item._id;
                const sla = getSlaTimer(item);
                const isUpdating = updatingId === itemId;

                return (
                  <tr key={itemId} onClick={() => setSelectedComplaint(item)}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>
                      #{item.complaintId}
                    </td>

                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.category}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                      <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} color="#3B82F6" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    <td>
                      <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: sla.color, background: `${sla.color}15`, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {sla.text}
                      </span>
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="form-control"
                        value={item.priority || 'Medium'}
                        onChange={(e) => handlePriorityChange(itemId, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="form-control"
                        value={item.status || 'Pending'}
                        onChange={(e) => handleStatusChange(itemId, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedComplaint(item)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* SLIDE-OVER INSPECTOR DRAWER */}
      {selectedComplaint && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedComplaint(null)} />
          
          <div className="drawer-panel">
            {/* Drawer Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700 }}>
                  #{selectedComplaint.complaintId} INSPECTION
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {selectedComplaint.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="btn btn-secondary"
                style={{ padding: '0.35rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Photo Evidence Preview */}
              {selectedComplaint.image && (
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Submitted Photo Evidence
                  </div>
                  <div style={{ height: '220px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={selectedComplaint.image} alt={selectedComplaint.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}

              {/* Status & Priority Control Section */}
              <div style={{ background: '#182030', padding: '1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    Status Workflow
                  </label>
                  <select
                    className="form-control"
                    value={selectedComplaint.status}
                    onChange={(e) => handleStatusChange(selectedComplaint.complaintId || selectedComplaint._id, e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    Triage Priority
                  </label>
                  <select
                    className="form-control"
                    value={selectedComplaint.priority || 'Medium'}
                    onChange={(e) => handlePriorityChange(selectedComplaint.complaintId || selectedComplaint._id, e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Metadata Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#0d121c', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Category</div>
                  <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{selectedComplaint.category}</div>
                </div>

                <div style={{ background: '#0d121c', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Community Upvotes</div>
                  <div className="font-mono" style={{ fontWeight: 700, color: '#38BDF8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ThumbsUp size={14} />
                    <span>{selectedComplaint.supportCount || 0} Citizens Supported</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#0d121c', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Location & Geo-Tag</div>
                <div className="font-mono" style={{ fontWeight: 600, color: '#38BDF8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="#3B82F6" />
                  <span>{selectedComplaint.location}</span>
                </div>
              </div>

              <div style={{ background: '#0d121c', padding: '1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Full Description</div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Timestamp Info */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="font-mono">
                <Calendar size={13} />
                <span>Ingested: {new Date(selectedComplaint.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

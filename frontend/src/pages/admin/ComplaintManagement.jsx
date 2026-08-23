import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sliders, 
  Search, 
  Filter, 
  Eye, 
  X, 
  MapPin, 
  ThumbsUp, 
  Calendar, 
  Tag, 
  Loader2,
  Send,
  User,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import StatusBadge from '../../components/StatusBadge';
import PriorityScore from '../../components/PriorityScore';
import EmptyState from '../../components/EmptyState';

export default function ComplaintManagement() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Slide-Over Inspector Drawer State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await complaintService.getComplaints();
    setLoading(false);
    if (res.success && res.data) {
      setComplaints(res.data);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    const res = await complaintService.updateComplaint(id, { status: newStatus });
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
    const res = await complaintService.updateComplaint(id, { priority: newPriority });
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

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedComplaint) return;
    const targetId = selectedComplaint.complaintId || selectedComplaint._id;

    const res = await complaintService.addNote(targetId, {
      author: 'Eng. Marcus Vance',
      note: newNote.trim()
    });

    if (res.success) {
      const updatedNotes = res.data?.fieldNotes || [
        ...(selectedComplaint.fieldNotes || []),
        { timestamp: new Date().toLocaleString(), author: 'Eng. Marcus Vance', note: newNote.trim() }
      ];
      setSelectedComplaint(prev => ({ ...prev, fieldNotes: updatedNotes }));
      setNewNote('');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
  };

  const categories = ['All', 'Pothole', 'Garbage Accumulation', 'Water Leakage', 'Broken Streetlight', 'Damaged Road', 'Other'];
  const statuses = ['All', 'Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  // Summary counts
  const criticalCount = complaints.filter(c => c.priority === 'Critical').length;
  const highCount = complaints.filter(c => c.priority === 'High').length;
  const mediumCount = complaints.filter(c => c.priority === 'Medium').length;
  const lowCount = complaints.filter(c => c.priority === 'Low').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const filteredComplaints = complaints.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesPri = selectedPriority === 'All' || item.priority === selectedPriority;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
                          (item.title || '').toLowerCase().includes(term) ||
                          (item.location || '').toLowerCase().includes(term) ||
                          (item.complaintId || '').toLowerCase().includes(term);
    return matchesCat && matchesStat && matchesPri && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
            Operations / <span style={{ color: '#16A34A' }}>Priority Queue</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', margin: 0 }}>
            Priority Queue & <span style={{ color: '#16A34A' }}>Dispatch Triage</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem', maxWidth: '720px' }}>
            Review and dispatch municipal complaints according to urgency, hazard severity, and operational priority.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="btn"
          style={{
            padding: '0.5rem 0.85rem',
            fontSize: '0.82rem',
            background: '#FFFFFF',
            border: '1px solid rgba(22, 163, 74, 0.3)',
            color: '#16A34A',
            borderRadius: '9999px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
          }}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* 2. Priority Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'CRITICAL', count: criticalCount, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)' },
          { label: 'HIGH', count: highCount, color: '#F97316', bg: 'rgba(249, 115, 22, 0.08)' },
          { label: 'MEDIUM', count: mediumCount, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
          { label: 'LOW', count: lowCount, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)' },
          { label: 'RESOLVED', count: resolvedCount, color: '#16A34A', bg: 'rgba(22, 163, 74, 0.08)' }
        ].map((s) => (
          <div
            key={s.label}
            className="panel"
            style={{
              padding: '1rem 1.15rem',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: s.color, letterSpacing: '0.05em' }}>
                {s.label}
              </div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginTop: '0.1rem' }}>
                {s.count < 10 ? `0${s.count}` : s.count}
              </div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: s.color
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }}></span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter Toolbar */}
      <div
        className="panel"
        style={{
          padding: '1.1rem 1.25rem',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: 12 }} />
            <input
              type="text"
              placeholder="Search by title, location, or Ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.85rem 0.5rem 2.3rem',
                fontSize: '0.82rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '9999px',
                color: '#0F172A',
                outline: 'none'
              }}
            />
          </div>

          {/* Filter Selects */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  background: selectedCategory !== 'All' ? 'rgba(22, 163, 74, 0.08)' : '#FFFFFF',
                  color: selectedCategory !== 'All' ? '#16A34A' : '#0F172A',
                  fontWeight: 600
                }}
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  background: selectedStatus !== 'All' ? 'rgba(22, 163, 74, 0.08)' : '#FFFFFF',
                  color: selectedStatus !== 'All' ? '#16A34A' : '#0F172A',
                  fontWeight: 600
                }}
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  background: selectedPriority !== 'All' ? 'rgba(22, 163, 74, 0.08)' : '#FFFFFF',
                  color: selectedPriority !== 'All' ? '#16A34A' : '#0F172A',
                  fontWeight: 600
                }}
              >
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All') && (
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-ghost"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', color: '#EF4444', fontWeight: 700 }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Priority Queue List */}
      {loading ? (
        <EmptyState type="loading" title="Loading priority queue..." message="Retrieving officer dispatch records from database." />
      ) : filteredComplaints.length === 0 ? (
        <div className="panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <ListFilter size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>No complaints found</h3>
          <p style={{ color: '#64748B', fontSize: '0.86rem', marginTop: '0.2rem' }}>
            No dispatch tickets match your active filter or search criteria.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn"
            style={{ marginTop: '1rem', padding: '0.45rem 1rem', fontSize: '0.8rem', background: '#16A34A', color: '#FFFFFF', borderRadius: '9999px', fontWeight: 700 }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredComplaints.map((item) => {
            const itemId = item.complaintId || item._id;
            const borderAccent = item.priority === 'Critical' ? '#EF4444' : item.priority === 'High' ? '#F97316' : item.priority === 'Medium' ? '#F59E0B' : item.status === 'Resolved' ? '#16A34A' : '#2563EB';

            return (
              <div
                key={itemId}
                className="panel panel-interactive"
                style={{
                  padding: '1.25rem 1.5rem',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderLeft: `4px solid ${borderAccent}`,
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem'
                }}
              >
                {/* Left Side: Ticket Metadata */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <StatusBadge type="priority" value={item.priority} size="sm" />
                    {item.priority === 'Critical' && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: '#EF4444',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444' }}></span>
                        Requires Immediate Attention
                      </span>
                    )}
                    <span className="badge font-mono" style={{ fontSize: '0.74rem', background: '#F1F5F9', color: '#475569', fontWeight: 800 }}>
                      #{item.complaintId}
                    </span>
                    <StatusBadge type="status" value={item.status} size="sm" />
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', marginLeft: 'auto' }}>
                      {item.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem' }}>
                    <MapPin size={13} color="#2563EB" />
                    <span>{item.location}</span>
                  </div>

                  {/* Priority Gauge & Officer Assignment Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Priority Score:</span>
                      <PriorityScore complaint={item} size="sm" showBreakdown={false} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
                      <User size={12} color="#16A34A" />
                      <span>Assigned: <strong>Eng. Marcus Vance</strong></span>
                    </div>

                    {item.supportCount > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#2563EB', fontWeight: 700 }}>
                        <ThumbsUp size={12} />
                        <span>{item.supportCount} upvotes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                  {/* Status Dropdown */}
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(itemId, e.target.value)}
                    disabled={updatingId === itemId}
                    style={{
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.78rem',
                      borderRadius: '9999px',
                      border: '1px solid #E2E8F0',
                      background: '#F8FAFC',
                      color: '#0F172A',
                      fontWeight: 700
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(item)}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', borderRadius: '9999px', fontWeight: 700 }}
                  >
                    <Eye size={13} />
                    <span>Inspect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/officer/complaints/${item.complaintId || item._id}`)}
                    className="btn"
                    style={{
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.78rem',
                      background: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '9999px',
                      fontWeight: 700,
                      boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                    }}
                  >
                    <span>View Complaint</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Slide-Over Inspector Drawer */}
      {selectedComplaint && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedComplaint(null)} />
          <div className="drawer-panel" style={{ background: '#FFFFFF' }}>
            {/* Drawer Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge font-mono" style={{ background: '#F1F5F9', color: '#475569' }}>
                    #{selectedComplaint.complaintId}
                  </span>
                  <StatusBadge type="status" value={selectedComplaint.status} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.25rem', color: '#0F172A' }}>{selectedComplaint.title}</h3>
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

            {/* Drawer Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {selectedComplaint.image && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', maxHeight: '200px' }}>
                  <img src={selectedComplaint.image} alt={selectedComplaint.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Priority Engine Gauge */}
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Smart Priority Gauge & Factors
                </div>
                <PriorityScore complaint={selectedComplaint} size="md" showBreakdown={true} />
              </div>

              {/* Action Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>Update Priority</label>
                  <select
                    className="form-control"
                    value={selectedComplaint.priority}
                    onChange={(e) => handlePriorityChange(selectedComplaint.complaintId || selectedComplaint._id, e.target.value)}
                    style={{ borderRadius: '8px', border: '1px solid #E2E8F0', padding: '0.45rem' }}
                  >
                    <option value="Critical">Critical Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>Lifecycle Stage</label>
                  <select
                    className="form-control"
                    value={selectedComplaint.status}
                    onChange={(e) => handleStatusChange(selectedComplaint.complaintId || selectedComplaint._id, e.target.value)}
                    style={{ borderRadius: '8px', border: '1px solid #E2E8F0', padding: '0.45rem' }}
                  >
                    <option value="Pending">Pending Triage</option>
                    <option value="In Review">In Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '0.35rem' }}>Report Description</div>
                <p style={{ color: '#0F172A', fontSize: '0.88rem', lineHeight: 1.6 }}>{selectedComplaint.description}</p>
              </div>

              {/* Field Notes Timeline */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0F172A' }}>
                  Engineering Field Notes
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(selectedComplaint.fieldNotes || []).map((fn, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <User size={12} color="#16A34A" /> {fn.author}
                        </span>
                        <span className="font-mono">{fn.timestamp}</span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#475569' }}>{fn.note}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add official engineering note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.84rem', borderRadius: '8px' }}
                  />
                  <button type="submit" className="btn" style={{ padding: '0.45rem 0.85rem', background: '#16A34A', color: '#FFFFFF', borderRadius: '8px', border: 'none' }}>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


import React, { useEffect, useState } from 'react';
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
  User
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import StatusBadge from '../../components/StatusBadge';
import PriorityScore from '../../components/PriorityScore';
import EmptyState from '../../components/EmptyState';

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
      author: 'Officer Marcus Vance',
      note: newNote.trim()
    });

    if (res.success) {
      const updatedNotes = res.data?.fieldNotes || [
        ...(selectedComplaint.fieldNotes || []),
        { timestamp: new Date().toLocaleString(), author: 'Officer Marcus Vance', note: newNote.trim() }
      ];
      setSelectedComplaint(prev => ({ ...prev, fieldNotes: updatedNotes }));
      setNewNote('');
    }
  };

  const categories = ['All', 'Pothole', 'Garbage Accumulation', 'Water Leakage', 'Broken Streetlight', 'Damaged Road', 'Other'];
  const statuses = ['All', 'Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filteredComplaints = complaints.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesPri = selectedPriority === 'All' || item.priority === selectedPriority;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesStat && matchesPri && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          OFFICER OPERATIONS COMMAND
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Incident Triage & Priority Queue</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review municipal tickets, adjust stage lifecycle status, compute priority scores, and open the slide-over inspector drawer.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#3B82F6" />
            <input
              type="text"
              className="form-control"
              placeholder="Filter by title, landmark, or Ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} color="var(--text-muted)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Category:</span>
              <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Status:</span>
              <select className="form-control" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                {statuses.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Priority:</span>
              <select className="form-control" value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                {priorities.map((p, i) => <option key={i} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* High Density Table */}
      <div className="table-container">
        {loading ? (
          <EmptyState type="loading" title="Loading queue..." message="Fetching triage records." />
        ) : filteredComplaints.length === 0 ? (
          <EmptyState type="empty" title="No matching tickets" message="Try adjusting filter controls." />
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket Reference</th>
                <th>Incident Title & Location</th>
                <th>Category</th>
                <th>Priority & Score</th>
                <th>Stage Status</th>
                <th>Support</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((item) => {
                const itemId = item.complaintId || item._id;
                const isSelected = selectedComplaint && (selectedComplaint.complaintId === itemId || selectedComplaint._id === itemId);

                return (
                  <tr key={itemId} className={isSelected ? 'selected' : ''}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>
                      #{item.complaintId}
                    </td>

                    <td style={{ maxWidth: '320px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                        {item.title}
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={11} color="#3B82F6" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    <td style={{ color: 'var(--text-secondary)' }}>
                      {item.category}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <StatusBadge type="priority" value={item.priority} size="sm" />
                        <PriorityScore complaint={item} size="sm" showBreakdown={false} />
                      </div>
                    </td>

                    <td>
                      <select
                        className="form-control"
                        value={item.status}
                        onChange={(e) => handleStatusChange(itemId, e.target.value)}
                        disabled={updatingId === itemId}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="font-mono" style={{ fontWeight: 600 }}>
                      👍 {item.supportCount || 0}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedComplaint(item)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                      >
                        <Eye size={13} />
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

      {/* Slide-Over Inspector Drawer */}
      {selectedComplaint && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedComplaint(null)} />
          <div className="drawer-panel">
            {/* Drawer Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-medium font-mono">#{selectedComplaint.complaintId}</span>
                  <StatusBadge type="status" value={selectedComplaint.status} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.25rem' }}>{selectedComplaint.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="btn btn-secondary"
                style={{ padding: '0.35rem', borderRadius: 'var(--radius-xs)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {selectedComplaint.image && (
                <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '200px' }}>
                  <img src={selectedComplaint.image} alt={selectedComplaint.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Priority Engine Gauge */}
              <div style={{ background: 'var(--bg-canvas)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Smart Priority Gauge & Factors
                </div>
                <PriorityScore complaint={selectedComplaint} size="md" showBreakdown={true} />
              </div>

              {/* Action Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Update Priority</label>
                  <select
                    className="form-control"
                    value={selectedComplaint.priority}
                    onChange={(e) => handlePriorityChange(selectedComplaint.complaintId || selectedComplaint._id, e.target.value)}
                  >
                    <option value="Critical">Critical Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Lifecycle Stage</label>
                  <select
                    className="form-control"
                    value={selectedComplaint.status}
                    onChange={(e) => handleStatusChange(selectedComplaint.complaintId || selectedComplaint._id, e.target.value)}
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
              <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>Report Description</div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{selectedComplaint.description}</p>
              </div>

              {/* Field Notes Timeline */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Engineering Field Notes
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(selectedComplaint.fieldNotes || []).map((fn, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <User size={12} color="#3B82F6" /> {fn.author}
                        </span>
                        <span className="font-mono">{fn.timestamp}</span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{fn.note}</p>
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
                    style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.84rem' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem' }}>
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

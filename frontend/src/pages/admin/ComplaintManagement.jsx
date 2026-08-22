import React, { useEffect, useState } from 'react';
import { Sliders, Search, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
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
        prev.map(c =>
          c.complaintId === res.data.complaintId || c._id === res.data._id
            ? { ...c, status: res.data.status }
            : c
        )
      );
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    setUpdatingId(id);
    const res = await api.updateComplaint(id, { priority: newPriority });
    setUpdatingId(null);

    if (res.success && res.data) {
      setComplaints(prev =>
        prev.map(c =>
          c.complaintId === res.data.complaintId || c._id === res.data._id
            ? { ...c, priority: res.data.priority }
            : c
        )
      );
    }
  };

  const filtered = complaints.filter(c => {
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchPriority = filterPriority === 'All' || c.priority === filterPriority;
    const matchQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       c.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchPriority && matchQuery;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Complaint Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Review issues, update resolution status, and override smart priority scores.
          </p>
        </div>
        <button onClick={fetchComplaints} className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem' }}>
          <RefreshCw size={16} />
          <span>Refresh Table</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="form-control"
            placeholder="Filter by ID, title, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            className="form-control"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading complaints table...</div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title & Category</th>
                <th>Location</th>
                <th>Upvotes</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No matching complaints found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.complaintId || item._id}>
                    <td>
                      <strong style={{ color: 'var(--brand-primary)' }}>{item.complaintId}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.category}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{item.location}</td>
                    <td style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{item.supportCount || 0}</td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        value={item.priority}
                        onChange={(e) => handlePriorityChange(item.complaintId || item._id, e.target.value)}
                        disabled={updatingId === (item.complaintId || item._id)}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.complaintId || item._id, e.target.value)}
                        disabled={updatingId === (item.complaintId || item._id)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {updatingId === (item.complaintId || item._id) ? 'Updating...' : 'Auto-saved'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

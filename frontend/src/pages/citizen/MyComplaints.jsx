import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  PlusCircle,
  Search,
  ArrowRight,
  MapPin,
  Calendar,
  Filter,
  Tag,
  Activity,
  RefreshCw
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import KpiCard from '../../components/KpiCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityScore from '../../components/PriorityScore';
import EmptyState from '../../components/EmptyState';

export default function MyComplaints() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintService.getComplaints();
      setLoading(false);
      if (res.success && Array.isArray(res.data)) {
        setComplaints(res.data);
      } else {
        setError(res.message || 'Unable to retrieve complaints from the server.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred while fetching your complaints.');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Summary counts
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'In Review'
  ).length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Filter complaints based on search term and status filter
  const filteredComplaints = complaints.filter((item) => {
    // Status Filter
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      if (statusFilter === 'Pending') {
        matchesStatus = item.status === 'Pending' || item.status === 'In Review';
      } else {
        matchesStatus = item.status === statusFilter;
      }
    }

    // Search term filter (reference ID, title, or location)
    const term = searchTerm.toLowerCase().trim();
    let matchesSearch = true;
    if (term) {
      const idMatch = (item.complaintId || item._id || '').toLowerCase().includes(term);
      const titleMatch = (item.title || '').toLowerCase().includes(term);
      const locationMatch = (item.location || '').toLowerCase().includes(term);
      const categoryMatch = (item.category || '').toLowerCase().includes(term);
      matchesSearch = idMatch || titleMatch || locationMatch || categoryMatch;
    }

    return matchesStatus && matchesSearch;
  });

  const filterOptions = [
    { label: 'All', value: 'All', count: totalCount },
    { label: 'Pending / Triage', value: 'Pending', count: pendingCount },
    { label: 'In Progress', value: 'In Progress', count: inProgressCount },
    { label: 'Resolved', value: 'Resolved', count: resolvedCount }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <p className="page-kicker">Citizen Complaint Management</p>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>My Complaints</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Track, review, and monitor status updates for all municipal reports you have submitted.
          </p>
        </div>

        <Link to="/citizen/report" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Report an Issue</span>
        </Link>
      </div>

      {/* 2. Complaint Summary KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <KpiCard
          value={totalCount}
          label="Total Submitted"
          subtitle="Registered in municipal system"
          icon={FileText}
          accentColor="#3B82F6"
          loading={loading}
        />
        <KpiCard
          value={pendingCount}
          label="Pending Triage"
          subtitle="Awaiting initial engineering review"
          icon={Clock}
          accentColor="#F59E0B"
          loading={loading}
        />
        <KpiCard
          value={inProgressCount}
          label="In Progress"
          subtitle="Field crew actively assigned"
          icon={Activity}
          accentColor="#6366F1"
          loading={loading}
        />
        <KpiCard
          value={resolvedCount}
          label="Verified Resolved"
          subtitle="Field work completed & verified"
          icon={CheckCircle2}
          accentColor="#10B981"
          loading={loading}
        />
      </div>

      {/* 3 & 4. Search and Filter Bar */}
      <div className="panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="var(--primary)" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by complaint reference, title, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
            {searchTerm && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSearchTerm('')}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchComplaints}
            title="Refresh Complaints List"
            style={{ padding: '0.5rem 0.85rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.5rem' }}>
            <Filter size={14} /> Filter Status:
          </span>
          {filterOptions.map((opt) => {
            const active = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(opt.value)}
                style={{
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {opt.label}
                <span
                  style={{
                    marginLeft: '0.4rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    background: active ? 'rgba(255,255,255,0.25)' : 'var(--bg-hover)',
                    color: active ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Complaints List / Cards */}
      {loading ? (
        <EmptyState
          type="loading"
          title="Loading your reports..."
          message="Retrieving complaint history from the municipal portal."
        />
      ) : error ? (
        <EmptyState
          type="error"
          title="Unable to load complaints"
          message={error}
          onRetry={fetchComplaints}
        />
      ) : filteredComplaints.length === 0 ? (
        /* 6. Empty State */
        <EmptyState
          type="empty"
          title={complaints.length === 0 ? "No complaints submitted yet" : "No matching complaints found"}
          message={
            complaints.length === 0
              ? "You haven't submitted any civic complaints yet. Use the 'Report an Issue' button above to submit your first concern."
              : "No complaints match your current search terms or status filter criteria. Try adjusting your search query or filters."
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredComplaints.map((item) => (
            <div
              key={item.complaintId || item._id}
              className="panel panel-interactive"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Header row of Complaint Card */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-medium font-mono">#{item.complaintId}</span>
                  <StatusBadge type="status" value={item.status} />
                  <StatusBadge type="priority" value={item.priority} />
                  <PriorityScore complaint={item} size="sm" showBreakdown={false} />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}
                  className="font-mono"
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} color="var(--primary)" />
                    Submitted: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.updatedAt && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} color="var(--text-muted)" />
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {item.image && (
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Tag size={14} color="#38BDF8" />
                      <strong>Category:</strong> {item.category}
                    </span>
                    <span className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="#3B82F6" />
                      <strong>Location:</strong> {item.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer action bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: '0.25rem'
                }}
              >
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {item.supportCount > 0 ? (
                    <span>Community support: <strong>{item.supportCount} citizens upvoted</strong></span>
                  ) : (
                    <span>Registered in municipal portal</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/track?id=${item.complaintId}`)}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.84rem' }}
                >
                  <span>Track Status & Field Notes</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


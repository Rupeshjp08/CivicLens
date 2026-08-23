import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Bell,
  RefreshCw,
  Sliders,
  Activity,
  ChevronRight,
  User,
  Building2
} from 'lucide-react';
import { officerService } from '../../services/officerService';
import StatusBadge from '../../components/StatusBadge';
import PriorityScore from '../../components/PriorityScore';
import KpiCard from '../../components/KpiCard';
import EmptyState from '../../components/EmptyState';
import MunicipalMap from '../../components/officer/MunicipalMap';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadAssignments = async () => {
    setLoading(true);
    const res = await officerService.getOfficerAssignments();
    setLoading(false);
    if (res.success && Array.isArray(res.data)) {
      setAssignments(res.data);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
    setTimeout(() => setRefreshing(false), 500);
  };

  const criticalTasks = assignments.filter((a) => a.priority === 'Critical' || a.priority === 'High');
  const activeCount = assignments.filter((a) => a.status !== 'Resolved').length;
  const completedCount = assignments.filter((a) => a.status === 'Resolved').length;

  const filteredAssignments = assignments.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.complaintId || '').toLowerCase().includes(term) ||
      (item.title || '').toLowerCase().includes(term) ||
      (item.location || '').toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 4 & 5. Top Header & Control Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.86rem', color: '#64748B', fontWeight: 600, marginBottom: '0.2rem' }}>
            Good evening, Eng. Marcus 👋
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', margin: 0 }}>
            Field Assignments & <span style={{ color: '#16A34A' }}>Priority Dispatches</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Real-time overview of municipal operations and field activities.
          </p>
        </div>

        {/* Top Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search complaints, ID, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                fontSize: '0.82rem',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '9999px',
                color: '#0F172A',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                outline: 'none'
              }}
            />
          </div>

          {/* Refresh Button */}
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
            <span>Refresh Live Data</span>
          </button>

          {/* Notification Button */}
          <button
            type="button"
            className="btn"
            aria-label="Notifications"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              position: 'relative'
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#EF4444',
                border: '1.5px solid #FFFFFF'
              }}
            />
          </button>
        </div>
      </div>

      {/* 6. Light Municipal KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KpiCard
          value={assignments.length < 10 ? `0${assignments.length}` : assignments.length}
          label="TOTAL ASSIGNED TASKS"
          subtitle="Assigned to field team"
          icon={Truck}
          accentColor="#16A34A"
          trend={{ direction: 'up', value: '12%' }}
          loading={loading}
        />
        <KpiCard
          value={activeCount < 10 ? `0${activeCount}` : activeCount}
          label="ACTIVE IN PROGRESS"
          subtitle="Pending field completion"
          icon={Clock}
          accentColor="#F97316"
          trend={{ direction: 'up', value: '8%' }}
          loading={loading}
        />
        <KpiCard
          value={criticalTasks.length < 10 ? `0${criticalTasks.length}` : criticalTasks.length}
          label="CRITICAL DISPATCHES"
          subtitle="Immediate priority hazard"
          icon={AlertTriangle}
          accentColor="#EF4444"
          trend={{ direction: 'up', value: '33%' }}
          loading={loading}
        />
        <KpiCard
          value={completedCount < 10 ? `0${completedCount}` : completedCount}
          label="RESOLVED DISPATCHES"
          subtitle="Verified complete today"
          icon={ShieldCheck}
          accentColor="#16A34A"
          trend={{ direction: 'up', value: '16%' }}
          loading={loading}
        />
      </div>

      {/* 7, 8, 9. Live Municipal Map Module */}
      <div>
        <MunicipalMap />
      </div>

      {/* 12. Critical Immediate Dispatch Alert Banner */}
      {criticalTasks.length > 0 && (
        <div
          className="panel"
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(239, 68, 68, 0.04)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }}></span>
                CRITICAL DISPATCH PRIORITIZED
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: '0.15rem' }}>
                {criticalTasks[0].title}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={13} color="#2563EB" />
                <span>{criticalTasks[0].location}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/officer/complaints/${criticalTasks[0].complaintId}`)}
            className="btn"
            style={{
              padding: '0.55rem 1.1rem',
              fontSize: '0.82rem',
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: 700,
              boxShadow: '0 3px 10px rgba(239, 68, 68, 0.25)'
            }}
          >
            <span>Open Work Order</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 10, 11, 12. Priority Queue & Recent Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Card: Priority Queue */}
        <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={15} color="#16A34A" />
              <span>PRIORITY QUEUE</span>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
              {filteredAssignments.length} Items
            </span>
          </div>

          {loading ? (
            <EmptyState type="loading" title="Loading priority queue..." message="Retrieving officer dispatch items." />
          ) : filteredAssignments.length === 0 ? (
            <EmptyState type="empty" title="No active dispatches" message="All field work orders are clear." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredAssignments.slice(0, 4).map((item) => (
                <div
                  key={item.complaintId || item._id}
                  style={{
                    padding: '0.9rem 1rem',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 150ms ease',
                    borderLeft: item.priority === 'Critical' ? '4px solid #EF4444' : item.priority === 'High' ? '4px solid #F97316' : '4px solid #F59E0B'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="badge font-mono" style={{ fontSize: '0.72rem', background: '#E2E8F0', color: '#475569' }}>
                        #{item.complaintId}
                      </span>
                      <StatusBadge type="priority" value={item.priority} size="sm" />
                      <StatusBadge type="status" value={item.status} size="sm" />
                    </div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                      <MapPin size={12} color="#2563EB" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/officer/complaints/${item.complaintId}`)}
                    className="btn"
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.78rem',
                      background: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '9999px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    <span>Inspect</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate('/officer/queue')}
            className="btn btn-ghost"
            style={{
              padding: '0.4rem 0',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#16A34A',
              justifyContent: 'flex-start',
              marginTop: '0.25rem'
            }}
          >
            <span>View all in Priority Queue</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Right Card: Recent Activity */}
        <div className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={15} color="#16A34A" />
              <span>RECENT ACTIVITY</span>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
              Live Log
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { id: 'CL-2026-00102', action: 'Water Main Inspection Completed', actor: 'Eng. Marcus Vance', time: '12m ago', isResolved: true },
              { id: 'CL-2026-00101', action: 'Pothole Site Assessment Dispatched', actor: 'Dispatch System', time: '45m ago', isResolved: false },
              { id: 'CL-2026-00105', action: 'Transformer Hazard Flagged Critical', actor: 'Citizen Alert', time: '1h ago', isResolved: false },
              { id: 'CL-2026-00104', action: 'Walkway Lighting Verified Resolved', actor: 'Field Crew Alpha', time: '3h ago', isResolved: true }
            ].map((act, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  paddingBottom: idx < 3 ? '0.75rem' : 0,
                  borderBottom: idx < 3 ? '1px solid #F1F5F9' : 'none'
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: act.isResolved ? 'rgba(22, 163, 74, 0.1)' : '#F1F5F9',
                    color: act.isResolved ? '#16A34A' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.1rem'
                  }}
                >
                  <Activity size={14} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16A34A' }}>#{act.id}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{act.time}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '0.1rem' }}>{act.action}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>{act.actor}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/officer/history')}
            className="btn btn-ghost"
            style={{
              padding: '0.4rem 0',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#16A34A',
              justifyContent: 'flex-start',
              marginTop: '0.25rem'
            }}
          >
            <span>View all activity</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}



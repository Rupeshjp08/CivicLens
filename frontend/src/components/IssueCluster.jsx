import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Users, Clock, Layers } from 'lucide-react';

/**
 * IssueCluster Component
 * Groups related nearby complaints visually
 * 
 * @param {Array} complaints - Array of complaint objects sharing a cluster
 * @param {Function} onSelectComplaint - Callback when individual complaint is clicked
 * @param {string} clusterLabel - Optional label (e.g. "Sector 4 — Pothole Reports")
 */
export default function IssueCluster({ complaints = [], onSelectComplaint, clusterLabel }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!complaints || complaints.length < 2) return null;
  
  const totalSupport = complaints.reduce((sum, c) => sum + (c.supportCount || 0), 0);
  const dominantCategory = complaints[0]?.category || 'Unknown';
  const label = clusterLabel || `${dominantCategory} — ${complaints[0]?.location?.split(',')[0] || 'Area'}`;
  
  const priorityCounts = {
    Critical: complaints.filter(c => c.priority === 'Critical').length,
    High: complaints.filter(c => c.priority === 'High').length,
  };
  
  return (
    <div className="cluster-card">
      <div className="cluster-header" onClick={() => setExpanded(!expanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Stacked cards visual */}
          <div className="cluster-stack">
            <div className="cluster-stack-card" />
            <div className="cluster-stack-card" />
            <div className="cluster-stack-card" />
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <span className="cluster-count">{complaints.length}</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Related Reports
              </span>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {label}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {/* Aggregated stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Users size={12} />
              {totalSupport} support
            </span>
            {priorityCounts.Critical > 0 && (
              <span className="badge badge-critical" style={{ fontSize: '10px', padding: '1px 6px' }}>
                {priorityCounts.Critical} Critical
              </span>
            )}
            {priorityCounts.High > 0 && (
              <span className="badge badge-high" style={{ fontSize: '10px', padding: '1px 6px' }}>
                {priorityCounts.High} High
              </span>
            )}
          </div>
          
          {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>
      
      <div className={`cluster-items ${expanded ? 'expanded' : ''}`}>
        {complaints.map((complaint, idx) => (
          <div
            key={complaint.complaintId || complaint._id || idx}
            className="cluster-item"
            onClick={() => onSelectComplaint?.(complaint)}
            style={{ cursor: onSelectComplaint ? 'pointer' : 'default' }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 3 }}>
                <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--brand-blue)', fontWeight: 700 }}>
                  #{complaint.complaintId}
                </span>
                <span className={`badge badge-${complaint.priority?.toLowerCase() || 'medium'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                  {complaint.priority}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {complaint.title}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={11} />
                {complaint.location}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <Users size={11} />
              {complaint.supportCount || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

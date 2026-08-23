import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Radio
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import StatusBadge from '../StatusBadge';
import PriorityScore from '../PriorityScore';
import EmptyState from '../EmptyState';

// Helper to calculate lat/lng coordinates for any complaint
function getComplaintCoordinates(complaint, index = 0) {
  if (typeof complaint.lat === 'number' && typeof complaint.lng === 'number') {
    return [complaint.lat, complaint.lng];
  }
  if (typeof complaint.mapY === 'number' && typeof complaint.mapX === 'number') {
    return [complaint.mapY, complaint.mapX];
  }

  // Parse coordinates from string like (37.7749° N, 122.4194° W)
  if (complaint.location) {
    const match = complaint.location.match(/\(([0-9.]+)[^\d,]*,\s*([0-9.]+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = -Math.abs(parseFloat(match[2]));
      if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    }

    // Known Sector centroids in San Francisco demo bounds
    const sectorMatch = complaint.location.match(/Sector\s*(\d)/i);
    if (sectorMatch) {
      const secNum = parseInt(sectorMatch[1], 10);
      const sectorCoords = {
        1: [37.7890, -122.4010],
        2: [37.7820, -122.4120],
        3: [37.7750, -122.4220],
        4: [37.7680, -122.4310],
        5: [37.7610, -122.4410]
      };
      if (sectorCoords[secNum]) {
        const offsetLat = ((index * 17) % 11) * 0.0018 - 0.004;
        const offsetLng = ((index * 23) % 11) * 0.0018 - 0.004;
        return [sectorCoords[secNum][0] + offsetLat, sectorCoords[secNum][1] + offsetLng];
      }
    }
  }

  // Deterministic coordinate generator based on complaint ID hash
  const idStr = String(complaint.complaintId || complaint._id || index);
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 100) / 100 - 0.5) * 0.035;
  const lngOffset = ((Math.abs(hash * 3) % 100) / 100 - 0.5) * 0.035;

  return [37.7749 + latOffset, -122.4194 + lngOffset];
}

// Custom Leaflet DivIcon with priority color & pulsing animation
function createCustomMarkerIcon(priority, status) {
  let color = '#10B981';
  let pulse = false;

  if (status === 'Resolved') {
    color = '#0E7490';
  } else if (priority === 'Critical') {
    color = '#EF4444';
    pulse = true;
  } else if (priority === 'High') {
    color = '#F97316';
  } else if (priority === 'Medium') {
    color = '#F59E0B';
  } else {
    color = '#10B981';
  }

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
      ${pulse ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${color}; opacity: 0.45; animation: mapPulse 1.8s ease-out infinite;"></div>` : ''}
      <div style="width: 22px; height: 22px; border-radius: 50%; background: ${color}; border: 2.5px solid #FFFFFF; box-shadow: 0 3px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2;">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
}

// Component to dynamically fit map bounds to markers
function MapBoundsAdjuster({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!markers || markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map((m) => m.coords));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [markers, map]);

  return null;
}

export default function MunicipalMap() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const loadComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintService.getComplaints();
      setLoading(false);
      if (res.success && Array.isArray(res.data)) {
        setComplaints(res.data);
      } else {
        setError(res.message || 'Unable to retrieve complaints data.');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to connect to municipal complaint service.');
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Map markers with assigned coordinates
  const markersData = useMemo(() => {
    return complaints.map((c, idx) => ({
      ...c,
      coords: getComplaintCoordinates(c, idx)
    }));
  }, [complaints]);

  // Compute header counts
  const activeCount = complaints.filter((c) => c.status !== 'Resolved').length;
  const criticalCount = complaints.filter((c) => c.priority === 'Critical').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Filtered markers
  const filteredMarkers = useMemo(() => {
    return markersData.filter((item) => {
      // Priority/Status filter
      let matchesFilter = true;
      if (priorityFilter === 'Critical') matchesFilter = item.priority === 'Critical';
      else if (priorityFilter === 'High') matchesFilter = item.priority === 'High';
      else if (priorityFilter === 'Medium') matchesFilter = item.priority === 'Medium';
      else if (priorityFilter === 'Resolved') matchesFilter = item.status === 'Resolved';

      // Search term
      const term = searchTerm.toLowerCase().trim();
      let matchesSearch = true;
      if (term) {
        const idMatch = (item.complaintId || item._id || '').toLowerCase().includes(term);
        const titleMatch = (item.title || '').toLowerCase().includes(term);
        const locMatch = (item.location || '').toLowerCase().includes(term);
        const catMatch = (item.category || '').toLowerCase().includes(term);
        matchesSearch = idMatch || titleMatch || locMatch || catMatch;
      }

      return matchesFilter && matchesSearch;
    });
  }, [markersData, priorityFilter, searchTerm]);

  const filterOptions = [
    { label: 'All', value: 'All', count: complaints.length },
    { label: 'Critical', value: 'Critical', count: criticalCount, color: '#EF4444' },
    { label: 'High', value: 'High', count: complaints.filter((c) => c.priority === 'High').length, color: '#F97316' },
    { label: 'Medium', value: 'Medium', count: complaints.filter((c) => c.priority === 'Medium').length, color: '#F59E0B' },
    { label: 'Resolved', value: 'Resolved', count: resolvedCount, color: '#10B981' }
  ];

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Auto-select first critical complaint or first marker if available
  useEffect(() => {
    if (filteredMarkers.length > 0 && !selectedComplaint) {
      const crit = filteredMarkers.find((m) => m.priority === 'Critical') || filteredMarkers[0];
      setSelectedComplaint(crit);
    }
  }, [filteredMarkers]);

  return (
    <div
      className="panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* 8. Map Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#16A34A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(22, 163, 74, 0.12)', border: '1px solid rgba(22, 163, 74, 0.25)', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
              <span className="badge-dot" style={{ background: '#16A34A', animation: 'alertPulse 1.5s infinite' }}></span>
              LIVE
            </span>
            <span>MUNICIPAL MAP</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
            City Sector Geospatial Overview
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '0.15rem' }}>
            Real-time visual map of active municipal complaints, hazard priority levels, and field assignments.
          </p>
        </div>

        {/* Live Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', background: 'var(--bg-panel-subtle)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }}></span>
            {activeCount} Active
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>
            {criticalCount} Critical
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }}></span>
            {resolvedCount} Resolved
          </span>
        </div>
      </div>

      {/* 7. Controls: Search and Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="form-control"
            placeholder="Search map by ID, title, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
          />
          {searchTerm && (
            <button type="button" className="btn btn-ghost" onClick={() => setSearchTerm('')} style={{ padding: '0.2rem 0.5rem', fontSize: '0.78rem' }}>
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {filterOptions.map((opt) => {
            const active = priorityFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPriorityFilter(opt.value)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {opt.color && <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.color, marginRight: 4, display: 'inline-block' }}></span>}
                {opt.label}
                <span
                  style={{
                    marginLeft: '0.35rem',
                    padding: '0.05rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
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

      {/* 11, 12, 13. Map Container / States */}
      {loading ? (
        <EmptyState type="loading" title="Loading municipal map..." message="Retrieving geospatial complaint nodes from database." />
      ) : error ? (
        <EmptyState type="error" title="Unable to load municipal map" message={error} onRetry={loadComplaints} />
      ) : filteredMarkers.length === 0 ? (
        <EmptyState
          type="empty"
          title="No civic issues found"
          message="There are currently no complaints matching your search query or filter criteria."
        />
      ) : (
        <div
          style={{
            height: '315px',
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            position: 'relative'
          }}
        >
          <MapContainer
            center={[37.7749, -122.4194]}
            zoom={13}
            style={{ height: '100%', width: '100%', background: '#F8FAFC' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MapBoundsAdjuster markers={filteredMarkers} />

            {filteredMarkers.map((item) => (
              <Marker
                key={item.complaintId || item._id}
                position={item.coords}
                icon={createCustomMarkerIcon(item.priority, item.status)}
                eventHandlers={{
                  click: () => setSelectedComplaint(item)
                }}
              >
                {/* 6. Marker Popover Card */}
                <Popup width={280}>
                  <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge font-mono" style={{ fontSize: '0.72rem', background: '#E2E8F0', color: '#475569' }}>
                        #{item.complaintId}
                      </span>
                      <StatusBadge type="priority" value={item.priority} size="sm" />
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                      {item.title}
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/officer/complaints/${item.complaintId}`)}
                      className="btn"
                      style={{
                        width: '100%',
                        padding: '0.45rem',
                        fontSize: '0.78rem',
                        marginTop: '0.2rem',
                        background: '#16A34A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '9999px',
                        fontWeight: 700
                      }}
                    >
                      <span>View Complaint</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 11. Floating Selected Complaint Overlay Card */}
            {selectedComplaint && (
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  zIndex: 1000,
                  width: 290,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '1rem',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <StatusBadge type="priority" value={selectedComplaint.priority} size="sm" />
                    <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>
                      #{selectedComplaint.complaintId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    style={{
                      background: '#F1F5F9',
                      border: 'none',
                      borderRadius: '50%',
                      width: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748B',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                    {selectedComplaint.title}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                    <MapPin size={12} color="#2563EB" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedComplaint.location}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', paddingTop: '0.45rem', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>Status</span>
                    <StatusBadge type="status" value={selectedComplaint.status} size="sm" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>Assigned</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>John Field Officer</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/officer/complaints/${selectedComplaint.complaintId}`)}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '0.45rem',
                    fontSize: '0.8rem',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  <span>View Complaint →</span>
                </button>
              </div>
            )}

            {/* 9. Map Legend Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #E2E8F0',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Legend:</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444' }}></span> Critical
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F97316' }}></span> High
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B' }}></span> Medium
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563EB' }}></span> Low
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A' }}></span> Resolved
              </span>
            </div>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

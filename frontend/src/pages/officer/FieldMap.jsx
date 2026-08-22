import React from 'react';
import { MapPin, Navigation, Radio, AlertTriangle } from 'lucide-react';

export default function FieldMap() {
  const pins = [
    { id: 'CL-2026-00101', title: 'Pothole - Sector 4', lat: '37.7749° N', lng: '122.4194° W', priority: 'High' },
    { id: 'CL-2026-00102', title: 'Water Main Burst - Sector 5', lat: '37.7812° N', lng: '122.4089° W', priority: 'Critical' },
    { id: 'CL-2026-00105', title: 'Transformer Hazard - Sector 1', lat: '37.7690° N', lng: '122.4210° W', priority: 'Critical' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          GEOSPATIAL NAVIGATION
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Field Dispatch Map</h1>
      </div>

      {/* Integration Ready Map Placeholder */}
      <div className="panel" style={{ height: '320px', background: '#090C10', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Radio size={36} color="#10B981" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Live Geospatial Node Active</h3>
          <p style={{ fontSize: '0.85rem' }}>GPS Satellite Lock: 37.7749° N, 122.4194° W</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
        {pins.map((p) => (
          <div key={p.id} className="panel" style={{ padding: '1.25rem', borderLeft: p.priority === 'Critical' ? '4px solid #EF4444' : '4px solid #F97316' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--brand-blue)' }}>#{p.id}</span>
              <span className={`badge badge-${p.priority.toLowerCase()}`}>{p.priority}</span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{p.title}</h4>
            <div className="font-mono" style={{ fontSize: '0.8rem', color: '#38BDF8', marginTop: '0.2rem' }}>
              {p.lat}, {p.lng}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

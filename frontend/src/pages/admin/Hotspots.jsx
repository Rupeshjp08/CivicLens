import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  AlertTriangle, 
  Send,
  Activity,
  Layers
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import IssueCluster from '../../components/IssueCluster';

export default function Hotspots() {
  const [sectors, setSectors] = useState([
    {
      id: 'SEC-01',
      name: 'Main Road Junction',
      area: 'Sector 1 - North District',
      activeIncidents: 14,
      topCategory: 'Potholes & Hazards',
      priority: 'High',
      velocity: '92%',
      status: 'Active Field Unit 4 Dispatched'
    },
    {
      id: 'SEC-02',
      name: 'Central Bus Terminal',
      area: 'Sector 2 - Commercial Hub',
      activeIncidents: 9,
      topCategory: 'Garbage & Sanitation',
      priority: 'Medium',
      velocity: '84%',
      status: 'Scheduled Cleanup Shift'
    },
    {
      id: 'SEC-03',
      name: 'Market Square',
      area: 'Sector 3 - Downtown Metro',
      activeIncidents: 18,
      topCategory: 'Power Grid & Streetlights',
      priority: 'Critical',
      priorityReason: 'Night Illumination Blackout',
      velocity: '78%',
      status: 'Emergency Technicians Assigned'
    },
    {
      id: 'SEC-04',
      name: 'School District Zone',
      area: 'Sector 4 - Civic South',
      activeIncidents: 4,
      topCategory: 'Traffic Hazards',
      priority: 'High',
      velocity: '95%',
      status: 'SLA On Track'
    },
    {
      id: 'SEC-05',
      name: 'Industrial Park Complex',
      area: 'Sector 5 - East Utility Belt',
      activeIncidents: 22,
      topCategory: 'Water Main Pipe Bursts',
      priority: 'Critical',
      priorityReason: 'High Pressure Water Burst',
      velocity: '71%',
      status: 'Utility isolation team dispatched'
    }
  ]);

  const [dispatchedSectors, setDispatchedSectors] = useState({});

  const handleDispatchUnit = (secId) => {
    setDispatchedSectors(prev => ({ ...prev, [secId]: true }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
          OFFICER CLUSTER & HOTSPOT MAP
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Hotspot Clusters & Sector Density</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor high-density issue clusters by municipal sector and trigger emergency crew dispatches.
        </p>
      </div>

      {/* Sector Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.35rem' }}>
        {sectors.map((sec) => {
          const isDispatched = dispatchedSectors[sec.id];
          const isCritical = sec.priority === 'Critical';

          return (
            <div 
              key={sec.id} 
              className={`panel ${isCritical ? 'panel-glow-red' : ''}`}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', fontWeight: 700 }}>
                  {sec.id}
                </span>
                <StatusBadge type="priority" value={sec.priority} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{sec.name}</h3>
                <div className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                  <MapPin size={13} color="#3B82F6" />
                  <span>{sec.area}</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-canvas)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Incidents</div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: isCritical ? '#EF4444' : 'var(--text-primary)' }}>
                    {sec.activeIncidents}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Concern</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38BDF8' }}>
                    {sec.topCategory}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={14} color="#10B981" />
                <span>Current Status: <strong style={{ color: 'var(--text-primary)' }}>{isDispatched ? 'Emergency Crew En Route' : sec.status}</strong></span>
              </div>

              <button
                type="button"
                onClick={() => handleDispatchUnit(sec.id)}
                className={`btn ${isCritical ? 'btn-danger' : 'btn-primary'}`}
                style={{ marginTop: 'auto', width: '100%' }}
                disabled={isDispatched}
              >
                {isDispatched ? (
                  <>
                    <Flame size={15} />
                    <span>Crew Dispatched & En Route</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Dispatch Emergency Field Crew</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

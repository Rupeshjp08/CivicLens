import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Send,
  Zap,
  Activity,
  Layers
} from 'lucide-react';

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
      topCategory: 'Water Mains & Leakage',
      priority: 'Critical',
      priorityReason: 'Major Water Pipe Burst',
      velocity: '70%',
      status: 'Utility Dispatch In Progress'
    },
    {
      id: 'SEC-06',
      name: 'Suburban Zone 7',
      area: 'Sector 6 - Residential Outer',
      activeIncidents: 3,
      topCategory: 'Routine Maintenance',
      priority: 'Low',
      velocity: '98%',
      status: 'Normal Operations'
    }
  ]);

  const [dispatchedSectors, setDispatchedSectors] = useState({});

  const handleDispatch = (secId) => {
    setDispatchedSectors(prev => ({ ...prev, [secId]: true }));
    setTimeout(() => {
      setDispatchedSectors(prev => ({ ...prev, [secId]: false }));
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Activity color="#3B82F6" size={24} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Incident Hotspot Map & Density Analyzer</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time municipal sector workload distribution, priority alerts, and dispatch velocity.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#182030', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Radio size={16} color="#EF4444" className="animate-spin" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mesh Density Monitor Active</span>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Active Sectors</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-primary)' }}>6 Monitored Zones</div>
        </div>
        <div className="panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total Open Incidents</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#F59E0B' }}>68 Open Reports</div>
        </div>
        <div className="panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Critical Sector Hotspots</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem', color: '#EF4444' }}>2 High Density</div>
        </div>
      </div>

      {/* Sector Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.35rem' }}>
        {sectors.map((sec) => {
          const isDispatched = dispatchedSectors[sec.id];
          const isCritical = sec.priority === 'Critical';
          const isHigh = sec.priority === 'High';

          return (
            <div 
              key={sec.id} 
              className="panel"
              style={{
                borderLeft: isCritical ? '4px solid #EF4444' : isHigh ? '4px solid #F97316' : '4px solid #3B82F6',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
                padding: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', background: 'rgba(59, 130, 246, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {sec.id}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.35rem' }}>{sec.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                    <MapPin size={13} color="#3B82F6" />
                    <span>{sec.area}</span>
                  </div>
                </div>

                <span className={`badge badge-${sec.priority.toLowerCase()}`}>
                  {sec.priority}
                </span>
              </div>

              {/* Incidents & Category Info */}
              <div style={{ background: '#182030', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Volume</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }} className="font-mono">
                    {sec.activeIncidents} Reports
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Dominant Issue</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38BDF8' }}>
                    {sec.topCategory}
                  </div>
                </div>
              </div>

              {/* SLA Velocity Meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>SLA Resolution Velocity</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#10B981' }}>{sec.velocity}</span>
                </div>
                <div style={{ height: '6px', background: '#182030', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: sec.velocity, height: '100%', background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)' }} />
                </div>
              </div>

              {/* Dispatch Action */}
              <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {sec.status}
                </span>
                
                <button
                  type="button"
                  onClick={() => handleDispatch(sec.id)}
                  disabled={isDispatched}
                  className={`btn ${isCritical || isHigh ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 size={14} color="#10B981" />
                      <span>Unit Dispatched!</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Dispatch Unit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

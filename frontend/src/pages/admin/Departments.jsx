import React, { useEffect, useState } from 'react';
import { Building2, Users, CheckCircle2, Clock, Activity, ShieldCheck } from 'lucide-react';
import { departmentService } from '../../services/departmentService';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentService.getDepartments().then(res => {
      setLoading(false);
      if (res.success) setDepartments(res.data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <Building2 color="#3B82F6" size={24} />
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Municipal Departments</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Operational overview of city engineering departments, active workloads, and SLA compliance scores.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.35rem' }}>
        {departments.map((dept) => (
          <div key={dept.id} className="panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{dept.name}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{dept.head}</div>
              </div>
              <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                {dept.slaPerformance} SLA
              </span>
            </div>

            <div style={{ background: '#182030', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active</div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>{dept.activeComplaints}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Resolved</div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>{dept.resolvedComplaints}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Officers</div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-blue)' }}>{dept.officersCount}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart, TrendingUp, CheckCircle2, Clock, Zap } from 'lucide-react';
import { api } from '../../services/api';

export default function Analytics() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComplaints().then(res => {
      setLoading(false);
      if (res.success && res.data) {
        setComplaints(res.data);
      }
    });
  }, []);

  const getCategoryCounts = () => {
    const counts = {};
    complaints.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const maxCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Civic Analytics & Performance</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Municipal metric reporting, issue category breakdown, and resolution benchmarks.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Calculating civic metrics...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Key Metric Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', borderRadius: 'var(--radius-sm)' }}>
                <Zap size={24} color="#38bdf8" />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resolution Efficiency</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>92.4%</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(250, 204, 21, 0.15)', borderRadius: 'var(--radius-sm)' }}>
                <Clock size={24} color="#facc15" />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Avg Response Time</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>1.8 Days</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(74, 222, 128, 0.15)', borderRadius: 'var(--radius-sm)' }}>
                <CheckCircle2 size={24} color="#4ade80" />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Citizen Satisfaction</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>4.7 / 5.0</div>
              </div>
            </div>
          </div>

          {/* Category Distribution Bar Progress Breakdown */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <BarChart3 size={20} color="var(--brand-primary)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Complaints by Category</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.keys(categoryCounts).length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>No category data available yet.</div>
              ) : (
                Object.entries(categoryCounts).map(([cat, count], idx) => {
                  const percentage = Math.round((count / maxCount) * 100);
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>{cat}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{count} Issues ({Math.round((count / complaints.length) * 100)}%)</span>
                      </div>
                      <div style={{ height: '10px', width: '100%', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: 'var(--brand-gradient)',
                          borderRadius: '5px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';

/**
 * KpiCard Component
 * Reusable animated KPI metric card with accent strip, count-up, and trend
 * 
 * @param {string|number} value - The metric value to display
 * @param {string} label - Uppercase label above the value
 * @param {string} subtitle - Small text below the value
 * @param {React.Component} icon - Lucide icon component
 * @param {string} accentColor - CSS color for the left accent strip
 * @param {{direction: 'up'|'down', value: string}} trend - Optional trend indicator
 * @param {boolean} loading - Show skeleton state
 */
export default function KpiCard({ value, label, subtitle, icon: Icon, accentColor = '#3B82F6', trend, loading = false }) {
  const [displayValue, setDisplayValue] = useState(loading ? '...' : '0');
  const hasAnimated = useRef(false);
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (loading || hasAnimated.current) return;
    
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    
    if (isNaN(numValue)) {
      setDisplayValue(value);
      hasAnimated.current = true;
      return;
    }
    
    // Count-up animation
    const duration = 800;
    const startTime = Date.now();
    const isPercentage = typeof value === 'string' && value.includes('%');
    const suffix = typeof value === 'string' ? value.replace(/[0-9.,]/g, '').trim() : '';
    const hasComma = typeof value === 'string' && value.includes(',');
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numValue * eased;
      
      let formatted;
      if (isPercentage) {
        formatted = current.toFixed(1) + '%';
      } else if (hasComma) {
        formatted = Math.round(current).toLocaleString() + suffix;
      } else if (Number.isInteger(numValue)) {
        formatted = Math.round(current).toString() + suffix;
      } else {
        formatted = current.toFixed(1) + suffix;
      }
      
      setDisplayValue(formatted);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(typeof value === 'string' ? value : value.toString());
        hasAnimated.current = true;
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, loading]);
  
  const iconBg = accentColor + '18';
  
  if (loading) {
    return (
      <div className="kpi-card" style={{ '--kpi-accent': accentColor }}>
        <div className="kpi-header">
          <div className="skeleton skeleton-line short" style={{ height: 10, marginBottom: 0 }} />
          <div className="skeleton skeleton-circle" style={{ width: 36, height: 36 }} />
        </div>
        <div className="skeleton skeleton-line" style={{ height: 28, width: '50%', marginTop: 'var(--space-3)' }} />
        <div className="skeleton skeleton-line short" style={{ height: 10, marginTop: 'var(--space-2)' }} />
      </div>
    );
  }
  
  return (
    <div 
      className="kpi-card slide-up" 
      ref={cardRef}
      style={{ '--kpi-accent': accentColor, '--kpi-icon-bg': iconBg }}
    >
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        {Icon && (
          <div className="kpi-icon">
            <Icon size={18} />
          </div>
        )}
      </div>
      
      <div className="kpi-value">{displayValue}</div>
      
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      
      {trend && (
        <div className={`kpi-trend ${trend.direction === 'up' ? 'kpi-trend-up' : 'kpi-trend-down'}`}>
          {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { Activity, MapPin, Clock, Users, Layers, Flame } from 'lucide-react';

/**
 * Priority Score Calculation
 * Mirrors and extends backend priorityService.js logic
 * Produces a 0–100 numeric score for UI display
 */
const CATEGORY_WEIGHTS = {
  'Water Leakage': 3,
  'Pothole': 3,
  'Damaged Road': 2,
  'Garbage Accumulation': 2,
  'Broken Streetlight': 1,
  'Other': 1
};

export function calculatePriorityScore(complaint) {
  if (!complaint) return { total: 0, factors: [], level: 'Low' };
  
  const categoryWeight = CATEGORY_WEIGHTS[complaint.category] || 1;
  const categoryScore = Math.min(categoryWeight * 15, 45);
  const supportScore = Math.min((complaint.supportCount || 0) * 0.6, 25);
  
  const createdAt = complaint.createdAt ? new Date(complaint.createdAt) : new Date();
  const hoursPending = Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
  const timeScore = Math.min(hoursPending * 0.3, 20);
  
  const baseScore = 10;
  const total = Math.round(Math.min(categoryScore + supportScore + timeScore + baseScore, 100));
  
  let level = 'Low';
  if (total >= 80) level = 'Critical';
  else if (total >= 60) level = 'High';
  else if (total >= 35) level = 'Medium';
  
  const factors = [
    { label: 'Category Severity', value: Math.round(categoryScore), max: 45, color: '#F97316', icon: Layers },
    { label: 'Community Support', value: Math.round(supportScore), max: 25, color: '#3B82F6', icon: Users },
    { label: 'Time Pending', value: Math.round(timeScore), max: 20, color: '#F59E0B', icon: Clock },
    { label: 'Base Score', value: baseScore, max: 10, color: '#64748B', icon: Activity }
  ];
  
  return { total, factors, level };
}

const LEVEL_COLORS = {
  Critical: '#EF4444',
  High: '#F97316',
  Medium: '#F59E0B',
  Low: '#64748B'
};

const LEVEL_BG = {
  Critical: 'rgba(239, 68, 68, 0.10)',
  High: 'rgba(249, 115, 22, 0.10)',
  Medium: 'rgba(245, 158, 11, 0.10)',
  Low: 'rgba(148, 163, 184, 0.10)'
};

/**
 * PriorityScore Component
 * 
 * @param {Object} complaint - The complaint object
 * @param {'sm' | 'md' | 'lg'} size - Display size
 * @param {boolean} showBreakdown - Show factor breakdown
 */
export default function PriorityScore({ complaint, size = 'md', showBreakdown = true }) {
  const { total, factors, level } = calculatePriorityScore(complaint);
  const color = LEVEL_COLORS[level];
  const [animatedOffset, setAnimatedOffset] = useState(null);
  const ref = useRef(null);
  
  const dimensions = {
    sm: { ring: 56, stroke: 4, fontSize: '1rem', labelSize: '0.55rem' },
    md: { ring: 90, stroke: 5, fontSize: '1.65rem', labelSize: '0.65rem' },
    lg: { ring: 120, stroke: 6, fontSize: '2.1rem', labelSize: '0.75rem' }
  };
  
  const dim = dimensions[size];
  const radius = (dim.ring - dim.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (total / 100) * circumference;
  
  useEffect(() => {
    setAnimatedOffset(circumference);
    const timer = setTimeout(() => {
      setAnimatedOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [total, circumference, targetOffset]);
  
  // Compact inline badge for table rows
  if (size === 'sm' && !showBreakdown) {
    return (
      <span 
        className="priority-compact"
        style={{ 
          background: LEVEL_BG[level], 
          color: color,
          border: `1px solid ${color}30`
        }}
      >
        <Flame size={11} />
        {total}
      </span>
    );
  }
  
  return (
    <div className="priority-gauge" ref={ref} style={{ flexDirection: size === 'lg' ? 'column' : 'row', alignItems: size === 'lg' ? 'center' : 'center' }}>
      {/* Circular Ring Gauge */}
      <div className="priority-gauge-ring" style={{ width: dim.ring, height: dim.ring, '--gauge-color': color }}>
        <svg width={dim.ring} height={dim.ring}>
          <circle
            className="priority-gauge-bg"
            cx={dim.ring / 2}
            cy={dim.ring / 2}
            r={radius}
            strokeWidth={dim.stroke}
          />
          <circle
            className="priority-gauge-fill"
            cx={dim.ring / 2}
            cy={dim.ring / 2}
            r={radius}
            strokeWidth={dim.stroke}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset !== null ? animatedOffset : circumference}
          />
        </svg>
        <div className="priority-gauge-center">
          <div className="priority-gauge-score" style={{ fontSize: dim.fontSize, color }}>
            {total}
          </div>
          <div className="priority-gauge-label" style={{ fontSize: dim.labelSize, color }}>
            {level}
          </div>
        </div>
      </div>
      
      {/* Factor Breakdown */}
      {showBreakdown && (
        <div className="priority-factors">
          {factors.map((factor, i) => {
            const Icon = factor.icon;
            const pct = Math.round((factor.value / factor.max) * 100);
            return (
              <div key={i} className="priority-factor">
                <span className="priority-factor-label">
                  <Icon size={12} style={{ marginRight: 4, verticalAlign: 'middle', color: factor.color }} />
                  {factor.label}
                </span>
                <div className="priority-factor-bar">
                  <div 
                    className="priority-factor-fill" 
                    style={{ width: `${pct}%`, background: factor.color }}
                  />
                </div>
                <span className="priority-factor-value" style={{ color: factor.color }}>
                  {factor.value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

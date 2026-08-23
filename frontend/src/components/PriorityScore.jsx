import React, { useEffect, useState, useRef } from 'react';
import { Activity, MapPin, Clock, Users, Layers, Flame } from 'lucide-react';
import { calculatePriorityScore } from '../utils/priority';

const LEVEL_COLORS = {
  Critical: '#B91C1C',
  High: '#C2410C',
  Medium: '#B45309',
  Low: '#64748B'
};

const LEVEL_BG = {
  Critical: 'rgba(185, 28, 28, 0.10)',
  High: 'rgba(194, 65, 12, 0.10)',
  Medium: 'rgba(180, 83, 9, 0.10)',
  Low: 'rgba(148, 163, 184, 0.10)'
};

const FACTOR_ICONS = {
  category: Layers,
  support: Users,
  location: MapPin,
  time: Clock,
  related: Activity
};

export default function PriorityScore({ complaint, allComplaints = [], size = 'md', showBreakdown = true }) {
  const { total, factors, level, explanations } = calculatePriorityScore(complaint, allComplaints);
  const color = LEVEL_COLORS[level] || LEVEL_COLORS.Low;
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
    const timer = setTimeout(() => setAnimatedOffset(targetOffset), 80);
    return () => clearTimeout(timer);
  }, [total, circumference, targetOffset]);

  if (size === 'sm' && !showBreakdown) {
    return (
      <span
        className="priority-compact"
        title={`Priority score ${total} / 100 (${level})`}
        style={{
          background: LEVEL_BG[level],
          color,
          border: `1px solid ${color}30`
        }}
      >
        <Flame size={11} />
        {total}
      </span>
    );
  }

  return (
    <div className="priority-gauge" ref={ref}>
      <div className="priority-gauge-ring" style={{ width: dim.ring, height: dim.ring, '--gauge-color': color }}>
        <svg width={dim.ring} height={dim.ring} aria-hidden="true">
          <circle className="priority-gauge-bg" cx={dim.ring / 2} cy={dim.ring / 2} r={radius} strokeWidth={dim.stroke} />
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

      {showBreakdown && (
        <div className="priority-factors">
          <div className="text-caption" style={{ fontWeight: 700, marginBottom: 4 }}>
            {total} / 100 · {level}
          </div>
          {factors.map((factor) => {
            const Icon = FACTOR_ICONS[factor.key] || Activity;
            const pct = Math.round((factor.value / factor.max) * 100);
            return (
              <div key={factor.key || factor.label} className="priority-factor">
                <span className="priority-factor-label">
                  <Icon size={12} style={{ marginRight: 4, verticalAlign: 'middle', color: factor.color || color }} />
                  {factor.label}
                </span>
                <div className="priority-factor-bar">
                  <div
                    className="priority-factor-fill"
                    style={{ width: `${pct}%`, background: factor.color || color }}
                  />
                </div>
                <span className="priority-factor-value" style={{ color: factor.color || color }}>
                  {factor.value}
                </span>
              </div>
            );
          })}
          {explanations?.length > 0 && (
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
              {explanations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export { calculatePriorityScore };

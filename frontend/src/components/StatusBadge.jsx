import React from 'react';
import { 
  Clock, Eye, Loader2, CheckCircle2, XCircle, 
  Flame, AlertTriangle, ArrowDown, Shield, User, ShieldAlert 
} from 'lucide-react';

const STATUS_CONFIG = {
  'Pending':      { badge: 'badge-pending',  icon: Clock,       dotColor: '#F59E0B' },
  'In Review':    { badge: 'badge-review',   icon: Eye,         dotColor: '#C084FC' },
  'In Progress':  { badge: 'badge-progress', icon: Loader2,     dotColor: '#60A5FA' },
  'Resolved':     { badge: 'badge-resolved', icon: CheckCircle2,dotColor: '#10B981' },
  'Rejected':     { badge: 'badge-rejected', icon: XCircle,     dotColor: '#EF4444' }
};

const PRIORITY_CONFIG = {
  'Critical': { badge: 'badge-critical', icon: Flame,          dotColor: '#EF4444' },
  'High':     { badge: 'badge-high',     icon: AlertTriangle,  dotColor: '#F97316' },
  'Medium':   { badge: 'badge-medium',   icon: ArrowDown,      dotColor: '#F59E0B' },
  'Low':      { badge: 'badge-low',      icon: ArrowDown,      dotColor: '#94A3B8' }
};

const ROLE_CONFIG = {
  'CITIZEN': { badge: 'badge-progress', icon: User,       dotColor: '#60A5FA' },
  'ADMIN':   { badge: 'badge-review',   icon: ShieldAlert,dotColor: '#C084FC' },
  'OFFICER': { badge: 'badge-resolved', icon: Shield,     dotColor: '#10B981' },
  'SYSTEM':  { badge: 'badge-medium',   icon: Loader2,    dotColor: '#F59E0B' }
};

/**
 * StatusBadge Component
 * Centralized badge rendering for status, priority, and role types
 * 
 * @param {'status' | 'priority' | 'role'} type - Badge type
 * @param {string} value - The status/priority/role string
 * @param {boolean} showIcon - Show icon inside badge
 * @param {boolean} showDot - Show colored dot inside badge
 * @param {'sm' | 'md'} size - Badge size
 */
export default function StatusBadge({ type = 'status', value, showIcon = false, showDot = true, size = 'md' }) {
  const configMap = type === 'priority' ? PRIORITY_CONFIG : type === 'role' ? ROLE_CONFIG : STATUS_CONFIG;
  const config = configMap[value] || { badge: 'badge-low', icon: Clock, dotColor: '#94A3B8' };
  const Icon = config.icon;
  
  const sizeStyles = size === 'sm' 
    ? { fontSize: '10px', padding: '1px 7px' } 
    : {};
  
  const displayLabel = value;
  
  return (
    <span className={`badge ${config.badge}`} style={sizeStyles}>
      {showDot && <span className="badge-dot" style={{ background: config.dotColor }} />}
      {showIcon && <Icon size={size === 'sm' ? 10 : 12} style={{ flexShrink: 0 }} />}
      {displayLabel}
    </span>
  );
}

/**
 * Helper: get status badge class (backward compatibility)
 */
export function getStatusBadgeClass(status) {
  return STATUS_CONFIG[status]?.badge || 'badge-pending';
}

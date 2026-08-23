import React from 'react';
import { FileSearch, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

/**
 * EmptyState Component
 * Reusable empty/loading/error state display
 * 
 * @param {'empty' | 'loading' | 'error'} type
 * @param {string} title
 * @param {string} message
 * @param {Function} onRetry - Callback for error retry
 * @param {React.Component} icon - Custom icon override
 */
export default function EmptyState({ type = 'empty', title, message, onRetry, icon: CustomIcon }) {
  if (type === 'loading') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}>
          <Loader2 size={28} style={{ animation: 'spin 1.2s linear infinite' }} />
        </div>
        <div className="empty-state-title">{title || 'Loading data...'}</div>
        <div className="empty-state-message">{message || 'Fetching information from municipal systems.'}</div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  
  if (type === 'error') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" style={{ borderColor: 'var(--status-critical-border)', background: 'var(--status-critical-bg)' }}>
          <AlertCircle size={28} color="var(--status-critical)" />
        </div>
        <div className="empty-state-title">{title || 'Something went wrong'}</div>
        <div className="empty-state-message">{message || 'Unable to retrieve data. Please try again.'}</div>
        {onRetry && (
          <button type="button" className="btn btn-secondary" onClick={onRetry} style={{ marginTop: 'var(--space-5)' }}>
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }
  
  // Default: empty
  const Icon = CustomIcon || FileSearch;
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <div className="empty-state-title">{title || 'No data found'}</div>
      <div className="empty-state-message">{message || 'There are no records to display at this time.'}</div>
    </div>
  );
}

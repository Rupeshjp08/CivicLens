import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CivicLens Component Exception Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '3rem 1.5rem',
            maxWidth: '600px',
            margin: '3rem auto',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <AlertTriangle size={26} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Something went wrong loading this page
          </h2>

          <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            An unexpected error occurred while rendering this component. You can reload the page or return to the main dashboard.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn btn-primary"
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <RefreshCw size={15} />
              <span>Reload Page</span>
            </button>

            <a
              href="/"
              className="btn btn-secondary"
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none'
              }}
            >
              <Home size={15} />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

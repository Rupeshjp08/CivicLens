import React from 'react';
import { Link } from 'react-router-dom';

export default function MyComplaints() {
  return (
    <div className="page-shell">
      <p className="page-kicker">My complaints</p>
      <h1>Your reports</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 640 }}>
        This is where your submitted complaints will be listed. You can still track any
        complaint ID from the public tracker.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Link to="/citizen/report" className="btn btn-primary">Report an Issue</Link>
        <Link to="/track" className="btn btn-secondary">Track a complaint ID</Link>
        <Link to="/citizen/dashboard" className="btn btn-ghost">Back to overview</Link>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <p className="page-kicker">How CivicLens works</p>
      <h1>Report it. Track it. See it resolved.</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)' }}>
        CivicLens is a public way to tell your municipality about problems in the community
        and follow what happens next.
      </p>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
        <li><strong style={{ color: 'var(--text-primary)' }}>Report an issue</strong> — choose a category, add location and evidence, and receive a complaint ID.</li>
        <li><strong style={{ color: 'var(--text-primary)' }}>Track progress</strong> — use your ID anytime to see status updates.</li>
        <li><strong style={{ color: 'var(--text-primary)' }}>Explore civic issues</strong> — see what others have reported in the community.</li>
        <li><strong style={{ color: 'var(--text-primary)' }}>Municipal follow-up</strong> — officers review, prioritize, and update the record as work proceeds.</li>
      </ol>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Link to="/citizen/report" className="btn btn-primary">Report an Issue</Link>
        <Link to="/track" className="btn btn-secondary">Track a Complaint</Link>
      </div>
    </div>
  );
}

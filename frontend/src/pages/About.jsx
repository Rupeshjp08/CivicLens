import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <p className="page-kicker">About</p>
      <h1>CivicLens</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)' }}>
        CivicLens helps residents report municipal problems — such as potholes, garbage,
        streetlights, and water issues — and helps city staff manage those reports in one place.
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        This site is a civic service. It is meant to be clear, accessible, and useful — not a
        marketing dashboard.
      </p>
      <Link to="/citizen/report" className="btn btn-primary">Report an Issue</Link>
    </div>
  );
}

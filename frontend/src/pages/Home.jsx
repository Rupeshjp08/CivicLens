import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardList,
  Gauge,
  Landmark,
  Eye,
  Layers,
  MapPin,
  ShieldCheck
} from 'lucide-react';

export default function Home() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <p className="page-kicker">Municipal reporting for residents</p>
        <h1 className="text-display">
          Civic issues reported.
          <br />
          Prioritized intelligently.
          <br />
          Resolved transparently.
        </h1>
        <p className="landing-lead">
          CivicLens gives residents a clear way to report potholes, lighting failures, sanitation
          problems and water issues — and helps municipal officers focus on what needs attention first.
        </p>
        <div className="landing-actions">
          <Link to="/citizen/report" className="btn btn-primary">
            Report an Issue
            <ArrowRight size={16} />
          </Link>
          <Link to="/track" className="btn btn-secondary">
            Track Complaint
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <h2>How CivicLens works</h2>
        <div className="landing-steps">
          {[
            { n: '01', title: 'Report', icon: ClipboardList, text: 'Describe the issue, add a location, and attach a photo when you have one.' },
            { n: '02', title: 'Smart Prioritization', icon: Gauge, text: 'The Smart Priority Engine scores urgency using category, support, time pending and location sensitivity.' },
            { n: '03', title: 'Municipal Action', icon: Landmark, text: 'Officers review the priority queue, inspect details, and update status as work proceeds.' },
            { n: '04', title: 'Transparent Resolution', icon: Eye, text: 'Use your complaint ID anytime to see status, priority, and related reports.' }
          ].map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.n} className="panel landing-card">
                <div className="landing-step-n">{step.n}</div>
                <Icon size={20} color="var(--primary)" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-section">
        <h2>Smart Priority Engine</h2>
        <p className="landing-copy">
          Not every complaint can be handled at once. CivicLens scores each report so officers can
          see which issues are most urgent — and residents can see why.
        </p>
        <ul className="landing-factors">
          {['Severity', 'Affected citizens', 'Location sensitivity', 'Time pending', 'Issue category', 'Related reports'].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="landing-section">
        <h2>Issue clusters</h2>
        <p className="landing-copy">
          When several people report the same kind of problem in the same area, CivicLens groups those
          reports. Repeated complaints are treated as one larger civic issue, not isolated tickets.
        </p>
        <div className="panel landing-cluster-note">
          <Layers size={18} color="var(--primary)" />
          <span>Related reports are grouped by category and area from the live complaint records.</span>
        </div>
      </section>

      <section className="landing-section">
        <h2>Transparent status</h2>
        <div className="landing-status-flow" aria-label="Complaint status flow">
          <span>Reported</span>
          <span className="landing-status-arrow" aria-hidden="true">→</span>
          <span>In Progress</span>
          <span className="landing-status-arrow" aria-hidden="true">→</span>
          <span>Resolved</span>
        </div>
      </section>

      <section className="landing-cta panel">
        <div>
          <h2>See an issue in your neighborhood?</h2>
          <p>Report it. You will receive a complaint ID you can track.</p>
        </div>
        <Link to="/citizen/report" className="btn btn-primary">
          Report it
          <MapPin size={16} />
        </Link>
      </section>

      <p className="landing-trust">
        <ShieldCheck size={14} aria-hidden="true" />
        Public tracking uses the complaint reference (for example CIV-3913), not internal database ids.
      </p>
    </div>
  );
}

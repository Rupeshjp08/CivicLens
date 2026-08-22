import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportComplaint from './pages/ReportComplaint';
import TrackComplaint from './pages/TrackComplaint';
import ExploreComplaints from './pages/ExploreComplaints';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import Analytics from './pages/admin/Analytics';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Citizen Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportComplaint />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/explore" element={<ExploreComplaints />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/management" element={<ComplaintManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

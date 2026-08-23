import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import CitizenLayout from './layouts/CitizenLayout';
import OfficerLayout from './layouts/OfficerLayout';

import CitizenLogin from './pages/auth/CitizenLogin';
import OfficerLogin from './pages/auth/OfficerLogin';
import RoleSelection from './pages/auth/RoleSelection';
import Register from './pages/auth/Register';

import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportComplaint from './pages/ReportComplaint';
import TrackComplaint from './pages/TrackComplaint';
import ExploreComplaints from './pages/ExploreComplaints';
import Notifications from './pages/citizen/Notifications';
import Profile from './pages/citizen/Profile';
import MyComplaints from './pages/citizen/MyComplaints';
import CitizenComplaintDetail from './pages/citizen/CitizenComplaintDetail';

import OfficerDashboard from './pages/officer/OfficerDashboard';
import Assignments from './pages/officer/Assignments';
import OfficerComplaintDetail from './pages/officer/OfficerComplaintDetail';
import FieldMap from './pages/officer/FieldMap';
import History from './pages/officer/History';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import Hotspots from './pages/admin/Hotspots';
import Analytics from './pages/admin/Analytics';

import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <ErrorBoundary>
            <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/explore" element={<ExploreComplaints />} />
              <Route path="/track" element={<TrackComplaint />} />
              <Route path="/about" element={<About />} />
              <Route path="/signin" element={<RoleSelection />} />
              <Route path="/login" element={<CitizenLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/officer/login" element={<OfficerLogin />} />
            </Route>

            <Route path="/citizen/login" element={<Navigate to="/login" replace />} />
            <Route path="/report" element={<Navigate to="/citizen/report" replace />} />

            <Route element={<CitizenLayout />}>
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/report" element={<ReportComplaint />} />
              <Route path="/citizen/track" element={<TrackComplaint />} />
              <Route path="/citizen/complaints" element={<MyComplaints />} />
              <Route path="/citizen/complaints/:id" element={<CitizenComplaintDetail />} />
              <Route path="/citizen/explore" element={<ExploreComplaints />} />
              <Route path="/citizen/notifications" element={<Notifications />} />
              <Route path="/citizen/profile" element={<Profile />} />
            </Route>

            <Route element={<OfficerLayout />}>
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/officer/queue" element={<ComplaintManagement />} />
              <Route path="/officer/complaints" element={<ComplaintManagement />} />
              <Route path="/officer/assignments" element={<Assignments />} />
              <Route path="/officer/complaints/:id" element={<OfficerComplaintDetail />} />
              <Route path="/officer/clusters" element={<Hotspots />} />
              <Route path="/officer/analytics" element={<Analytics />} />
              <Route path="/officer/map" element={<FieldMap />} />
              <Route path="/officer/history" element={<History />} />
            </Route>

            <Route path="/admin" element={<Navigate to="/officer/dashboard" replace />} />
            <Route path="/admin/login" element={<Navigate to="/officer/login" replace />} />
            <Route path="/admin/*" element={<Navigate to="/officer/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ErrorBoundary>
        </div>
      </Router>
    </AuthProvider>
  );
}

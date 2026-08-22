import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Layouts
import CitizenLayout from './layouts/CitizenLayout';
import OfficerLayout from './layouts/OfficerLayout';

// Auth Pages
import RoleSelection from './pages/auth/RoleSelection';
import CitizenLogin from './pages/auth/CitizenLogin';
import OfficerLogin from './pages/auth/OfficerLogin';

// Citizen Pages
import Home from './pages/Home';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportComplaint from './pages/ReportComplaint';
import TrackComplaint from './pages/TrackComplaint';
import ExploreComplaints from './pages/ExploreComplaints';
import Notifications from './pages/citizen/Notifications';
import Profile from './pages/citizen/Profile';

// Officer & Municipal Operations Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import Assignments from './pages/officer/Assignments';
import OfficerComplaintDetail from './pages/officer/OfficerComplaintDetail';
import FieldMap from './pages/officer/FieldMap';
import History from './pages/officer/History';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import Hotspots from './pages/admin/Hotspots';
import Analytics from './pages/admin/Analytics';
import Departments from './pages/admin/Departments';
import Officers from './pages/admin/Officers';
import SLAMonitor from './pages/admin/SLAMonitor';
import Escalations from './pages/admin/Escalations';
import Citizens from './pages/admin/Citizens';
import AuditLogs from './pages/admin/AuditLogs';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />

          <Routes>
            {/* Auth Gateways */}
            <Route path="/login" element={<RoleSelection />} />
            <Route path="/citizen/login" element={<CitizenLogin />} />
            <Route path="/officer/login" element={<OfficerLogin />} />

            {/* Citizen Portal */}
            <Route element={<CitizenLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/report" element={<ReportComplaint />} />
              <Route path="/track" element={<TrackComplaint />} />
              <Route path="/explore" element={<ExploreComplaints />} />
              <Route path="/citizen/notifications" element={<Notifications />} />
              <Route path="/citizen/profile" element={<Profile />} />
            </Route>

            {/* Officer Operations Center (Staff & Field Officers) */}
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
              <Route path="/officer/profile" element={<Profile />} />
              <Route path="/officer/departments" element={<Departments />} />
              <Route path="/officer/officers" element={<Officers />} />
              <Route path="/officer/sla" element={<SLAMonitor />} />
              <Route path="/officer/escalations" element={<Escalations />} />
              <Route path="/officer/citizens" element={<Citizens />} />
              <Route path="/officer/audit-logs" element={<AuditLogs />} />
            </Route>

            {/* Legacy Redirections to Officer Portal */}
            <Route path="/admin" element={<Navigate to="/officer/dashboard" replace />} />
            <Route path="/admin/*" element={<Navigate to="/officer/dashboard" replace />} />
            <Route path="/admin/login" element={<Navigate to="/officer/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

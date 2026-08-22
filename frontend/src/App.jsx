import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Layouts
import CitizenLayout from './layouts/CitizenLayout';
import AdminLayout from './layouts/AdminLayout';
import OfficerLayout from './layouts/OfficerLayout';

// Auth Pages
import RoleSelection from './pages/auth/RoleSelection';
import CitizenLogin from './pages/auth/CitizenLogin';
import AdminLogin from './pages/auth/AdminLogin';
import OfficerLogin from './pages/auth/OfficerLogin';

// Citizen Pages
import Home from './pages/Home';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportComplaint from './pages/ReportComplaint';
import TrackComplaint from './pages/TrackComplaint';
import ExploreComplaints from './pages/ExploreComplaints';
import Notifications from './pages/citizen/Notifications';
import Profile from './pages/citizen/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import Hotspots from './pages/admin/Hotspots';
import Analytics from './pages/admin/Analytics';
import Departments from './pages/admin/Departments';
import Officers from './pages/admin/Officers';
import SLAMonitor from './pages/admin/SLAMonitor';
import Escalations from './pages/admin/Escalations';
import Citizens from './pages/admin/Citizens';
import AuditLogs from './pages/admin/AuditLogs';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import Assignments from './pages/officer/Assignments';
import OfficerComplaintDetail from './pages/officer/OfficerComplaintDetail';
import FieldMap from './pages/officer/FieldMap';
import History from './pages/officer/History';

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
            <Route path="/admin/login" element={<AdminLogin />} />
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

            {/* Admin Operations Center */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/management" element={<ComplaintManagement />} />
              <Route path="/admin/hotspots" element={<Hotspots />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/departments" element={<Departments />} />
              <Route path="/admin/officers" element={<Officers />} />
              <Route path="/admin/sla" element={<SLAMonitor />} />
              <Route path="/admin/escalations" element={<Escalations />} />
              <Route path="/admin/citizens" element={<Citizens />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
            </Route>

            {/* Field Officer Portal */}
            <Route element={<OfficerLayout />}>
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/officer/assignments" element={<Assignments />} />
              <Route path="/officer/complaints/:id" element={<OfficerComplaintDetail />} />
              <Route path="/officer/map" element={<FieldMap />} />
              <Route path="/officer/history" element={<History />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

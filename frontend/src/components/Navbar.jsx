import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building2, 
  Home, 
  PlusCircle, 
  Search, 
  Compass, 
  ShieldAlert 
} from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <Building2 size={28} style={{ color: '#38bdf8' }} />
        <span>CivicLens</span>
      </NavLink>

      <ul className="navbar-links">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <Home size={18} />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/report" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <PlusCircle size={18} />
            <span>Report Issue</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/track" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Search size={18} />
            <span>Track Complaint</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/explore" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Compass size={18} />
            <span>Explore Issues</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}
          >
            <ShieldAlert size={18} />
            <span>Admin</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

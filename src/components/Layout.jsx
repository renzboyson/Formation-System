import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { Cross, User, CalendarPlus, ListChecks, Home as HomeIcon, Activity, School, CalendarCheck } from 'lucide-react';


export const Navbar = () => {
  const location = useLocation();
  const { currentUser } = React.useContext(AppContext);
  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  const isAdmin = currentUser?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} className="logo">
          <img src="/logo1.jpg" alt="SCA Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px' }} />
          SCA Scheduling System
        </Link>
        <ul className="nav-links">
          {isAdmin ? (
            <>
              <li>
                <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard')}`}>
                  <HomeIcon size={18} /> Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/formations" className={`nav-link ${isActive('/admin/formations')}`}>
                  <Activity size={18} /> Formations
                </Link>
              </li>
              <li>
                <Link to="/admin/units" className={`nav-link ${isActive('/admin/units')}`}>
                  <School size={18} /> Unit Accounts
                </Link>
              </li>
              <li>
                <Link to="/admin/breakdown" className={`nav-link ${isActive('/admin/breakdown')}`}>
                  <CalendarCheck size={18} /> Journey Breakdown
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/user/dashboard" className={`nav-link ${isActive('/user/dashboard')}`}>
                  <HomeIcon size={18} /> Home Dashboard
                </Link>
              </li>
              <li>
                <Link to="/user/profile" className={`nav-link ${isActive('/user/profile')}`}>
                  <User size={18} /> Profile
                </Link>
              </li>
              <li>
                <Link to="/user/formation" className={`nav-link ${isActive('/user/formation')}`}>
                  <CalendarPlus size={18} /> Formation
                </Link>
              </li>
              <li>
                <Link to="/user/activities" className={`nav-link ${isActive('/user/activities')}`}>
                  <ListChecks size={18} /> Activities
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="page-container">
        {children}
      </main>
    </div>
  );
}

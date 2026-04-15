import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { Cross, User, CalendarPlus, ListChecks, Home as HomeIcon, Activity, School, CalendarCheck, LogOut, ChevronDown } from 'lucide-react';

export const UserNavbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/user/dashboard" className="logo">
          <img src="/logo1.jpg" alt="SCA Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px' }} />
          SCA Scheduling System
        </Link>
        <ul className="nav-links">
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
        </ul>
      </div>
    </nav>
  );
};

export const AdminSidebar = () => {
  const location = useLocation();
  const [isFormationsOpen, setIsFormationsOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';
  const isFormationsActive = location.pathname.startsWith('/admin/formations');
  
  const isSubmenuActive = (queryVal) => {
    if (!location.pathname.startsWith('/admin/formations')) return false;
    if (queryVal === 'pending' && !location.search) return true;
    return location.search.includes(`tab=${queryVal}`);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link to="/admin/dashboard" className="logo">
          <img src="/logo1.jpg" alt="SCA Logo" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px' }} />
          SCA System
        </Link>
      </div>
      <nav className="admin-sidebar-nav">
        <Link to="/admin/dashboard" className={`admin-sidebar-link ${isActive('/admin/dashboard')}`}>
          <HomeIcon size={20} /> Admin Dashboard
        </Link>
        
        <div>
          <div 
            onClick={() => setIsFormationsOpen(!isFormationsOpen)}
            className={`admin-sidebar-link admin-sidebar-dropdown-toggle ${isFormationsActive ? 'active' : ''}`}
          >
            <Activity size={20} /> Formations
            <ChevronDown size={18} className={`chevron-icon ${isFormationsOpen ? 'expanded' : ''}`} />
          </div>
          <div className={`admin-submenu ${isFormationsOpen ? 'expanded' : 'collapsed'}`}>
            <Link to="/admin/formations?tab=pending" className={`admin-submenu-item ${isSubmenuActive('pending') ? 'active' : ''}`}>
              Pending Schedule
            </Link>
            <Link to="/admin/formations?tab=approved" className={`admin-submenu-item ${isSubmenuActive('approved') ? 'active' : ''}`}>
              Approved Schedule
            </Link>
          </div>
        </div>

        <Link to="/admin/units" className={`admin-sidebar-link ${isActive('/admin/units')}`}>
          <School size={20} /> Unit Accounts
        </Link>
        <Link to="/admin/breakdown" className={`admin-sidebar-link ${isActive('/admin/breakdown')}`}>
          <CalendarCheck size={20} /> Journey Breakdown
        </Link>
      </nav>
    </aside>
  );
};

export const AdminTopbar = () => {
  const { logout } = useContext(AppContext);

  return (
    <header className="admin-topbar">
      <button 
        onClick={logout}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
      >
        <LogOut size={18} /> Log Out
      </button>
    </header>
  );
};

export default function Layout({ children }) {
  const { currentUser } = useContext(AppContext);
  const isAdmin = currentUser?.role === 'admin';

  if (isAdmin) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main-wrapper">
          <AdminTopbar />
          <main className="admin-content">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <UserNavbar />
      <main className="page-container">
        {children}
      </main>
    </div>
  );
}

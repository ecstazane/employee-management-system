import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './styles/Layout.css';

const Layout = ({ children }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">EMS</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${location.pathname === '/employees' ? 'active' : ''}`}
            onClick={() => navigate('/employees')}
          >
            <span className="nav-icon">👥</span>
            <span>Employees</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout}>
            <span className="nav-icon">⚙️</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <div className="header-greeting">
            <h1>Hi, {user?.email?.split('@')[0] || 'User'}!</h1>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links">
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}
          >
            Dashboard
          </Link>
          <Link 
            to="/tasks" 
            className={location.pathname === '/tasks' ? 'nav-link active' : 'nav-link'}
          >
            Tasks
          </Link>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
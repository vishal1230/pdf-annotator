import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        PDF Annotator
      </Link>
      
      <div className="navbar-nav">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <span className="nav-link">
              Welcome, {user.email}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

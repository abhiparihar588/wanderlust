import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, PlusCircle, Compass } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Compass size={28} className="brand-icon" />
          <span>Wanderlust</span>
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link add-listing" style={{ marginRight: '1rem' }}>
                  <Compass size={18} />
                  <span>Dashboard</span>
                </Link>
              )}
              <Link to="/new" className="nav-link add-listing">
                <PlusCircle size={18} />
                <span>Add Listing</span>
              </Link>
              <button onClick={handleLogout} className="btn-danger log-out-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className="nav-link">Login</Link>
              <Link to="/auth?mode=signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FlashMaster</Link>
      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="button secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/dashboard">Toronto Connect</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/report-issue">Report Issue</Link>
        <Link to="/map">Map</Link>
      </div>
    </nav>
  );
}

export default NavBar;

import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  // Retrieve the user's role from localStorage (should be "citizen" or "city_staff")
  const userRole = localStorage.getItem('userRole');
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/dashboard">Toronto Connect</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/report-issue">Report Issue</Link>
        <Link to="/map">Map</Link>
        {/* Both citizens and city staff see My Reports */}
        {(userRole === 'citizen' || userRole === 'city_staff') && (
          <Link to="/my-reports">My Reports</Link>
        )}
        {/* Only city staff see the Staff Dashboard */}
        {userRole === 'city_staff' && (
          <Link to="/dashboard/issues">Staff Dashboard</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;


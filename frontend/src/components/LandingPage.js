import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="overlay">
        <h1 className="landing-title">Toronto Connect</h1>
        <p className="landing-subtitle">Connecting your city, one issue at a time</p>
        <div className="landing-buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

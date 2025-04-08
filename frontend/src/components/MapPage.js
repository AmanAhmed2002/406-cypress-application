import React from 'react';
import NavBar from './NavBar';
import './MapPage.css';

function MapPage() {
  return (
    <div>
      <NavBar />
      <div className="map-container">
        <iframe
          title="Toronto Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.555254150187!2d-79.38720768450314!3d43.653908979121424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d2c7f9b0fd%3A0x6a9f8c78d1241f8f!2sToronto%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sus!4v1683031234567"
          width="100%"
          height="600"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default MapPage;


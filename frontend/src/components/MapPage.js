import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

function MapPage() {
  const [issues, setIssues] = useState([]); // State to store fetched issues

  useEffect(() => {
    // Fetch the issues from the backend
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/issues');  // Adjust this URL if needed
        const data = await response.json();
        
        if (response.ok) {
          setIssues(data);  // Set the issues in the state
        } else {
          console.error('Error fetching issues:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching data from backend:', error);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div>
      <h1>Map of Issues in Toronto</h1>
      <MapContainer center={[43.7, -79.42]} zoom={12} style={{ height: "600px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Loop over the issues and add markers */}
        {issues.map((issue) => {
          const { id, latitude, longitude, issue_type, description } = issue;
          
          // Set up a custom icon for the markers (optional)
          const markerIcon = new L.Icon({
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Green_dot.svg', // Change this icon URL as needed
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
          });

          return (
            <Marker
              key={id}
              position={[latitude, longitude]}
              icon={markerIcon}  // Use the custom marker icon
            >
              <Popup>
                <strong>Issue Type:</strong> {issue_type} <br />
                <strong>Description:</strong> {description}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapPage;

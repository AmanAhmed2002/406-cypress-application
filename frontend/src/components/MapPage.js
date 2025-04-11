import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

function MapPage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/issues`);
        const data = await response.json();

        if (response.ok) {
          setIssues(data);
        } else {
          throw new Error('Response not OK');
        }
      } catch (error) {
        console.error('Backend fetch failed. Using dummy marker instead:', error);

        const dummyData = [
          {
            id: 1,
            latitude: 43.6532,
            longitude: -79.3832,
            issue_type: "Pothole",
            description: "Pothole in downtown Toronto!",
            status: "in progress"
          },
          {
          
            id: 2,
            latitude: 43.6561,
            longitude: -79.3802,
            issue_type: "Streetlight Outage",
            description: "streetlight is out of service, be careful!",
            status: "submitted"
          }
        ];

        setIssues(dummyData);
      }
    };

    fetchIssues();
  }, []);

  const getMarkerColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      case 'in progress':
        return 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
      case 'completed':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    }
  };

  return (
    <div>
      <h1>Map of Issues in Toronto</h1>
      <MapContainer center={[43.7, -79.42]} zoom={12} style={{ height: "600px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {issues.map((issue) => {
          const { id, latitude, longitude, issue_type, description, status } = issue;

          if (latitude == null || longitude == null) return null;

          const markerIcon = new L.Icon({
            iconUrl: getMarkerColor(status),
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          return (
            <Marker
              key={id}
              position={[latitude, longitude]}
              icon={markerIcon}
            >
              <Popup>
                <strong>Issue Type:</strong> {issue_type} <br />
                <strong>Description:</strong> {description} <br />
                <strong>Status:</strong> {status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapPage;

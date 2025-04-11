import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import NavBar from './NavBar';
import './ReportIssue.css';

function ReportIssue() {
  const [form, setForm] = useState({
    issue_type: 'Pothole',
    other_issue: '',
    description: '',
    address: '', // This field is auto-filled and editable
    imageFile: null,
  });
  const [autoLatitude, setAutoLatitude] = useState(null);
  const [autoLongitude, setAutoLongitude] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Auto-detect geolocation and perform reverse geocoding
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setAutoLatitude(lat);
          setAutoLongitude(lon);
          // Reverse geocode to get a rough address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(data => {
              if (data && data.display_name && !form.address) {
                setForm((prev) => ({ ...prev, address: data.display_name }));
              }
            })
            .catch(err => {
              console.error("Reverse geocoding error:", err);
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // onBlur handler to auto-complete address based on user input
  const handleAddressBlur = async () => {
    if (form.address) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(form.address + ', Toronto, Ontario')}`
        );
        const results = await response.json();
        if (results && results.length > 0) {
          const fullAddress = results[0].display_name;
          setForm((prev) => ({ ...prev, address: fullAddress }));
        }
      } catch (err) {
        console.error("Geocoding search error:", err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setForm((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = form.address;
    if (!form.description || !form.imageFile) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setUploading(true);
    try {
      // Upload the image to Supabase Storage (bucket: issue-images)
      const fileExt = form.imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('issue-images')
        .upload(filePath, form.imageFile);
      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from('issue-images')
        .getPublicUrl(filePath);
      
      const issueType = form.issue_type === 'Other' ? form.other_issue : form.issue_type;
      const user_id = localStorage.getItem('user_id');
      if (!user_id) {
        throw new Error('User not logged in.');
      }

      const payload = {
        user_id,
        issue_type: issueType,
        description: form.description,
        image_url: publicUrl,
        address,
        latitude: autoLatitude,
        longitude: autoLongitude,
        status: 'submitted',
      };

      console.log("Submitting issue payload:", payload);
      
      const response = await axios.post('http://localhost:5000/api/issues', payload);
      setMessage(`Issue submitted successfully! Your issue id is ${response.data.issue_id}`);
      
      // Optionally reset the form here
      setForm({
        issue_type: 'Pothole',
        other_issue: '',
        description: '',
        address: '',
        imageFile: null,
      });
    } catch (error) {
      console.error("Error submitting issue:", error);
      setMessage(error.message || 'Submission failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="report-issue-container">
        <h2>Submit Issue Report</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Issue Type:
            <select name="issue_type" value={form.issue_type} onChange={handleChange}>
              <option value="Pothole">Pothole</option>
              <option value="Streetlight Outage">Streetlight Outage</option>
              <option value="Graffiti">Graffiti</option>
              <option value="Other">Other</option>
            </select>
          </label>
          {form.issue_type === 'Other' && (
            <input
              type="text"
              name="other_issue"
              placeholder="Describe issue type"
              value={form.other_issue}
              onChange={handleChange}
            />
          )}
          <br />
          <label>
            Description:
            <textarea
              name="description"
              placeholder="Describe the issue"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Location (auto-detected, editable):
            <input
              type="text"
              name="address"
              placeholder="Enter address manually if needed"
              value={form.address}
              onChange={handleChange}
              onBlur={handleAddressBlur}
            />
          </label>
          <br />
          <label>
            Image:
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              capture="environment"
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Submitting...' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;
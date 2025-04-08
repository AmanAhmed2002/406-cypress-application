import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
//import './MyReports.css';

function MyReports() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/issues/mine');
        if (response.data.message) {
          setIssues([]);
        } else {
          setIssues(response.data);
        }
      } catch (err) {
        setError('Error fetching your reports.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="myreports-content">
        <h2>My Reports</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : issues.length === 0 ? (
          <p>No reports found</p>
        ) : (
          <ul>
            {issues.map(issue => (
              <li key={issue.id}>
                <p><strong>Type:</strong> {issue.issue_type}</p>
                <p><strong>Description:</strong> {issue.description}</p>
                <p><strong>Status:</strong> {issue.status}</p>
                <p><strong>Submitted At:</strong> {new Date(issue.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyReports;


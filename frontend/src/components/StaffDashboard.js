import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
//import './StaffDashboard.css';

function StaffDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchIssues = async () => {
    try {
      let url = 'http://localhost:5000/api/issues/dashboard';
      const params = {};
      if (departmentFilter) params.department = departmentFilter;
      if (statusFilter) params.status = statusFilter;
      const response = await axios.get(url, { params });
      setIssues(response.data);
    } catch (err) {
      setError('Error fetching issues.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [departmentFilter, statusFilter]);

  const handleUpdate = async (issueId, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${issueId}`, updatedData);
      fetchIssues();
    } catch (err) {
      console.error('Error updating issue:', err);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="staff-dashboard-content">
        <h2>City Staff Dashboard</h2>
        <div>
          <label>
            Department Filter:
            <input 
              type="text" 
              value={departmentFilter} 
              onChange={e => setDepartmentFilter(e.target.value)} 
              placeholder="Enter department" 
            />
          </label>
          <label>
            Status Filter:
            <input 
              type="text" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)} 
              placeholder="Enter status" 
            />
          </label>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : issues.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Issue Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Feedback</th>
                <th>Assigned Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id}>
                  <td>{issue.issue_type}</td>
                  <td>{issue.description}</td>
                  <td>
                    <input
                      type="text"
                      defaultValue={issue.status}
                      onBlur={e =>
                        handleUpdate(issue.id, { status: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={issue.feedback || ''}
                      onBlur={e =>
                        handleUpdate(issue.id, { feedback: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={issue.assigned_staff || ''}
                      onBlur={e =>
                        handleUpdate(issue.id, { assigned_staff: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => fetchIssues()}>Refresh</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StaffDashboard;


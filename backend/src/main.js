require('dotenv').config();  // Load .env variables

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Custom middleware (logging)
const logRequests = require('./middleware/logger');
app.use(logRequests);

// Import routes
const authRoutes = require('./routes/auth');
const issuesRoutes = require('./routes/issues');

app.use('/api', authRoutes);
app.use('/api/issues', issuesRoutes);

// Additional endpoints from issuesController for new ticket features
const issuesController = require('./controllers/issues/issuesController');

// GET /api/issues/mine - Retrieves issues for the logged-in citizen
app.get('/api/issues/mine', issuesController.getMyReports);

// PUT /api/issues/:id - Allows city staff to update an issue (status, feedback, assigned_staff)
app.put('/api/issues/:id', issuesController.updateIssue);

// GET /api/issues/dashboard - City staff dashboard to view/filter issues
app.get('/api/issues/dashboard', issuesController.getIssues);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});


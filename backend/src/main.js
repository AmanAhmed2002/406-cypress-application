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

// (Remove any unused routes if necessary)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

require('dotenv').config();                     // Load .env variables into process.env

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware setup
app.use(cors());                                // Enable CORS for all origins (development convenience)
app.use(express.json());                        // Parse JSON request bodies

// Example of custom middleware (logging)
const logRequests = require('./middleware/logger');
app.use(logRequests);                           // Log each request (defined in middleware/logger.js)

// NEW: Import authentication routes
const authRoutes = require('./routes/auth');

// NEW: Mount authentication routes so that endpoints like /api/register and /api/login are available
app.use('/api', authRoutes);

// Since there is no userController.js, remove or comment out the following line if not used:
// app.get('/api/users', userController.getUsers);  // Example route: GET /api/users

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

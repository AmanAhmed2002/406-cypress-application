// backend/src/main.js
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

// Import controllers
const userController = require('./controllers/userController');

// Routes setup (connecting routes to controller methods)
app.get('/api/users', userController.getUsers);  // Example route: GET /api/users

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

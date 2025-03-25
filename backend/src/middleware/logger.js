// backend/src/middleware/logger.js
function logRequests(req, res, next) {
  console.log(`${req.method} ${req.path}`);  // e.g., "GET /api/users"
  next();  // Proceed to the next middleware or route handler
}
module.exports = logRequests;

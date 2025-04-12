Full-Stack App (Express & React)
=================================

This repository contains a full-stack JavaScript application using a Node.js/Express backend and a React
frontend (bootstrapped with Create React App). The project is structured as a monorepo with two main folders:
backend and frontend. It includes environment variable support via .env files and integrates Supabase as the
database service in the backend.

Table of Contents
-----------------
1. Project Structure
2. Prerequisites
3. Setup Instructions
   - Clone and Install Root Dependencies
   - Backend Setup
   - Frontend Setup
4. Running the Application
5. Production Build
6. Dependencies
7. Additional Notes

1. Project Structure
--------------------
your-project/
├── backend/
│   ├── package.json            # Backend dependencies & scripts
│   ├── .env                    # Backend environment variables
│   └── src/
│       ├── controllers/        # Express route controllers
│       ├── services/           # Business logic and Supabase integration
│       ├── middleware/         # Custom middleware (e.g., logging)
│       ├── utils/              # Utility/helper modules
│       └── main.js             # Entry point for the Express server
├── frontend/
│   ├── package.json            # React app dependencies & scripts (Create React App)
│   ├── .env                    # Frontend environment variables
│   ├── public/                 # Public assets (index.html, etc.)
│   └── src/
│       ├── components/         # React components
│       ├── App.js              # Main React component
│       └── index.js            # React entry point
├── package.json                # Root package.json (for concurrently running both apps)
└── README.txt                  # This file

2. Prerequisites
----------------
- Node.js (v14 or higher is recommended)
- npm (comes with Node.js)
- A Supabase account and project (to get your Supabase URL and API key)

3. Setup Instructions
---------------------
A. Clone and Install Root Dependencies
   1. Clone the repository:
      
      git clone <repo-url>
      cd your-project

   2. Install root-level dependencies:
      
      npm install

B. Backend Setup
   1. Navigate to the backend folder and install dependencies:
      
      cd backend
      npm install

C. Frontend Setup
   1. Navigate to the frontend folder and install dependencies:
      
      cd ../frontend
      npm install

   2. Install necessary dependencies:

      cd frontend
      
      npm install react-router-dom

      npm install axios

4. Running the Application
--------------------------
A. Run Both Backend and Frontend Together

   From the root directory, run:
      
      npm run serve

   This command uses concurrently to run:
   - Backend: Runs the development server (with nodemon) via npm run dev in the backend folder.
   - Frontend: Runs the Create React App development server via npm start in the frontend folder.

B. Run Separately

   To run each service individually:
   - Backend only:
      
         cd backend
         npm run dev

   - Frontend only:
      
         cd frontend
         npm start

5. Production Build
-------------------
A. Building the Frontend

   To create a production-ready build of the React app, run:
      
      cd frontend
      npm run build

B. Serving the Frontend with the Backend

   In production, you can serve the React app from the Express backend.
   In your backend/src/main.js, add these lines (after your API routes) to serve static files
   from the React build:

         const path = require('path');

         // Serve static files from the React app
         app.use(express.static(path.join(__dirname, '../frontend/build')));

         // Fallback to React's index.html for any unknown routes
         app.get('*', (req, res) => {
           res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
         });

   This will allow your Express server to serve both your API and your frontend from a single process.

6. Dependencies
---------------
Backend Dependencies:
- express: Web framework for Node.js
- dotenv: Loads environment variables from .env
- cors: Enables Cross-Origin Resource Sharing
- @supabase/supabase-js: Supabase client for database interaction
- nodemon: (Dev dependency) Automatically restarts the server on file changes

Frontend Dependencies:
- react: JavaScript library for building user interfaces (via Create React App)
- (Other dependencies are managed by Create React App)

Root Dependencies:
- concurrently: (Dev dependency) Runs multiple commands concurrently

7. Additional Notes
-------------------
- Environment Variables:
  Make sure to create a .env file in both the backend and frontend folders.
  These files should NOT be committed to version control.

- Troubleshooting:
  If you encounter issues, verify that you have run "npm install" in all directories
  and that your .env files are correctly set up.

Happy coding!


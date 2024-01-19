/**
 * Main entry point for the backend server.
 * @module backend/index
 * @requires express
 * @requires backend/wordPairs
 * @requires backend/dbFunctions
 * @requires cors
 * @requires dotenv
 */
require("dotenv").config();
const express = require("express");
const wordPairRouter = require("./wordPairs");
const db = require("./dbFunctions");
const cors = require("cors");
const port = 8080;
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

app.use(express.static("./frontend/dist"));

// Add middleware to parse incoming JSON request bodies
app.use(express.json());

// Use the wordPairRouter for handling requests starting with "/api/word-pairs"
app.use("/api/word-pairs", wordPairRouter);

// Admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Authentication endpoint.
 * @function
 * @name POST /api/auth
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Response object indicating success or failure
 */
app.post("/api/auth", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

let server = undefined;

/**
 * Start the server and listen on the specified port.
 * @name Server Start
 * @function
 * @param {number} port - The port on which the server will listen.
 * @returns {undefined}
 */
server = app
  .listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
  .on("error", (err) => {
    // Handle errors that occur when starting the server
    console.error("Error starting server:", err);
    process.exit(1);
  });

/**
 * Graceful shutdown function to be called on termination signals (SIGTERM, SIGINT).
 * @function
 * @name gracefulShutdown
 * @returns {undefined}
 */
const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");

  // If the server is running, close it
  if (server) {
    server.close((err) => {
      if (err) {
        // Handle errors that occur when closing the server
        console.log("Error closing server", err);
        process.exit(1);
      } else {
        console.log("Server closed. Goodbye!");

        // Gracefully close the MySQL connection
        console.log("MYSQL: Starting graceful shutdown...");
        db.connectionPool.end((err) => {
          if (err) {
            // Handle errors that occur when closing the MySQL connection
            console.log("Error closing MySQL connection", err);
            process.exit(1);
          } else {
            console.log("MySQL connection closed");
            console.log("Application: shutdown complete");
            process.exit(0);
          }
        });
      }
    });
  }
};

// Handle termination signals for graceful shutdown
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

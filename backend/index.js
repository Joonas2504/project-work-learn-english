const express = require("express");
const wordPairRouter = require("./wordPairs");
const db = require("./dbFunctions");
const cors = require("cors");
const port = 8080;
const app = express();

app.use(cors());

// app.use(express.static("./frontend/dist"));
// Add the body-parsing middleware to parse JSON request bodies
app.use(express.json());

app.use("/api/word-pairs", wordPairRouter);

let server = undefined;

server = app
  .listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });

const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");
  if (server) {
    server.close((err) => {
      if (err) {
        console.log("Error closing server", err);
        process.exit(1);
      } else {
        console.log("Server closed. Goodbye!");

        console.log("MYSQL: Starting graceful shutdown...");
        db.connectionPool.end((err) => {
          if (err) {
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

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

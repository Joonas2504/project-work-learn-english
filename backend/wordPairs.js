/**
 * Express Router for handling word pair endpoints.
 * @module backend/wordPairs
 * @requires express
 * @requires backend/dbFunctions
 */

// Importing necessary modules and functions
const express = require("express");
const db = require("./dbFunctions");

/**
 * Instance of an Express Router to handle word pair endpoints
 * @type {express.Router}
 */
const pairRouter = express.Router();

/**
 * Endpoint to retrieve all word pairs.
 * @name GET /api/word-pairs
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {undefined}
 */
pairRouter.get("/", async (req, res) => {
  try {
    // Fetching all word pairs from the database
    const wordPairs = await db.getAll();

    // Sending the retrieved word pairs as a JSON response
    res.json(wordPairs);
  } catch (err) {
    // Handling errors and sending an appropriate status code with error details
    console.error(err);
    res.status(500).json(err).end();
  }
});

/**
 * Endpoint to retrieve a word pair by ID.
 * @name GET /api/word-pairs/:myId
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {undefined}
 */
pairRouter.get("/:myId([0-9]+)", async (req, res) => {
  // Extracting the ID from the request parameters
  const id = parseInt(req.params.myId);
  try {
    // Fetching the word pair from the database by ID
    const wordPair = await db.getByID(id);
    // Sending the retrieved word pair as a JSON response
    res.json(wordPair);
  } catch (err) {
    // Handling errors and sending an appropriate status code with error details
    console.error(err);
    res.status(500).json(err).end();
  }
});

/**
 * Endpoint to add a new word pair.
 * @name POST /api/word-pairs
 * @function
 * @async
 * @param {Object} req - Express request object with the new word pair data in the body.
 * @param {Object} res - Express response object.
 * @returns {undefined}
 */
pairRouter.post("/", async (req, res) => {
  try {
    // Saving the new word pair to the database
    const newPair = await db.save(req.body);

    // Sending the newly created word pair as a JSON response with a status code of 201 (Created)
    res.status(201).json(newPair);
  } catch (err) {
    // Handling errors and sending an appropriate status code with error details
    console.error(err);
    res.status(400).json(err).end();
  }
});

/**
 * Endpoint to delete a word pair by ID.
 * @name DELETE /api/word-pairs/:myId
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {undefined}
 */
pairRouter.delete("/:myId([0-9]+)", async (req, res) => {
  // Extracting the ID from the request parameters
  const id = parseInt(req.params.myId);

  try {
    // Deleting the word pair from the database by ID
    await db.delete(id);

    // Sending a success status code of 204 (No Content)
    res.status(204).end();
  } catch (err) {
    // Handling errors and sending an appropriate status code with error details
    console.error(err);
    res.status(404).json(err).end();
  }
});

/**
 * Endpoint to update a word pair by ID.
 * @name PUT /api/word-pairs/:myId
 * @function
 * @async
 * @param {Object} req - Express request object with the updated word pair data in the body.
 * @param {Object} res - Express response object.
 * @returns {undefined}
 */
pairRouter.put("/:myId([0-9]+)", async (req, res) => {
  // Extracting the ID and updated pair data from the request parameters and body
  const id = parseInt(req.params.myId);
  const updatedPair = req.body;

  try {
    // Updating the word pair in the database by ID
    await db.update(id, updatedPair);

    // Sending a success status code of 204 (No Content)
    res.status(204).end();
  } catch (err) {
    // Handling errors and sending an appropriate status code with error details
    console.error(err);
    res.status(404).json(err).end();
  }
});

/**
 * Exporting the router for use in other modules.
 * @type {express.Router}
 */
module.exports = pairRouter;

// Load environment variables from a .env file
require("dotenv").config();
const mysql = require("mysql");
const { validateWordPair, validateId } = require("./validation");

// Create a connection pool for MySQL database
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Export the database functions
module.exports = {
  connectionPool: pool,

  // Retrieve all word pairs from the database
  getAll: () => {
    return new Promise((resolve, reject) => {
      // SQL query to select all rows from the 'word_pairs' table
      const query = "SELECT * FROM word_pairs";

      // Execute the query using the database connection pool
      pool.query(query, (err, results) => {
        // If an error occurs during the query execution
        err
          ? reject({ error: "Error retrieving word pairs", details: err })
          : // If the query is successful, resolve with the retrieved results
            resolve(results);
      });
    });
  },

  // Retrieve a word pair from the database by ID
  getByID: (id) => {
    return new Promise((resolve, reject) => {
      // Validate the ID against the predefined schema
      const validationResults = validateId(id);

      // If the validation fails, reject the promise with details of the error
      if (!validationResults.valid) {
        reject({ error: "Invalid ID", details: validationResults.errors });
        return;
      }

      // SQL query to select a word pair from the 'word_pairs' table by ID
      const query = "SELECT * FROM word_pairs WHERE id = ?";

      pool.query(query, [id], (err, result) => {
        // If exactly one word pair is found, resolve the Promise with the word pair data
        result.length === 1
          ? resolve(result[0])
          : // If no or multiple word pairs are found, reject the Promise with an error object
            reject({
              error: `Error finding word pair by ID = ${id}`,
              details: err,
            });
      });
    });
  },

  // Save a new word pair to the database
  save: (wordPair) => {
    return new Promise((resolve, reject) => {
      // Validate the word pair against the predefined schema
      const validationResults = validateWordPair(wordPair);

      // If the validation fails, reject the promise with details of the error
      if (!validationResults.valid) {
        reject({
          error: "Invalid word pair",
          details: validationResults.errors,
        });
        return;
      }

      // SQL query to check if the word pair already exists
      const checkQuery =
        "SELECT * FROM word_pairs WHERE finnish_word = ? OR english_word = ?";

      pool.query(
        checkQuery,
        [wordPair.finnish_word, wordPair.english_word],
        (err, result) => {
          // If the word pair exists, reject the promise with an error
          if (result.length > 0) {
            reject({ error: "Word pair already exists" });
            return;
          }

          // SQL query to insert a new word pair into the 'word_pairs' table
          const insertQuery = "INSERT INTO word_pairs SET ?";

          pool.query(insertQuery, [wordPair], (err, results) => {
            // If an error occurs during the query execution
            err
              ? reject({ error: "Error inserting new word pair", details: err })
              : // If the query is successful, resolve with the results
                (wordPair.id = results.insertId);
            resolve(wordPair);
          });
        }
      );
    });
  },

  // Delete a word pair from the database by ID
  delete: (id) => {
    return new Promise((resolve, reject) => {
      // Validate the ID against the predefined schema
      const validationResults = validateId(id);

      // If the validation fails, reject the promise with details of the error
      if (!validationResults.valid) {
        reject({ error: "Invalid ID", details: validationResults.errors });
        return;
      }

      // SQL query to delete a word pair from the 'word_pairs' table by ID
      const query = "DELETE FROM word_pairs WHERE id = ?";

      // Execute the query using the database connection pool
      pool.query(query, [id], (err, result) => {
        // If the affected rows are zero, reject with a 'not found' error
        result.affectedRows === 0
          ? reject({
              error: `No word pair found with ID = ${id}`,
              details: err,
            })
          : // If the query is successful, resolve the promise
            resolve();
      });
    });
  },

  // Update a word pair in the database
  update: (id, wordPair) => {
    return new Promise((resolve, reject) => {
      // Validate the word pair against the predefined schema
      const validationResults = validateWordPair(wordPair);

      // If the validation fails, reject the promise with details of the error
      if (!validationResults.valid) {
        reject({
          error: "Invalid word pair",
          details: validationResults.errors,
        });
        return;
      }

      // SQL query to check if the word pair already exists
      const checkQuery =
        "SELECT * FROM word_pairs WHERE finnish_word = ? OR english_word = ? AND id != ?";

      pool.query(
        checkQuery,
        [wordPair.finnish_word, wordPair.english_word, id],
        (err, result) => {
          // If the word pair exists, reject the promise with an error
          if (result.length > 0) {
            reject({ error: "Word pair already exists" });
            return;
          }

          // SQL query to update the word pair in the 'word_pairs' table
          const updateQuery = "UPDATE word_pairs SET ? WHERE id = ?";

          pool.query(updateQuery, [wordPair, id], (err, result) => {
            // If an error occurs, reject the promise with details of the error
            if (err) {
              reject({ error: "Error updating word pair", details: err });
              return;
            }

            // If the word pair is successfully updated, resolve the promise
            resolve(result);
          });
        }
      );
    });
  },
};

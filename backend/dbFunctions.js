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

  // Save a new word pair to the database
  save: (newPair) => {
    return new Promise((resolve, reject) => {
      // Validate the new word pair against the predefined schema
      const validationResults = validateWordPair(newPair);

      // If the validation fails, reject the promise with details of the error
      if (!validationResults.valid) {
        reject({
          error: "Invalid word pair",
          details: validationResults.errors,
        });
        return;
      }

      // SQL query to insert a new word pair into the 'word_pairs' table
      const query =
        "INSERT INTO word_pairs (finnish_word, english_word) VALUES (?, ?)";

      // Execute the query using the database connection pool
      pool.query(
        query,
        [newPair.finnish_word, newPair.english_word],
        (err, results) => {
          // If an error occurs during the query execution
          err
            ? reject({ error: "Error inserting new word pair", details: err })
            : // If the query is successful, resolve with the results
              (newPair.id = results.insertId);
          resolve(newPair);
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

  // Update a word pair in the database by ID
  update: (id, updatedPair) => {
    return new Promise((resolve, reject) => {
      // Validate the ID and updated word pair against predefined schemas
      const isIdValid = validateId(id);
      const isPairValid = validateWordPair(updatedPair);

      // If either the ID or word pair is invalid, reject with details of the errors
      if (!isIdValid.valid || !isPairValid.valid) {
        reject({
          error: "Invalid ID and word pair",
          details: {
            idErrors: isIdValid.errors,
            pairErrors: isPairValid.errors,
          },
        });
        return;
      }

      // SQL query to update a word pair in the 'word_pairs' table by ID
      const query =
        "UPDATE word_pairs SET finnish_word = ?, english_word = ? WHERE id = ?";

      // Execute the query using the database connection pool
      pool.query(
        query,
        [updatedPair.finnish_word, updatedPair.english_word, id],
        (err, results) => {
          // If the affected rows are zero, reject with a 'not found' error
          results.affectedRows === 0
            ? reject({
                error: `No word pair found with ID = ${id}`,
                details: err,
              })
            : // If the query is successful, resolve with the results
              resolve(results);
        }
      );
    });
  },
};

require("dotenv").config();
const mysql = require("mysql");
//const { Validator } = require("jsonschema");
//const validator = new Validator();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

module.exports = {
  connectionPool: pool,

  getAll: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM word_pairs";
      pool.query(query, (err, results) => {
        err
          ? reject({ error: "Error finding locations", details: err })
          : resolve(results);
      });
    });
  },

  save: (newPair) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO word_pairs (finnish_word, english_word) VALUES (?, ?)";
      pool.query(
        query,
        [newPair.finnish_word, newPair.english_word],
        (err, results) => {
          err
            ? reject({ error: "Error inserting location", details: err })
            : resolve(results);
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM word_pairs WHERE id = ?";
      pool.query(query, [id], (err, results) => {
        err
          ? reject({ error: "Error deleting location", details: err })
          : resolve(results);
      });
    });
  },

  update: (id, updatedPair) => {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE word_pairs SET finnish_word = ?, english_word = ? WHERE id = ?";
      pool.query(
        query,
        [updatedPair.finnish_word, updatedPair.english_word, id],
        (err, results) => {
          err
            ? reject({ error: "Error updating word pair", details: err })
            : resolve(results);
        }
      );
    });
  },
};

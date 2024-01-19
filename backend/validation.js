/**
 * JSON schema for validating a word pair.
 * @typedef {Object} WordPairSchema
 * @property {string} finnish_word - The Finnish word in the word pair.
 * @property {string} english_word - The English word in the word pair.
 */

/**
 * JSON schema for validating an ID.
 * @typedef {Object} IdSchema
 * @property {number} - The ID to be validated.
 */

const { Validator } = require("jsonschema");
const validator = new Validator();

/**
 * JSON schema for validating a word pair
 * @type {WordPairSchema}
 */
const wordPairSchema = {
  type: "object",
  properties: {
    finnish_word: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      pattern: "^[a-zA-ZäöåÄÖÅ&\\s-]+$",
    },
    english_word: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      pattern: "^[a-zA-ZäöåÄÖÅ&\\s-]+$",
    },
  },
  required: ["finnish_word", "english_word"],
};

/**
 * JSON schema for validating an ID.
 * @type {IdSchema}
 */
const idSchema = {
  type: "integer",
  minimum: 1,
};

/**
 * Function to validate a word pair against the schema.
 * @param {WordPairSchema} wordPair - The word pair to be validated.
 * @returns {Object} Validation result object.
 * @property {boolean} valid - Whether the word pair is valid.
 * @property {Array} errors - Validation errors, if any.
 */
const validateWordPair = (wordPair) => {
  const result = validator.validate(wordPair, wordPairSchema);
  return {
    valid: result.valid,
    errors: result.errors || [], // Store validation errors if any
  };
};

/**
 * Function to validate an ID against the schema.
 * @param {number} id - The ID to be validated.
 * @returns {Object} Validation result object.
 * @property {boolean} valid - Whether the ID is valid.
 * @property {Array} errors - Validation errors, if any.
 */
const validateId = (id) => {
  const result = validator.validate(id, idSchema);
  return {
    valid: result.valid,
    errors: result.errors || [], // Store validation errors if any
  };
};

/**
 * Validation module exports.
 * @module validation
 * @property {function} validateWordPair - Function to validate a word pair against the schema.
 * @property {function} validateId - Function to validate an ID against the schema.
 */
module.exports = {
  validateWordPair,
  validateId,
};

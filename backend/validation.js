const { Validator } = require("jsonschema");
const validator = new Validator();

// Define JSON schemas for validation
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

const idSchema = {
  type: "integer",
  minimum: 1,
};

// Function to validate a word pair against the schema
const validateWordPair = (wordPair) => {
  const result = validator.validate(wordPair, wordPairSchema);
  return {
    valid: result.valid,
    errors: result.errors || [], // Store validation errors if any
  };
};

// Function to validate an ID against the schema
const validateId = (id) => {
  const result = validator.validate(id, idSchema);
  return {
    valid: result.valid,
    errors: result.errors || [], // Store validation errors if any
  };
};

module.exports = {
  validateWordPair,
  validateId,
};

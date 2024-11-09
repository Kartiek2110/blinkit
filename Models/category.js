// Import necessary modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

// Create Mongoose model for Category
const Category = mongoose.model('Category', categorySchema);

// Joi Validation function for Category data
function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(category);
}

// Export the model and validation function
module.exports = {
  Category,
  validateCategory,
};

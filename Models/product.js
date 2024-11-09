// Import necessary modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100, // Adjust the length as needed
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensuring the price cannot be negative
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: true, // Ensuring stock is always provided
  },
  description: {
    type: String,
    required: true,
    // Adjust the length as needed
  },
  image: {
    type: Buffer,
    required: true,
  },
});

// Create Mongoose model for Product
const Product = mongoose.model('Product', productSchema);

// Joi Validation function for Product data
function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    stock: Joi.string().required(), // Ensuring stock is always provided
    description: Joi.string().required(),
    image: Joi.binary().required(), // Validates that image is a valid binary data
  });

  return schema.validate(product);
}

// Export the model and validation function
module.exports = {
  Product,
  validateProduct,
};

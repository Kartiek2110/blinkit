// Import necessary modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose Cart Schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Create Mongoose model for Cart
const Cart = mongoose.model('Cart', cartSchema);

// Joi Validation function for Cart data
function validateCart(cart) {
  const schema = Joi.object({
    user: Joi.string().required(),
    products: Joi.array().items(Joi.string().required()).min(1).required(),
    totalPrice: Joi.number().min(0).required(),
  });

  return schema.validate(cart);
}

// Export the model and validation function
module.exports = {
  Cart,
  validateCart,
};

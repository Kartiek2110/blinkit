// Import necessary modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose Order Schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  
  },
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
  address: {
    type: String,
   
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending','processing', 'shipped', 'delivered', 'cancelled'], // Example status options
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: true,
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "delivery",
   
  },
});

// Create Mongoose model for Order
const Order = mongoose.model('Order', orderSchema);

// Joi Validation function for Order data
function validateOrder(order) {
  const schema = Joi.object({
    user: Joi.string().required(),
    products: Joi.array().items(Joi.string().required()).min(1).required(),
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().required(),
    status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').required(),
    payment: Joi.string().required(),
    delivery: Joi.string().required(),
  });

  return schema.validate(order);
}

// Export the model and validation function
module.exports = {
  Order,
  validateOrder,
};

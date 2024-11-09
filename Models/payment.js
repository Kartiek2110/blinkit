// Import necessary modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose Payment Schema
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
}, { timestamps: true });


// Create Mongoose model for Payment
const Payment = mongoose.model('Payment', paymentSchema);

// Joi Validation function for Payment data
// Export the model and validation function
module.exports = {
  Payment,
  
};

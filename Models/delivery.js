// Import necessary modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose Delivery Schema
const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true, // Assuming that an order is required for delivery
  },
  deliverBoy: {
    type: String,
    required: true, // Assuming a deliver boy name is required
  },
  status: {
    type: String,
    default: 'pending', // Default status
    enum: ['pending', 'in transit', 'delivered', 'failed'], // Example status options
  },
  trackingURL: {
    type: String,
    required: true, // Assuming the tracking URL is required
  },
  estimatedDeliveryTime: {
    type: Number,
    required: true,
  },
});

// Create Mongoose model for Delivery
const Delivery = mongoose.model('Delivery', deliverySchema);

// Joi Validation function for Delivery data
function validateDelivery(delivery) {
  const schema = Joi.object({
    order: Joi.string().required(),
    deliverBoy: Joi.string().min(3).max(50).required(),
    status: Joi.string().valid('pending', 'in transit', 'delivered', 'failed').required(),
    trackingURL: Joi.string().uri().required(), // Validates the URL format
    estimatedDeliveryTime: Joi.number().min(0).required(), // Ensures it is a non-negative number
  });

  return schema.validate(delivery);
}

// Export the model and validation function
module.exports = {
  delivery: mongoose.model('Delivery', deliverySchema),
  validateDelivery,
};

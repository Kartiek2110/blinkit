// Import necessary modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose Admin Schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin'], // Example role options
  },
});

// Create Mongoose model for Admin
const Admin = mongoose.model('Admin', adminSchema);

// Joi Validation function for Admin data
function validateAdmin(admin) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().valid('admin', 'superadmin').required(),
  });

  return schema.validate(admin);
}

// Export the model and validation function
module.exports = {
  Admin,
  validateAdmin,
};

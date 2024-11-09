const mongoose = require('mongoose');
const Joi = require('joi');

// Address Schema for Mongoose
const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    zip: {
        type: Number,
        required: true,
        min: 100000, // assuming ZIP codes are at least 5 digits
        max: 999999,
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    street: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    address: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
    }
});

// User Schema for Mongoose
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true, // Trims whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email is unique across documents
        minlength: 5,
        maxlength: 255,
        match: /.+\@.+\..+/, // Basic email format validation
        trim: true, // Trims whitespace
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 1024, // Max length for hashed password
    },
    phone: {
        type: String, // Changed to String to support country codes
        minlength: 10, // Minimum length (adjust based on region)
        maxlength: 15, // Maximum length (adjust based on region)
        match: /^\+?[0-9]{10,15}$/, // Regex for phone validation
    },
    addresses: [AddressSchema], // Embedded array of addresses
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create User Model
const User = mongoose.model('User', userSchema);

// Joi Validation Schema for Address
const addressValidationSchema = Joi.object({
    state: Joi.string().required(),
    zip: Joi.number().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    address: Joi.string().required(),
});

// Joi Validation Schema for User
const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().required().length(10), // Corrected from 'number' to 'string' and 'lenght' to 'length'
        addresses: Joi.array().items(addressValidationSchema)
    });

    return schema.validate(data);
}

// Export the User model and validation function
module.exports = {
    User, // Export the User model
    validateUser // Export the validation function
};

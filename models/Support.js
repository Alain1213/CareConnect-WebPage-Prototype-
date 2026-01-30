const mongoose = require('mongoose');

// This defines the structure of the data we will store in MongoDB
const supportSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    inquiryType: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const Support = mongoose.model('Support', supportSchema);

module.exports = Support;

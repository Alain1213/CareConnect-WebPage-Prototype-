const mongoose = require('mongoose');

// This defines the structure of the data we will store in MongoDB
const supportSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    inquiryType: {
        type: String,
        required: true,
        enum: ['patient', 'volunteer', 'general'],
        default: 'general'
    },
    message: { 
        type: String, 
        required: [true, 'Message is required'],
        minlength: [10, 'Message must be at least 10 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const Support = mongoose.model('Support', supportSchema);

module.exports = Support;

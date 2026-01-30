const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Required: Patient name
    patientName: { 
        type: String, 
        required: [true, 'Patient name is required'],
        trim: true
    },
    // Required: Email
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    // Required: Appointment date
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    // Optional: Phone number
    phone: {
        type: String,
        trim: true
    },
    // Optional: Appointment type
    appointmentType: {
        type: String,
        enum: ['consultation', 'checkup', 'emergency', 'follow-up'],
        default: 'consultation'
    },
    // Optional: Additional notes
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    // Status tracking
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
});

// Create the model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

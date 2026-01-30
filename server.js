const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Support = require('./models/Support'); // Import our model
const Appointment = require('./models/Appointment'); // Import Appointment model

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors()); // Allow the frontend to access this server
app.use(bodyParser.json()); // Allow us to read JSON data sent from frontend
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// --- MongoDB Connection ---
// 'careconnect' is the name of the database. MongoDB will create it if it doesn't exist.
const MONGO_URI = 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB successfully!'))
    .catch(err => {
        console.error('❌ Could not connect to MongoDB:', err);
        console.log('💡 Make sure MongoDB is installed and running!');
    });

// --- Routes ---

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// 1. GET: Fetch recent requests (for the list)
app.get('/api/support', async (req, res) => {
    try {
        // Find all requests, sort by newest first, take the top 10
        const requests = await Support.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-__v'); // Exclude version key from response
        
        res.json({ 
            success: true, 
            count: requests.length,
            data: requests 
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching requests from database',
            error: error.message 
        });
    }
});

// 2. POST: Save a new request (with validation)
app.post('/api/support', async (req, res) => {
    try {
        // Validate required fields
        const { fullName, email, message } = req.body;
        
        if (!fullName || !email || !message) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: fullName, email, and message are required' 
            });
        }

        // Create a new Support document using the data sent from frontend
        const newRequest = new Support(req.body);
        
        // Save it to the database (Mongoose will validate based on schema)
        await newRequest.save();
        
        console.log('✅ New request saved:', newRequest);
        
        res.status(201).json({ 
            success: true,
            message: 'Your request has been saved successfully!',
            data: newRequest 
        });
    } catch (error) {
        console.error('❌ Error saving request:', error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error saving request to database',
            error: error.message 
        });
    }
});

// 3. DELETE: Remove a request by ID (bonus feature)
app.delete('/api/support/:id', async (req, res) => {
    try {
        const deleted = await Support.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false,
                message: 'Request not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Request deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error deleting request',
            error: error.message 
        });
    }
});

// COPILOT TASK IMPLEMENTATION:
// ========================================
// POST /api/appointments - Save appointment data to MongoDB
// ========================================
app.post('/api/appointments', async (req, res) => {
    try {
        // Validate required fields
        const { patientName, email, phone, appointmentDate, appointmentType } = req.body;
        
        if (!patientName || !email || !phone || !appointmentDate) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: patientName, email, phone, and appointmentDate are required' 
            });
        }

        // Create a new Appointment document using the data sent from frontend
        const newAppointment = new Appointment(req.body);
        
        // Save it to the database (Mongoose will validate based on schema)
        await newAppointment.save();
        
        console.log('✅ New appointment saved:', newAppointment);
        
        res.status(201).json({ 
            success: true,
            message: 'Appointment booked successfully!',
            data: newAppointment 
        });
    } catch (error) {
        console.error('❌ Error saving appointment:', error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error saving appointment to database',
            error: error.message 
        });
    }
});

// ========================================
// GET /api/appointments - Fetch all appointments from MongoDB
// ========================================
app.get('/api/appointments', async (req, res) => {
    try {
        // Find all appointments, sort by date (most recent first)
        const appointments = await Appointment.find()
            .sort({ appointmentDate: -1 })
            .select('-__v'); // Exclude version key from response
        
        res.json({ 
            success: true, 
            count: appointments.length,
            data: appointments 
        });
    } catch (error) {
        console.error('❌ Error fetching appointments:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching appointments from database',
            error: error.message 
        });
    }
});

// ========================================
// GET /api/appointments/:id - Fetch single appointment by ID
// ========================================
app.get('/api/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ 
                success: false,
                message: 'Appointment not found' 
            });
        }
        
        res.json({ 
            success: true,
            data: appointment 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching appointment',
            error: error.message 
        });
    }
});

// ========================================
// PUT /api/appointments/:id - Update appointment status
// ========================================
app.put('/api/appointments/:id', async (req, res) => {
    try {
        const updated = await Appointment.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updated) {
            return res.status(404).json({ 
                success: false,
                message: 'Appointment not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Appointment updated successfully',
            data: updated 
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error updating appointment',
            error: error.message 
        });
    }
});

// ========================================
// DELETE /api/appointments/:id - Delete an appointment
// ========================================
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false,
                message: 'Appointment not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'Appointment cancelled successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error deleting appointment',
            error: error.message 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});





const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Support = require('./models/Support'); // Import our model

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors()); // Allow the frontend to access this server
app.use(bodyParser.json()); // Allow us to read JSON data sent from frontend

// --- MongoDB Connection ---
// 'careconnect' is the name of the database. MongoDB will create it if it doesn't exist.
const MONGO_URI = 'mongodb://127.0.0.1:27017/careconnect';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB successfully!'))
    .catch(err => console.error('❌ Could not connect to MongoDB:', err));

// --- Routes ---

// 1. GET: Fetch recent requests (for the list)
app.get('/api/support', async (req, res) => {
    try {
        // Find all requests, sort by newest first, take the top 5
        const requests = await Support.find().sort({ createdAt: -1 }).limit(5);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

// 2. POST: Save a new request
app.post('/api/support', async (req, res) => {
    try {
        // Create a new Support document using the data sent from frontend (req.body)
        const newRequest = new Support(req.body);
        
        // Save it to the database
        await newRequest.save();
        
        console.log('New request saved:', newRequest);
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error saving request:', error);
        res.status(500).json({ message: 'Error saving request' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

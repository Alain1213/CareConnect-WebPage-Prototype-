# CareConnect - Full-Stack Healthcare Web Application

## 📋 Project Purpose

CareConnect is a complete healthcare support platform that demonstrates full-stack web development skills. It allows patients to:
- Book medical appointments with healthcare providers
- Submit support requests and inquiries
- Interact with an AI-powered chatbot for quick assistance
- View their appointment history in real-time

This project showcases the ability to build a production-ready web application with proper frontend-backend communication, database integration, and RESTful API design.

## 🛠️ Tech Stack

### **Backend:**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for building REST APIs
- **MongoDB** - NoSQL database for storing appointments and support requests
- **Mongoose** - ODM (Object Data Modeling) library for MongoDB

### **Frontend:**
- **HTML5** - Semantic markup structure
- **CSS3 + Tailwind CSS** - Modern responsive styling
- **Vanilla JavaScript** - DOM manipulation and API communication (no frameworks)

## 🔄 How Frontend Talks to Backend

The application uses a **REST API architecture** for frontend-backend communication:

1. **Frontend (Browser)** sends HTTP requests using `fetch()` API:
   ```javascript
   fetch('http://localhost:3000/api/appointments', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(formData)
   })
   ```

2. **Backend (Express Server)** receives requests, processes them, and interacts with MongoDB:
   ```javascript
   app.post('/api/appointments', async (req, res) => {
     const appointment = new Appointment(req.body);
     await appointment.save();
     res.json({ success: true, data: appointment });
   })
   ```

3. **Database (MongoDB)** stores the data permanently using Mongoose models with validation schemas.

4. **Response Flow**: Backend sends JSON response → Frontend receives it → Updates the UI dynamically.

### **API Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/appointments` | Create new appointment |
| GET | `/api/appointments` | Fetch all appointments |
| GET | `/api/appointments/:id` | Get single appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| POST | `/api/support` | Submit support request |
| GET | `/api/support` | Get support requests |
| GET | `/api/health` | Check server status |

## 🚀 Steps to Run Locally

### **Prerequisites:**
Make sure you have these installed on your computer:
1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (Community Edition) - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** (optional) - [Download here](https://git-scm.com/)

### **Installation Steps:**

1. **Clone or Download the Project:**
   ```bash
   git clone <repository-url>
   cd "Care Connect Prototype"
   ```
   *(Or simply download and extract the ZIP file)*

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   This installs Express, Mongoose, CORS, and other required packages.

3. **Start MongoDB:**
   - **Windows**: Open Command Prompt and run:
     ```bash
     mongod
     ```
   - **Mac/Linux**: 
     ```bash
     sudo systemctl start mongod
     ```
   - MongoDB should now be running on `mongodb://127.0.0.1:27017`

4. **Start the Backend Server:**
   ```bash
   npm start
   ```
   You should see:
   ```
   ✅ Connected to MongoDB successfully!
   🚀 Server is running on http://localhost:3000
   ```

5. **Open the Frontend:**
   - Simply open `index.html` in your web browser, OR
   - Use VS Code "Live Server" extension for better development experience

6. **Test the Application:**
   - Fill out the appointment form
   - Submit a support request
   - Chat with the AI assistant
   - Check the database to see stored data

### **Troubleshooting:**

**"Cannot connect to MongoDB" error?**
- Make sure MongoDB service is running (`mongod` command)
- Check if port 27017 is available

**"Port 3000 already in use" error?**
- Stop other applications using port 3000, or
- Change the port in `server.js`: `const PORT = 5000;`

**"Cannot connect to server" message in UI?**
- Ensure backend is running (`npm start`)
- Check browser console for error details

## 📁 Project Structure

```
Care Connect Prototype/
├── models/
│   ├── Appointment.js    # Mongoose schema for appointments
│   └── Support.js        # Mongoose schema for support requests
├── index.html            # Main frontend page
├── script.js             # Frontend JavaScript (API calls, UI logic)
├── style.css             # Custom CSS styles
├── server.js             # Express backend server + API routes
├── package.json          # Node.js dependencies
└── README.md             # This file
```

## 🎯 Key Features Demonstrated

✅ Full-stack web development (Frontend + Backend + Database)  
✅ RESTful API design with proper HTTP methods  
✅ MongoDB database integration with Mongoose ORM  
✅ Form validation (client-side and server-side)  
✅ Error handling and user feedback  
✅ Responsive UI design with Tailwind CSS  
✅ Real-time data fetching and display  
✅ Clean, beginner-friendly code with comments  

## 📧 Contact

For questions or feedback about this project, reach out via the support form in the application.

---

**Built with ❤️ as a full-stack development demonstration project**

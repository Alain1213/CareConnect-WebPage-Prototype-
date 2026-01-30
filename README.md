# CareConnect Prototype

A healthcare support platform prototype offering AI chat assistance and a support request system with backend data storage.

## Features
- **Frontend**: Responsive UI built with HTML, Tailwind CSS, and JavaScript.
- **Backend API**: Node.js & Express REST API to handle data.
- **Data Storage**: MongoDB database to store support requests.
- **Interactive**: AI Chatbot simulation and dynamic request listing.

## Prerequisites
Before running this project, ensure you have the following installed:
1. **Node.js**: [Download Here](https://nodejs.org/)
2. **MongoDB**: [Download Here](https://www.mongodb.com/try/download/community) (The database service must be running).

## How to Run

1. **Install Dependencies**:
   Open a terminal in this folder and run:
   ```bash
   npm install
   ```

2. **Start the Backend Server**:
   ```bash
   npm start
   ```
   You should see: `✅ Connected to MongoDB successfully!`

3. **Open the Frontend**:
   Open `index.html` in your web browser (or use VS Code "Live Server").

4. **Test It**:
   - Fill out the "Get Support" form.
   - Refresh the page to see your request listed under "Recent Requests".

## Project Structure
- `server.js`: The backend API server.
- `models/`: Database schemas (MongoDB).
- `index.html` & `script.js`: Frontend user interface.

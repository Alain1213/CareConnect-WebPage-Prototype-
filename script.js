/**
 * CareConnect - Healthcare Support Exported Script
 * 
 * This file handles all the interactive features of the CareConnect prototype:
 * 1. AI Chatbot simulation with auto-responses
 * 2. Support Form submission handling
 * 3. Smooth scrolling and navigation
 */

// --- DOM Elements ---
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeChat = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const supportForm = document.getElementById('supportForm');
const requestList = document.getElementById('requestList');
const appointmentForm = document.getElementById('appointmentForm');
const appointmentList = document.getElementById('appointmentList');

// --- AI Chatbot Knowledge Base ---
const botKnowledge = {
    'volunteer': 'We\'d love to have you join our team! Please fill out the contact form above and select "Volunteering" as your inquiry type. Our coordinator will contact you.',
    'hours': 'Our support center is open Monday through Friday, from 9:00 AM to 6:00 PM EST.',
    'emergency': 'CRITICAL: If this is a medical emergency, please call 911 (or your local emergency services) immediately.',
    'appointment': 'To schedule an appointment, please use the contact form or call our support line at +1 (555) 123-4567.',
    'hello': 'Hello! I\'m your virtual health assistant. You can ask me about scheduling appointments, volunteering, or our hours.',
    'hi': 'Hi there! How can I help you with your healthcare needs today?',
    'thanks': 'You\'re very welcome! Is there anything else I can help you with?',
    'thank you': 'You\'re very welcome! Is there anything else I can help you with?',
    'default': 'I\'m still learning, but I can definitely help with appointments, volunteering, or our operation hours. What do you need help with?'
};

// --- Chatbot Functionality ---

// Open/Close Chat Window
function toggleChat() {
    if (chatbotWindow.classList.contains('hidden')) {
        chatbotWindow.classList.remove('hidden');
        chatbotWindow.classList.add('flex');
    } else {
        chatbotWindow.classList.add('hidden');
        chatbotWindow.classList.remove('flex');
    }
}

chatbotToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

// Append Message to UI
function appendMessage(text, sender) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex';
    
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}-message`;
    bubble.textContent = text;
    
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    
    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle AI Response Simulation
function getBotResponse(input) {
    const lower = input.toLowerCase();
    
    if (lower.includes('volunteer') || lower.includes('join')) return botKnowledge.volunteer;
    if (lower.includes('hour') || lower.includes('open')) return botKnowledge.hours;
    if (lower.includes('emergency') || lower.includes('help')) return botKnowledge.emergency;
    if (lower.includes('appointment') || lower.includes('schedule')) return botKnowledge.appointment;
    if (lower.includes('hello') || lower.includes('hey')) return botKnowledge.hello;
    if (lower.includes('hi')) return botKnowledge.hi;
    if (lower.includes('thank')) return botKnowledge.thanks;
    
    return botKnowledge.default;
}

// Chat Form Submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    // Add user message
    appendMessage(text, 'user');
    chatInput.value = '';

    // Simulate AI thinking delay
    setTimeout(() => {
        const response = getBotResponse(text);
        appendMessage(response, 'bot');
    }, 1000);
});

// --- Support Form Functionality ---
// Real Backend API endpoint (MongoDB)
const API_URL = 'http://localhost:3000/api/support';

// Show notification message to user
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl transition-all transform translate-x-0 ${
        type === 'success' ? 'bg-teal-600 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Show loading state on button
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="inline-block animate-spin">⏳</span> Sending...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Send Message';
    }
}

// Fetch requests from backend
async function fetchRequests() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            console.warn('Server returned error:', response.status);
            return []; 
        }
        
        const result = await response.json();
        // Backend now returns { success, count, data }
        return result.data || result || [];
    } catch (error) {
        console.warn('Could not connect to backend. Is the server running?', error);
        return [];
    }
}

// Create individual request item for display
function createRequestItem(request) {
    const item = document.createElement('li');
    const date = new Date(request.createdAt).toLocaleString();
    
    item.className = 'bg-white border border-slate-100 rounded-lg px-3 py-2 shadow-sm flex justify-between items-center group hover:border-teal-200 transition-colors';
    
    const info = document.createElement('span');
    info.textContent = `${request.fullName} • ${request.inquiryType} • ${date}`;
    
    // Optional: Add delete button (bonus feature)
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.className = 'opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700';
    deleteBtn.onclick = () => deleteRequest(request._id);
    
    item.appendChild(info);
    item.appendChild(deleteBtn);
    
    return item;
}

// Render all requests
async function renderRequests() {
    if (!requestList) return;
    
    // Show loading indicator
    requestList.innerHTML = '<li class="text-slate-400 animate-pulse">Loading...</li>';
    
    const requests = await fetchRequests();
    requestList.innerHTML = '';

    if (requests.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'text-slate-400 text-center py-4';
        empty.textContent = 'No requests yet. Submit the form to see it here!';
        requestList.appendChild(empty);
        return;
    }

    requests.forEach((request) => {
        requestList.appendChild(createRequestItem(request));
    });
}

// Delete a request (bonus feature)
async function deleteRequest(id) {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
            showNotification('Request deleted successfully');
            renderRequests();
        } else {
            showNotification('Failed to delete request', 'error');
        }
    } catch (error) {
        console.error('Delete failed:', error);
        showNotification('Error deleting request', 'error');
    }
}

// Form submission handler
if (supportForm) {
    // Load existing requests on page load
    renderRequests();

    supportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = supportForm.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true);

        const formData = new FormData(supportForm);
        const payload = Object.fromEntries(formData);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show success message
                showNotification(result.message || 'Request saved successfully!');
                
                // Refresh the list to show the new item
                await renderRequests();
                
                // Reset the form
                supportForm.reset();
            } else {
                // Handle validation or server errors
                const errorMsg = result.errors 
                    ? result.errors.join(', ') 
                    : result.message || 'Failed to save request';
                showNotification(errorMsg, 'error');
            }
        } catch (error) {
            console.error('Request failed:', error);
            showNotification('Cannot connect to server. Make sure it\'s running (npm start).', 'error');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
}

// COPILOT TASK IMPLEMENTATION:
// ========================================
// Connect Appointment Form to Backend API
// ========================================
const APPOINTMENT_API_URL = 'http://localhost:3000/api/appointments';

// Fetch appointments from backend
async function fetchAppointments() {
    try {
        const response = await fetch(APPOINTMENT_API_URL);
        
        if (!response.ok) {
            console.warn('Server returned error:', response.status);
            return []; 
        }
        
        const result = await response.json();
        return result.data || result || [];
    } catch (error) {
        console.warn('Could not connect to backend. Is the server running?', error);
        return [];
    }
}

// Create appointment item for display
function createAppointmentItem(appointment) {
    const item = document.createElement('li');
    const date = new Date(appointment.appointmentDate).toLocaleString();
    
    item.className = 'bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 flex justify-between items-center group hover:border-teal-200 transition-colors';
    
    const info = document.createElement('span');
    info.textContent = `${appointment.patientName} • ${appointment.appointmentType} • ${date}`;
    
    const statusBadge = document.createElement('span');
    statusBadge.className = 'text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-700';
    statusBadge.textContent = appointment.status;
    
    item.appendChild(info);
    item.appendChild(statusBadge);
    
    return item;
}

// Render all appointments
async function renderAppointments() {
    if (!appointmentList) return;
    
    appointmentList.innerHTML = '<li class="text-slate-400 animate-pulse">Loading...</li>';
    
    const appointments = await fetchAppointments();
    appointmentList.innerHTML = '';

    if (appointments.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'text-slate-400 text-center py-4';
        empty.textContent = 'No appointments yet. Book one above!';
        appointmentList.appendChild(empty);
        return;
    }

    appointments.slice(0, 5).forEach((appointment) => {
        appointmentList.appendChild(createAppointmentItem(appointment));
    });
}

// Appointment Form Submission Handler
if (appointmentForm) {
    // Load existing appointments on page load
    renderAppointments();

    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        
        // Prevent empty submissions - validate required fields
        const patientName = appointmentForm.querySelector('[name="patientName"]').value.trim();
        const email = appointmentForm.querySelector('[name="email"]').value.trim();
        const appointmentDate = appointmentForm.querySelector('[name="appointmentDate"]').value;

        if (!patientName || !email || !appointmentDate) {
            showNotification('Please fill in all required fields (Name, Email, Date)', 'error');
            return;
        }

        setButtonLoading(submitBtn, true);

        const formData = new FormData(appointmentForm);
        const payload = Object.fromEntries(formData);

        try {
            // Use fetch() to POST data to /api/appointments
            const response = await fetch(APPOINTMENT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Handle success and error responses
            if (response.ok && result.success) {
                // Show success message in UI
                showNotification(result.message || 'Appointment booked successfully! ✓');
                
                // Refresh the appointments list
                await renderAppointments();
                
                // Reset the form
                appointmentForm.reset();
            } else {
                // Show error message in UI
                const errorMsg = result.errors 
                    ? result.errors.join(', ') 
                    : result.message || 'Failed to book appointment';
                showNotification(errorMsg, 'error');
            }
        } catch (error) {
            console.error('Appointment booking failed:', error);
            showNotification('Cannot connect to server. Make sure it\'s running (npm start).', 'error');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
}

// --- Navigation Enhancements ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

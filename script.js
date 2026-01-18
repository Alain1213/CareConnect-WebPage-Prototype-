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
if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real app, you would send this data to a server
        const formData = new FormData(supportForm);
        console.log('Form Submitted:', Object.fromEntries(formData));

        // Show success state
        alert('Thank you for your request! A CareConnect representative will contact you within 24 hours.');
        supportForm.reset();
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

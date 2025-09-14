// Contact page functionality for RelaxAtSume

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeContactForms();
    setMinDate();
    loadSelectedService();
    initializeFAQ();
}

// Initialize contact forms
function initializeContactForms() {
    const quickBookingForm = document.getElementById('quick-booking-form');
    const generalInquiryForm = document.getElementById('general-inquiry-form');
    
    if (quickBookingForm) {
        quickBookingForm.addEventListener('submit', handleQuickBooking);
    }
    
    if (generalInquiryForm) {
        generalInquiryForm.addEventListener('submit', handleGeneralInquiry);
    }
}

// Handle quick booking form submission
function handleQuickBooking(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;
    
    // Simulate booking submission
    setTimeout(() => {
        // Save booking data to localStorage
        saveBookingData('quick-booking', formData);
        
        // Log to console
        console.log('Quick Booking Submission:', {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            service: formData.get('service'),
            date: formData.get('date'),
            time: formData.get('time'),
            notes: formData.get('notes'),
            newsletter: formData.get('newsletter'),
            timestamp: new Date().toISOString()
        });
        
        // Show success message
        showNotification('Thank you! Your booking request has been submitted. We\'ll contact you within 2 hours to confirm your appointment.', 'success');
        
        // Clear form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// Handle general inquiry form submission
function handleGeneralInquiry(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate inquiry submission
    setTimeout(() => {
        // Save inquiry data to localStorage
        saveInquiryData('general-inquiry', formData);
        
        // Log to console
        console.log('General Inquiry Submission:', {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter'),
            timestamp: new Date().toISOString()
        });
        
        // Show success message
        showNotification('Thank you! Your inquiry has been sent. We\'ll respond within 24 hours.', 'success');
        
        // Clear form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// Save booking data to localStorage
function saveBookingData(type, formData) {
    try {
        const data = {
            type: type,
            timestamp: new Date().toISOString(),
            data: Object.fromEntries(formData)
        };
        
        // Get existing bookings
        const existingData = JSON.parse(localStorage.getItem('relaxatsume_bookings') || '[]');
        
        // Add new booking
        existingData.push(data);
        
        // Keep only last 50 bookings
        if (existingData.length > 50) {
            existingData.splice(0, existingData.length - 50);
        }
        
        // Save back to localStorage
        localStorage.setItem('relaxatsume_bookings', JSON.stringify(existingData));
        
    } catch (error) {
        console.error('Error saving booking data:', error);
    }
}

// Save inquiry data to localStorage
function saveInquiryData(type, formData) {
    try {
        const data = {
            type: type,
            timestamp: new Date().toISOString(),
            data: Object.fromEntries(formData)
        };
        
        // Get existing inquiries
        const existingData = JSON.parse(localStorage.getItem('relaxatsume_inquiries') || '[]');
        
        // Add new inquiry
        existingData.push(data);
        
        // Keep only last 50 inquiries
        if (existingData.length > 50) {
            existingData.splice(0, existingData.length - 50);
        }
        
        // Save back to localStorage
        localStorage.setItem('relaxatsume_inquiries', JSON.stringify(existingData));
        
    } catch (error) {
        console.error('Error saving inquiry data:', error);
    }
}

// Set minimum date for booking (today)
function setMinDate() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Load selected service from localStorage (if coming from services page)
function loadSelectedService() {
    try {
        const selectedService = JSON.parse(localStorage.getItem('selected_service'));
        const selectedPackage = JSON.parse(localStorage.getItem('selected_package'));
        
        const serviceSelect = document.getElementById('booking-service');
        
        if (selectedService && serviceSelect) {
            serviceSelect.value = selectedService.serviceId;
            
            // Show notification about pre-selected service
            showNotification(`Service "${selectedService.serviceName}" has been pre-selected for you.`, 'info');
        }
        
        if (selectedPackage && serviceSelect) {
            serviceSelect.value = 'package';
            
            // Show notification about pre-selected package
            showNotification(`Package "${selectedPackage.packageName}" has been pre-selected for you.`, 'info');
        }
        
    } catch (error) {
        console.error('Error loading selected service:', error);
    }
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const answer = item.querySelector('.faq-answer');
                const isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                } else {
                    item.classList.add('open');
                }
            });
        }
    });
}

// Validate contact form
function validateContactForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(input.value.replace(/[\s\-\(\)]/g, ''))) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        // Date validation
        if (input.type === 'date' && input.value) {
            const selectedDate = new Date(input.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                input.classList.add('error');
                isValid = false;
                showNotification('Please select a future date for your appointment.', 'error');
            }
        }
    });
    
    return isValid;
}

// Check availability for selected date and time
function checkAvailability(date, time) {
    // This would typically make an API call to check real availability
    // For now, we'll simulate availability checking
    
    const unavailableSlots = [
        '2024-12-20-10:00',
        '2024-12-20-14:00',
        '2024-12-21-11:00',
        '2024-12-21-15:00'
    ];
    
    const slotKey = `${date}-${time}`;
    return !unavailableSlots.includes(slotKey);
}

// Update available time slots based on selected date
function updateTimeSlots() {
    const dateInput = document.getElementById('booking-date');
    const timeSelect = document.getElementById('booking-time');
    
    if (dateInput && timeSelect) {
        dateInput.addEventListener('change', function() {
            const selectedDate = this.value;
            const timeOptions = timeSelect.querySelectorAll('option');
            
            // Reset all options
            timeOptions.forEach(option => {
                if (option.value) {
                    option.disabled = false;
                    option.textContent = option.textContent.replace(' (Unavailable)', '');
                }
            });
            
            // Check availability for each time slot
            timeOptions.forEach(option => {
                if (option.value) {
                    const isAvailable = checkAvailability(selectedDate, option.value);
                    if (!isAvailable) {
                        option.disabled = true;
                        option.textContent += ' (Unavailable)';
                    }
                }
            });
        });
    }
}

// Initialize time slot updates
document.addEventListener('DOMContentLoaded', function() {
    updateTimeSlots();
});

// Export functions for global access
window.checkAvailability = checkAvailability;
window.updateTimeSlots = updateTimeSlots;

// Add CSS for contact page
const contactStyles = `
    .contact-info {
        padding: 4rem 0;
        background: #f8f9fa;
    }
    
    .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }
    
    .contact-card {
        display: flex;
        flex-direction: column;
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }
    
    .contact-card:hover {
        transform: translateY(-5px);
    }
    
    .contact-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 1.5rem;
    }
    
    .contact-icon img {
        width: 30px;
        height: 30px;
    }
    
    .contact-title {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    
    .contact-details {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .contact-link {
        margin-top: auto;
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
    }
    
    .contact-link:hover {
        color: #764ba2;
    }
    
    .contact-forms {
        padding: 4rem 0;
        background: white;
    }
    
    .forms-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
    }
    
    .form-container {
        display: flex;
        flex-direction: column;
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .form-header {
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .form-title {
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }
    
    .form-subtitle {
        color: #666;
        margin: 0;
    }
    
    .contact-form {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #2c3e50;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        background: white;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #667eea;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #f44336;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
    }
    
    .checkbox-group {
        margin-top: auto;
    }
    
    .checkbox-label {
        display: flex !important;
        align-items: center;
        cursor: pointer;
        font-size: 0.9rem;
        color: #666;
    }
    
    .checkbox-label input[type="checkbox"] {
        margin-right: 0.5rem;
        width: 16px;
        height: 16px;
    }
    
    .location-map {
        padding: 4rem 0;
        background: #f8f9fa;
    }
    
    .map-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .map-container {
        margin-bottom: 3rem;
    }
    
    .map-placeholder {
        background: #e0e0e0;
        border-radius: 15px;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    
    .map-content h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    
    .map-content p {
        color: #666;
        margin-bottom: 1rem;
    }
    
    .location-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }
    
    .detail-item {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .detail-item h4 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    
    .detail-item p {
        color: #666;
        line-height: 1.6;
    }
    
    .contact-faq {
        padding: 4rem 0;
        background: white;
    }
    
    .faq-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }
    
    .faq-item {
        background: #f8f9fa;
        border-radius: 10px;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .faq-item:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .faq-question {
        background: #667eea;
        color: white;
        padding: 1.5rem;
        margin: 0;
        cursor: pointer;
        transition: background 0.3s ease;
        position: relative;
    }
    
    .faq-question:hover {
        background: #764ba2;
    }
    
    .faq-question::after {
        content: '+';
        position: absolute;
        right: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.5rem;
        transition: transform 0.3s ease;
    }
    
    .faq-item.open .faq-question::after {
        transform: translateY(-50%) rotate(45deg);
    }
    
    .faq-answer {
        padding: 0 1.5rem;
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s ease;
        color: #666;
        line-height: 1.6;
    }
    
    .faq-item.open .faq-answer {
        padding: 1.5rem;
        max-height: 200px;
    }
    
    .contact-cta {
        padding: 4rem 0;
        background: #f8f9fa;
        text-align: center;
    }
    
    .cta-title {
        margin-bottom: 1rem;
    }
    
    .cta-subtitle {
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }
    
    .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    @media (max-width: 768px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }
        
        .forms-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .location-details {
            grid-template-columns: 1fr;
        }
        
        .faq-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject contact styles
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = contactStyles;
document.head.appendChild(contactStyleSheet);

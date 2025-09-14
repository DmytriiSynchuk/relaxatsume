// Forms handling and validation for RelaxAtSume website

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
});

// Initialize all forms
function initializeForms() {
    const quickContactForm = document.getElementById('quick-contact-form');
    const callbackForm = document.getElementById('callback-form');
    
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', handleQuickContactForm);
    }
    
    if (callbackForm) {
        callbackForm.addEventListener('submit', handleCallbackForm);
    }
    
    // Initialize form field enhancements
    enhanceFormFields();
}

// Handle quick contact form submission
function handleQuickContactForm(event) {
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
    
    // Simulate form submission
    setTimeout(() => {
        // Save to localStorage
        saveFormData('quick-contact', formData);
        
        // Log to console (simulating email sending)
        console.log('Quick Contact Form Submission:', {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        });
        
        // Show success message
        showNotification('Thank you! Your consultation request has been sent. We\'ll contact you within 24 hours.', 'success');
        
        // Clear form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// Handle callback form submission
function handleCallbackForm(event) {
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
    
    // Simulate form submission
    setTimeout(() => {
        // Save to localStorage
        saveFormData('callback-request', formData);
        
        // Log to console (simulating email sending)
        console.log('Callback Request Form Submission:', {
            name: formData.get('name'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        });
        
        // Show success message
        showNotification('Thank you! We\'ll call you back within 2 hours during business hours.', 'success');
        
        // Clear form
        form.reset();
        
        // Close modal
        closeCallbackModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// Save form data to localStorage
function saveFormData(formType, formData) {
    try {
        const data = {
            type: formType,
            timestamp: new Date().toISOString(),
            data: Object.fromEntries(formData)
        };
        
        // Get existing submissions
        const existingData = JSON.parse(localStorage.getItem('relaxatsume_submissions') || '[]');
        
        // Add new submission
        existingData.push(data);
        
        // Keep only last 50 submissions
        if (existingData.length > 50) {
            existingData.splice(0, existingData.length - 50);
        }
        
        // Save back to localStorage
        localStorage.setItem('relaxatsume_submissions', JSON.stringify(existingData));
        
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

// Get saved form submissions
function getSavedSubmissions() {
    try {
        return JSON.parse(localStorage.getItem('relaxatsume_submissions') || '[]');
    } catch (error) {
        console.error('Error retrieving form data:', error);
        return [];
    }
}

// Enhanced form field functionality
function enhanceFormFields() {
    // Add floating labels
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && !label) {
            // Create floating label effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        }
    });
    
    // Add character counter for textareas
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0 / ${maxLength}`;
        
        textarea.parentElement.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
        });
    });
    
    // Add phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})/, '($1) ');
            }
            
            this.value = value;
        });
    });
    
    // Add real-time validation
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Name validation
    if (field.name === 'name' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
        }
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('error');
        removeFieldError(field);
    } else {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error message
function showFieldError(field, message) {
    removeFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

// Remove field error message
function removeFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Newsletter subscription (if implemented)
function handleNewsletterSubscription(email) {
    if (!email) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Save to localStorage
    try {
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        
        if (subscribers.includes(email)) {
            showNotification('You\'re already subscribed to our newsletter!', 'info');
            return;
        }
        
        subscribers.push({
            email: email,
            subscribedAt: new Date().toISOString()
        });
        
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        
        // Log to console
        console.log('Newsletter Subscription:', {
            email: email,
            timestamp: new Date().toISOString()
        });
        
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        
    } catch (error) {
        console.error('Error saving newsletter subscription:', error);
        showNotification('There was an error subscribing. Please try again.', 'error');
    }
}

// Review submission
function submitReview(reviewData) {
    try {
        const reviews = JSON.parse(localStorage.getItem('customer_reviews') || '[]');
        
        const review = {
            id: Date.now(),
            ...reviewData,
            submittedAt: new Date().toISOString(),
            status: 'pending' // For moderation
        };
        
        reviews.push(review);
        localStorage.setItem('customer_reviews', JSON.stringify(reviews));
        
        // Log to console
        console.log('Review Submission:', review);
        
        showNotification('Thank you for your review! It will be published after moderation.', 'success');
        
        return true;
        
    } catch (error) {
        console.error('Error saving review:', error);
        showNotification('There was an error submitting your review. Please try again.', 'error');
        return false;
    }
}

// Get reviews for display
function getReviews() {
    try {
        const reviews = JSON.parse(localStorage.getItem('customer_reviews') || '[]');
        return reviews.filter(review => review.status === 'approved');
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        return [];
    }
}

// Calculate average rating
function calculateAverageRating() {
    const reviews = getReviews();
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10;
}

// Export functions for global access
window.handleNewsletterSubscription = handleNewsletterSubscription;
window.submitReview = submitReview;
window.getReviews = getReviews;
window.calculateAverageRating = calculateAverageRating;
window.getSavedSubmissions = getSavedSubmissions;

// Add CSS for form enhancements
const formStyles = `
    .form-group.focused input,
    .form-group.focused select,
    .form-group.focused textarea {
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
    
    .char-counter {
        text-align: right;
        font-size: 0.8rem;
        color: #666;
        margin-top: 0.25rem;
    }
    
    .char-counter.warning {
        color: #f44336;
    }
    
    .field-error {
        color: #f44336;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #f44336;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
    }
    
    .form-group input.error:focus,
    .form-group select.error:focus,
    .form-group textarea.error:focus {
        border-color: #f44336;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
    }
    
    .form-group input:valid,
    .form-group select:valid,
    .form-group textarea:valid {
        border-color: #4CAF50;
    }
    
    .form-group input:valid:focus,
    .form-group select:valid:focus,
    .form-group textarea:valid:focus {
        border-color: #4CAF50;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }
    
    .loading {
        position: relative;
        pointer-events: none;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Inject form styles
const formStyleSheet = document.createElement('style');
formStyleSheet.textContent = formStyles;
document.head.appendChild(formStyleSheet);

// Price Calculator for RelaxAtSume services

// Service pricing data
const servicePricing = {
    massage: {
        'swedish': { base: 80, duration: 60 },
        'deep-tissue': { base: 95, duration: 60 },
        'hot-stone': { base: 120, duration: 90 },
        'prenatal': { base: 85, duration: 60 },
        'sports': { base: 100, duration: 75 },
        'couples': { base: 160, duration: 60 }
    },
    spa: {
        'facial': { base: 90, duration: 60 },
        'body-wrap': { base: 130, duration: 90 },
        'exfoliation': { base: 75, duration: 45 },
        'detox-treatment': { base: 150, duration: 120 },
        'anti-aging': { base: 110, duration: 75 },
        'hydrating': { base: 85, duration: 60 }
    },
    wellness: {
        'consultation': { base: 60, duration: 45 },
        'nutrition-plan': { base: 120, duration: 60 },
        'stress-management': { base: 80, duration: 50 },
        'lifestyle-coaching': { base: 100, duration: 60 },
        'meditation-session': { base: 50, duration: 30 },
        'wellness-assessment': { base: 90, duration: 60 }
    },
    aromatherapy: {
        'essential-oil-massage': { base: 95, duration: 60 },
        'aromatherapy-session': { base: 70, duration: 45 },
        'custom-blend': { base: 85, duration: 50 },
        'stress-relief': { base: 75, duration: 45 },
        'energy-balancing': { base: 80, duration: 50 },
        'sleep-therapy': { base: 70, duration: 45 }
    }
};

// Add-on services
const addOns = {
    'extended-time': { price: 25, duration: 30 },
    'premium-oils': { price: 15, duration: 0 },
    'hot-towels': { price: 10, duration: 0 },
    'aromatherapy': { price: 20, duration: 0 },
    'cupping': { price: 30, duration: 15 },
    'reflexology': { price: 25, duration: 20 }
};

// Package discounts
const packageDiscounts = {
    'single': 0,
    'package-3': 0.1, // 10% off
    'package-5': 0.15, // 15% off
    'package-10': 0.2 // 20% off
};

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
});

// Initialize the price calculator
function initializeCalculator() {
    createCalculatorHTML();
    bindCalculatorEvents();
    updateCalculator();
}

// Create calculator HTML structure
function createCalculatorHTML() {
    const calculatorHTML = `
        <div class="price-calculator" id="price-calculator">
            <div class="calculator-header">
                <h3>Service Price Calculator</h3>
                <p>Get an instant quote for our services</p>
            </div>
            
            <div class="calculator-form">
                <div class="form-group">
                    <label for="service-category">Service Category</label>
                    <select id="service-category" name="category">
                        <option value="">Select a category</option>
                        <option value="massage">Therapeutic Massage</option>
                        <option value="spa">Luxury Spa Treatments</option>
                        <option value="wellness">Wellness Coaching</option>
                        <option value="aromatherapy">Aromatherapy Sessions</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="service-type">Service Type</label>
                    <select id="service-type" name="service">
                        <option value="">Select a service</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="package-type">Package Type</label>
                    <select id="package-type" name="package">
                        <option value="single">Single Session</option>
                        <option value="package-3">3-Session Package</option>
                        <option value="package-5">5-Session Package</option>
                        <option value="package-10">10-Session Package</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Add-on Services</label>
                    <div class="addon-options">
                        <label class="checkbox-label">
                            <input type="checkbox" name="addons" value="extended-time">
                            <span class="checkmark"></span>
                            Extended Time (+30 min) - $25
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="addons" value="premium-oils">
                            <span class="checkmark"></span>
                            Premium Oils - $15
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="addons" value="hot-towels">
                            <span class="checkmark"></span>
                            Hot Towels - $10
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="addons" value="aromatherapy">
                            <span class="checkmark"></span>
                            Aromatherapy - $20
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="addons" value="cupping">
                            <span class="checkmark"></span>
                            Cupping Therapy - $30
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="addons" value="reflexology">
                            <span class="checkmark"></span>
                            Reflexology - $25
                        </label>
                    </div>
                </div>
                
                <div class="calculator-results">
                    <div class="price-breakdown">
                        <div class="price-item">
                            <span class="price-label">Base Service:</span>
                            <span class="price-value" id="base-price">$0</span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Add-ons:</span>
                            <span class="price-value" id="addon-price">$0</span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Subtotal:</span>
                            <span class="price-value" id="subtotal-price">$0</span>
                        </div>
                        <div class="price-item discount" id="discount-row" style="display: none;">
                            <span class="price-label">Package Discount:</span>
                            <span class="price-value" id="discount-amount">-$0</span>
                        </div>
                        <div class="price-item total">
                            <span class="price-label">Total Price:</span>
                            <span class="price-value" id="total-price">$0</span>
                        </div>
                    </div>
                    
                    <div class="calculator-actions">
                        <button type="button" class="btn btn-primary" onclick="bookCalculatedService()">
                            Book This Service
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="resetCalculator()">
                            Reset Calculator
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert calculator into services page or create a dedicated section
    const servicesSection = document.querySelector('.calculator-section-container');
    if (servicesSection) {
        servicesSection.insertAdjacentHTML('afterend', calculatorHTML);
    } else {
        // Create a standalone calculator section
        const calculatorSection = document.createElement('section');
        calculatorSection.className = 'calculator-section';
        calculatorSection.innerHTML = calculatorHTML;
        document.body.appendChild(calculatorSection);
    }
}

// Bind calculator event listeners
function bindCalculatorEvents() {
    const categorySelect = document.getElementById('service-category');
    const serviceSelect = document.getElementById('service-type');
    const packageSelect = document.getElementById('package-type');
    const addonCheckboxes = document.querySelectorAll('input[name="addons"]');
    
    if (categorySelect) {
        categorySelect.addEventListener('change', updateServiceOptions);
    }
    
    if (serviceSelect) {
        serviceSelect.addEventListener('change', updateCalculator);
    }
    
    if (packageSelect) {
        packageSelect.addEventListener('change', updateCalculator);
    }
    
    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCalculator);
    });
}

// Update service options based on selected category
function updateServiceOptions() {
    const categorySelect = document.getElementById('service-category');
    const serviceSelect = document.getElementById('service-type');
    
    if (!categorySelect || !serviceSelect) return;
    
    const selectedCategory = categorySelect.value;
    serviceSelect.innerHTML = '<option value="">Select a service</option>';
    
    if (selectedCategory && servicePricing[selectedCategory]) {
        const services = servicePricing[selectedCategory];
        
        Object.keys(services).forEach(serviceKey => {
            const service = services[serviceKey];
            const serviceName = serviceKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const option = document.createElement('option');
            option.value = serviceKey;
            option.textContent = `${serviceName} - $${service.base} (${service.duration} min)`;
            serviceSelect.appendChild(option);
        });
    }
    
    updateCalculator();
}

// Update calculator results
function updateCalculator() {
    const categorySelect = document.getElementById('service-category');
    const serviceSelect = document.getElementById('service-type');
    const packageSelect = document.getElementById('package-type');
    const addonCheckboxes = document.querySelectorAll('input[name="addons"]:checked');
    
    if (!categorySelect || !serviceSelect || !packageSelect) return;
    
    const category = categorySelect.value;
    const service = serviceSelect.value;
    const packageType = packageSelect.value;
    
    let basePrice = 0;
    let totalDuration = 0;
    
    // Calculate base service price
    if (category && service && servicePricing[category] && servicePricing[category][service]) {
        const serviceData = servicePricing[category][service];
        basePrice = serviceData.base;
        totalDuration = serviceData.duration;
    }
    
    // Calculate add-on prices
    let addonPrice = 0;
    addonCheckboxes.forEach(checkbox => {
        const addonKey = checkbox.value;
        if (addOns[addonKey]) {
            addonPrice += addOns[addonKey].price;
            totalDuration += addOns[addonKey].duration;
        }
    });
    
    // Calculate subtotal
    const subtotal = basePrice + addonPrice;
    
    // Calculate package discount
    const discountRate = packageDiscounts[packageType] || 0;
    const discountAmount = subtotal * discountRate;
    const totalPrice = subtotal - discountAmount;
    
    // Update display
    updatePriceDisplay(basePrice, addonPrice, subtotal, discountAmount, totalPrice, packageType);
    
    // Update duration display if needed
    updateDurationDisplay(totalDuration);
}

// Update price display elements
function updatePriceDisplay(basePrice, addonPrice, subtotal, discountAmount, totalPrice, packageType) {
    const basePriceEl = document.getElementById('base-price');
    const addonPriceEl = document.getElementById('addon-price');
    const subtotalPriceEl = document.getElementById('subtotal-price');
    const discountRowEl = document.getElementById('discount-row');
    const discountAmountEl = document.getElementById('discount-amount');
    const totalPriceEl = document.getElementById('total-price');
    
    if (basePriceEl) basePriceEl.textContent = `$${basePrice}`;
    if (addonPriceEl) addonPriceEl.textContent = `$${addonPrice}`;
    if (subtotalPriceEl) subtotalPriceEl.textContent = `$${subtotal}`;
    
    if (discountAmount > 0) {
        if (discountRowEl) discountRowEl.style.display = 'flex';
        if (discountAmountEl) discountAmountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
        if (discountRowEl) discountRowEl.style.display = 'none';
    }
    
    if (totalPriceEl) totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
}

// Update duration display
function updateDurationDisplay(duration) {
    // You can add duration display logic here if needed
    console.log(`Total service duration: ${duration} minutes`);
}

// Reset calculator
function resetCalculator() {
    const categorySelect = document.getElementById('service-category');
    const serviceSelect = document.getElementById('service-type');
    const packageSelect = document.getElementById('package-type');
    const addonCheckboxes = document.querySelectorAll('input[name="addons"]');
    
    if (categorySelect) categorySelect.value = '';
    if (serviceSelect) serviceSelect.innerHTML = '<option value="">Select a service</option>';
    if (packageSelect) packageSelect.value = 'single';
    
    addonCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    updateCalculator();
}

// Book the calculated service
function bookCalculatedService() {
    const categorySelect = document.getElementById('service-category');
    const serviceSelect = document.getElementById('service-type');
    const packageSelect = document.getElementById('package-type');
    const addonCheckboxes = document.querySelectorAll('input[name="addons"]:checked');
    const totalPriceEl = document.getElementById('total-price');
    
    if (!categorySelect || !serviceSelect || !packageSelect || !totalPriceEl) {
        showNotification('Please complete the calculator first.', 'error');
        return;
    }
    
    const category = categorySelect.value;
    const service = serviceSelect.value;
    const packageType = packageSelect.value;
    const totalPrice = totalPriceEl.textContent;
    
    if (!category || !service) {
        showNotification('Please select a service category and type.', 'error');
        return;
    }
    
    // Get selected add-ons
    const selectedAddons = Array.from(addonCheckboxes).map(checkbox => checkbox.value);
    
    // Create booking data
    const bookingData = {
        category: category,
        service: service,
        packageType: packageType,
        addons: selectedAddons,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    try {
        const bookings = JSON.parse(localStorage.getItem('calculated_bookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('calculated_bookings', JSON.stringify(bookings));
        
        // Log to console
        console.log('Calculated Service Booking:', bookingData);
        
        // Show success message and redirect to contact
        showNotification('Service calculated! Redirecting to booking form...', 'success');
        
        setTimeout(() => {
            window.location.href = 'contacts/index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error saving booking data:', error);
        showNotification('There was an error processing your request. Please try again.', 'error');
    }
}

// Get service recommendations based on user preferences
function getServiceRecommendations(preferences) {
    const recommendations = [];
    
    // Simple recommendation logic based on preferences
    if (preferences.includes('stress')) {
        recommendations.push({
            category: 'massage',
            service: 'swedish',
            reason: 'Swedish massage is excellent for stress relief'
        });
        recommendations.push({
            category: 'aromatherapy',
            service: 'stress-relief',
            reason: 'Aromatherapy can help reduce stress and anxiety'
        });
    }
    
    if (preferences.includes('pain')) {
        recommendations.push({
            category: 'massage',
            service: 'deep-tissue',
            reason: 'Deep tissue massage helps with muscle pain and tension'
        });
    }
    
    if (preferences.includes('relaxation')) {
        recommendations.push({
            category: 'spa',
            service: 'body-wrap',
            reason: 'Body wraps provide deep relaxation and detoxification'
        });
    }
    
    return recommendations;
}

// Export functions for global access
window.resetCalculator = resetCalculator;
window.bookCalculatedService = bookCalculatedService;
window.getServiceRecommendations = getServiceRecommendations;

// Add CSS for calculator
const calculatorStyles = `
    .price-calculator {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        margin: 2rem 0;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .calculator-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .calculator-header h3 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }
    
    .calculator-header p {
        color: #666;
        margin: 0;
    }
    
    .calculator-form .form-group {
        margin-bottom: 1.5rem;
    }
    
    .calculator-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #2c3e50;
    }
    
    .calculator-form select {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        background: white;
        transition: border-color 0.3s ease;
    }
    
    .calculator-form select:focus {
        outline: none;
        border-color: #667eea;
    }
    
    .addon-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem;
    }
    
    .checkbox-label {
        display: flex !important;
        align-items: center;
        cursor: pointer;
        font-size: 0.9rem;
        color: #666;
        transition: color 0.3s ease;
    }
    
    .checkbox-label:hover {
        color: #2c3e50;
    }
    
    .checkbox-label input[type="checkbox"] {
        margin-right: 0.5rem;
        width: 16px;
        height: 16px;
    }
    
    .calculator-results {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 1.5rem;
        margin-top: 2rem;
    }
    
    .price-breakdown {
        margin-bottom: 1.5rem;
    }
    
    .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .price-item:last-child {
        border-bottom: none;
    }
    
    .price-item.total {
        font-weight: 600;
        font-size: 1.1rem;
        color: #2c3e50;
        border-top: 2px solid #667eea;
        margin-top: 0.5rem;
        padding-top: 1rem;
    }
    
    .price-item.discount {
        color: #4CAF50;
    }
    
    .price-label {
        color: #666;
    }
    
    .price-value {
        font-weight: 500;
        color: #2c3e50;
    }
    
    .price-item.total .price-value {
        color: #667eea;
        font-size: 1.2rem;
    }
    
    .calculator-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .calculator-actions .btn {
        flex: 1;
        max-width: 200px;
    }
    
    @media (max-width: 768px) {
        .price-calculator {
            padding: 1.5rem;
            margin: 1rem 0;
        }
        
        .addon-options {
            grid-template-columns: 1fr;
        }
        
        .calculator-actions {
            flex-direction: column;
        }
        
        .calculator-actions .btn {
            max-width: none;
        }
    }
`;

// Inject calculator styles
const calculatorStyleSheet = document.createElement('style');
calculatorStyleSheet.textContent = calculatorStyles;
document.head.appendChild(calculatorStyleSheet);

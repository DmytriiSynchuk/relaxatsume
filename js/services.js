// Services page functionality for RelaxAtSume

// Services data
const servicesData = [
    {
        id: 'swedish-massage',
        name: 'Swedish Massage',
        category: 'massage',
        price: 80,
        duration: 60,
        popularity: 5,
        description: 'A classic full-body massage using long strokes, kneading, and circular movements to promote relaxation and improve circulation.',
        image: '../images/services/swedish-massage.webp',
        badge: 'Most Popular'
    },
    {
        id: 'deep-tissue-massage',
        name: 'Deep Tissue Massage',
        category: 'massage',
        price: 95,
        duration: 60,
        popularity: 4,
        description: 'Targeted massage therapy focusing on deeper layers of muscle and connective tissue.',
        image: '../images/services/deep-tissue-massage.webp'
    },
    {
        id: 'hot-stone-massage',
        name: 'Hot Stone Massage',
        category: 'massage',
        price: 120,
        duration: 90,
        popularity: 4,
        description: 'Heated stones are placed on key points of the body and used in massage to provide deep muscle relaxation.',
        image: '../images/services/hot-stone-massage.webp'
    },
    {
        id: 'prenatal-massage',
        name: 'Prenatal Massage',
        category: 'massage',
        price: 85,
        duration: 60,
        popularity: 3,
        description: 'Specialized massage therapy designed for expectant mothers to relieve pregnancy-related discomfort.',
        image: '../images/services/prenatal-massage.webp'
    },
    {
        id: 'luxury-facial',
        name: 'Luxury Facial Treatment',
        category: 'spa',
        price: 90,
        duration: 60,
        popularity: 4,
        description: 'A comprehensive facial treatment including cleansing, exfoliation, extraction, massage, and mask application.',
        image: '../images/services/luxury-facial.jpg'
    },
    {
        id: 'body-wrap',
        name: 'Detoxifying Body Wrap',
        category: 'spa',
        price: 130,
        duration: 90,
        popularity: 4,
        description: 'A full-body treatment using mineral-rich mud or seaweed wraps to detoxify, hydrate, and firm the skin.',
        image: '../images/services/body-wrap-treatment.webp'
    },
    {
        id: 'body-exfoliation',
        name: 'Body Exfoliation Treatment',
        category: 'spa',
        price: 75,
        duration: 45,
        popularity: 3,
        description: 'A refreshing body scrub treatment using natural exfoliants to remove dead skin cells.',
        image: '../images/services/body-exfoliation.jpg'
    },
    {
        id: 'anti-aging',
        name: 'Anti-Aging Treatment',
        category: 'spa',
        price: 150,
        duration: 120,
        popularity: 5,
        description: 'Advanced facial and body treatment using cutting-edge techniques and premium products.',
        image: '../images/services/anti-aging-treatment.png',
        badge: 'Premium'
    },
    {
        id: 'wellness-consultation',
        name: 'Wellness Consultation',
        category: 'wellness',
        price: 60,
        duration: 45,
        popularity: 3,
        description: 'A comprehensive assessment of your current health and lifestyle to create a personalized wellness plan.',
        image: '../images/services/wellness-consultation.jpg'
    },
    {
        id: 'stress-management',
        name: 'Stress Management Coaching',
        category: 'wellness',
        price: 100,
        duration: 60,
        popularity: 4,
        description: 'Learn effective techniques to manage stress, improve work-life balance, and develop healthy coping strategies.',
        image: '../images/services/stress-management.jpg'
    },
    {
        id: 'aromatherapy-session',
        name: 'Aromatherapy Session',
        category: 'aromatherapy',
        price: 70,
        duration: 45,
        popularity: 3,
        description: 'Experience the healing power of essential oils through inhalation, topical application, and massage.',
        image: '../images/services/aromatherapy-session.jpg'
    },
    {
        id: 'essential-oil-massage',
        name: 'Essential Oil Massage',
        category: 'aromatherapy',
        price: 95,
        duration: 60,
        popularity: 4,
        description: 'Combines the therapeutic benefits of massage with the healing properties of essential oils.',
        image: '../images/services/essential-oil-massage.jpg'
    }
];

// Initialize services page
document.addEventListener('DOMContentLoaded', function() {
    initializeServicesPage();
});

function initializeServicesPage() {
    bindFilterEvents();
    bindFooterCategoryLinks();
    updateResultsCount();
    initializeServiceActions();
    handleUrlCategoryFilter();
}

// Bind filter event listeners
function bindFilterEvents() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const durationFilter = document.getElementById('duration-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterServices);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterServices);
    }
    
    if (durationFilter) {
        durationFilter.addEventListener('change', filterServices);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', sortServices);
    }
}

// Filter services based on selected criteria
function filterServices() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const durationFilter = document.getElementById('duration-filter');
    
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedPrice = priceFilter ? priceFilter.value : 'all';
    const selectedDuration = durationFilter ? durationFilter.value : 'all';
    
    const serviceItems = document.querySelectorAll('.service-item');
    let visibleCount = 0;
    
    serviceItems.forEach(item => {
        const category = item.dataset.category;
        const price = parseInt(item.dataset.price);
        const duration = parseInt(item.dataset.duration);
        
        let showItem = true;
        
        // Category filter
        if (selectedCategory !== 'all' && category !== selectedCategory) {
            showItem = false;
        }
        
        // Price filter
        if (selectedPrice !== 'all') {
            switch (selectedPrice) {
                case 'under-80':
                    if (price >= 80) showItem = false;
                    break;
                case '80-120':
                    if (price < 80 || price > 120) showItem = false;
                    break;
                case '120-150':
                    if (price < 120 || price > 150) showItem = false;
                    break;
                case 'over-150':
                    if (price <= 150) showItem = false;
                    break;
            }
        }
        
        // Duration filter
        if (selectedDuration !== 'all' && duration !== parseInt(selectedDuration)) {
            showItem = false;
        }
        
        if (showItem) {
            item.style.display = 'block';
            item.classList.add('fade-in');
            visibleCount++;
        } else {
            item.style.display = 'none';
            item.classList.remove('fade-in');
        }
    });
    
    updateResultsCount(visibleCount);
    
    // Update URL to reflect the current filter state
    updateUrlForCategory(selectedCategory);
}

// Sort services based on selected criteria
function sortServices() {
    const sortFilter = document.getElementById('sort-filter');
    if (!sortFilter) return;
    
    const sortBy = sortFilter.value;
    const servicesGrid = document.getElementById('services-grid');
    const serviceItems = Array.from(servicesGrid.querySelectorAll('.service-item'));
    
    serviceItems.sort((a, b) => {
        switch (sortBy) {
            case 'popularity':
                return parseInt(b.dataset.popularity) - parseInt(a.dataset.popularity);
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'duration':
                return parseInt(a.dataset.duration) - parseInt(b.dataset.duration);
            case 'name':
                return a.querySelector('.service-title').textContent.localeCompare(b.querySelector('.service-title').textContent);
            default:
                return 0;
        }
    });
    
    // Re-append sorted items
    serviceItems.forEach(item => {
        servicesGrid.appendChild(item);
    });
}

// Update results count
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const totalCount = count !== undefined ? count : document.querySelectorAll('.service-item').length;
        resultsCount.textContent = `${totalCount} service${totalCount !== 1 ? 's' : ''} found`;
    }
}

// Reset all filters
function resetFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const durationFilter = document.getElementById('duration-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';
    if (durationFilter) durationFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'popularity';
    
    // Show all services
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.style.display = 'block';
        item.classList.add('fade-in');
    });
    
    // Reset to original order
    sortServices();
    updateResultsCount();
}

// Bind footer category links
function bindFooterCategoryLinks() {
    const footerCategoryLinks = document.querySelectorAll('.footer-links a[href*="category="]');
    
    footerCategoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Check if this is a category link (contains ?category=massage, etc.)
            const categoryMatch = href.match(/[?&]category=(massage|spa|wellness|aromatherapy)/);
            
            if (categoryMatch) {
                event.preventDefault();
                const category = categoryMatch[1];
                
                // Update category filter dropdown
                const categoryFilter = document.getElementById('category-filter');
                if (categoryFilter) {
                    categoryFilter.value = category;
                }
                
                // Filter services
                filterServices();
                updateResultsCount();
                
                // Scroll to top of page
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}


// Handle URL category filter on page load
function handleUrlCategoryFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category && ['massage', 'spa', 'wellness', 'aromatherapy'].includes(category)) {
        // Update category filter dropdown
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
        
        // Filter services
        filterServices();
        updateResultsCount();
    }
}

// Update URL for category filtering
function updateUrlForCategory(category) {
    const url = new URL(window.location);
    
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    
    // Update URL without page reload
    window.history.pushState({}, '', url);
}

// Initialize service action buttons
function initializeServiceActions() {
    // This will be handled by the individual onclick handlers
}

// Book a specific service
function bookService(serviceId) {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) {
        showNotification('Service not found. Please try again.', 'error');
        return;
    }
    
    // Save service selection to localStorage
    try {
        const bookingData = {
            serviceId: serviceId,
            serviceName: service.name,
            servicePrice: service.price,
            serviceDuration: service.duration,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('selected_service', JSON.stringify(bookingData));
        
        // Log to console
        console.log('Service Booking Request:', bookingData);
        
        // Show success message and redirect to contact
        showNotification(`Selected ${service.name}. Redirecting to booking form...`, 'success');
        
        setTimeout(() => {
            window.location.href = '../contacts/index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error saving service selection:', error);
        showNotification('There was an error processing your request. Please try again.', 'error');
    }
}

// Learn more about a service
function learnMore(serviceId) {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) {
        showNotification('Service not found. Please try again.', 'error');
        return;
    }
    
    // Create modal content
    const modalContent = `
        <div class="service-modal">
            <div class="service-modal-header">
                <h3>${service.name}</h3>
                <span class="modal-close" onclick="closeServiceModal()">&times;</span>
            </div>
            <div class="service-modal-content">
                <div class="service-modal-image">
                    <img src="${service.image}" alt="${service.name}" class="modal-service-img">
                </div>
                <div class="service-modal-details">
                    <div class="service-details">
                        <div class="detail-items">
                            <div class="detail-label">Duration:</div>
                            <div class="detail-value">${service.duration} minutes</div>
                        </div>
                        <div class="detail-items">
                            <div class="detail-label">Price:</div>
                            <div class="detail-value">From $${service.price}</div>
                        </div>
                        <div class="detail-items">
                            <div class="detail-label">Category:</div>
                            <div class="detail-value">${service.category.charAt(0).toUpperCase() + service.category.slice(1)}</div>
                        </div>
                    </div>
                    <div class="service-description">
                        <h4>Description</h4>
                        <p>${service.description}</p>
                    </div>
                    <div class="service-benefits">
                        <h4>Benefits</h4>
                        <ul>
                            ${getServiceBenefits(serviceId).map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="service-actions">
                        <button class="btn btn-primary" onclick="bookService('${serviceId}'); closeServiceModal();">Book This Service</button>
                        <button class="btn btn-secondary" onclick="closeServiceModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal service-detail-modal';
    modal.id = 'service-detail-modal';
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close service modal
function closeServiceModal() {
    const modal = document.getElementById('service-detail-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// Get service benefits
function getServiceBenefits(serviceId) {
    const benefits = {
        'swedish-massage': [
            'Reduces muscle tension and stress',
            'Improves circulation and blood flow',
            'Promotes relaxation and better sleep',
            'Enhances overall wellbeing'
        ],
        'deep-tissue-massage': [
            'Relieves chronic muscle pain',
            'Breaks down scar tissue',
            'Improves range of motion',
            'Reduces inflammation'
        ],
        'hot-stone-massage': [
            'Deep muscle relaxation',
            'Improved circulation',
            'Stress and tension relief',
            'Enhanced flexibility'
        ],
        'prenatal-massage': [
            'Reduces pregnancy-related discomfort',
            'Improves sleep quality',
            'Reduces stress and anxiety',
            'Promotes better circulation'
        ],
        'luxury-facial': [
            'Deep cleansing and exfoliation',
            'Improved skin texture and tone',
            'Reduced signs of aging',
            'Relaxation and stress relief'
        ],
        'body-wrap': [
            'Detoxifies the body',
            'Improves skin hydration',
            'Reduces cellulite appearance',
            'Promotes relaxation'
        ],
        'body-exfoliation': [
            'Removes dead skin cells',
            'Improves skin texture',
            'Stimulates circulation',
            'Prepares skin for other treatments'
        ],
        'anti-aging': [
            'Reduces fine lines and wrinkles',
            'Improves skin firmness',
            'Enhances skin radiance',
            'Stimulates collagen production'
        ],
        'wellness-consultation': [
            'Personalized wellness assessment',
            'Goal setting and planning',
            'Lifestyle improvement guidance',
            'Health optimization strategies'
        ],
        'stress-management': [
            'Effective stress reduction techniques',
            'Improved work-life balance',
            'Better coping strategies',
            'Enhanced mental wellbeing'
        ],
        'aromatherapy-session': [
            'Natural stress relief',
            'Improved mood and energy',
            'Enhanced relaxation',
            'Therapeutic benefits of essential oils'
        ],
        'essential-oil-massage': [
            'Combined massage and aromatherapy benefits',
            'Enhanced relaxation experience',
            'Therapeutic essential oil effects',
            'Improved overall wellbeing'
        ]
    };
    
    return benefits[serviceId] || ['Promotes relaxation and wellness', 'Reduces stress and tension', 'Improves overall health', 'Enhances quality of life'];
}

// Book a service package
function bookPackage(packageType) {
    const packages = {
        'starter': {
            name: 'Starter Package',
            price: 200,
            services: ['Swedish Massage', 'Wellness Consultation']
        },
        'relaxation': {
            name: 'Relaxation Package',
            price: 350,
            services: ['Hot Stone Massage', 'Luxury Facial', 'Aromatherapy Session']
        },
        'premium': {
            name: 'Premium Package',
            price: 500,
            services: ['Anti-Aging Treatment', 'Deep Tissue Massage', 'Stress Management Session', 'Detoxifying Body Wrap']
        }
    };
    
    const packageData = packages[packageType];
    if (!packageData) {
        showNotification('Package not found. Please try again.', 'error');
        return;
    }
    
    // Save package selection to localStorage
    try {
        const bookingData = {
            packageType: packageType,
            packageName: packageData.name,
            packagePrice: packageData.price,
            packageServices: packageData.services,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('selected_package', JSON.stringify(bookingData));
        
        // Log to console
        console.log('Package Booking Request:', bookingData);
        
        // Show success message and redirect to contact
        showNotification(`Selected ${packageData.name}. Redirecting to booking form...`, 'success');
        
        setTimeout(() => {
            window.location.href = '../contacts/index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error saving package selection:', error);
        showNotification('There was an error processing your request. Please try again.', 'error');
    }
}

// Export functions for global access
window.bookService = bookService;
window.learnMore = learnMore;
window.resetFilters = resetFilters;
window.bookPackage = bookPackage;
window.closeServiceModal = closeServiceModal;

// Add CSS for services page
const servicesStyles = `
    .services-filter {
        background: #f8f9fa;
        padding: 2rem 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .filter-controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .filter-group label {
        font-weight: 500;
        color: #2c3e50;
        font-size: 0.9rem;
    }
    
    .filter-select {
        padding: 8px 12px;
        border: 2px solid #e0e0e0;
        border-radius: 6px;
        font-size: 0.9rem;
        background: white;
        transition: border-color 0.3s ease;
    }
    
    .filter-select:focus {
        outline: none;
        border-color: #667eea;
    }
    
    .filter-results {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #666;
        font-size: 0.9rem;
    }
    
    .btn-small {
        padding: 6px 16px;
        font-size: 0.8rem;
    }
    
    .services-catalog {
        padding: 4rem 0;
    }
    
    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }
    
    .service-item {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .service-item.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    .service-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .service-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .service-item:hover .service-img {
        transform: scale(1.05);
    }
    
    .service-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .service-content {
        height: calc(100% - 200px);
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
    }
    
    .service-title {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }
    
    .service-description {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .service-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .service-duration {
        color: #667eea;
        font-weight: 500;
    }
    
    .service-price {
        color: #2c3e50;
        font-weight: 600;
        font-size: 1.1rem;
    }
    
    .service-actions {
        display: flex;
        gap: 0.75rem;
    }
    
    .service-actions .btn {
        flex: 1;
        text-align: center;
        padding: 10px 16px;
        font-size: 0.9rem;
    }
    
    .service-packages {
        padding: 4rem 0;
        background: #f8f9fa;
    }
    
    .calculator-section {
        padding: 2rem 0;
    }
    
    .packages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .package-card {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .package-card:hover {
        transform: translateY(-5px);
    }
    
    .package-card.featured {
        border: 2px solid #667eea;
        transform: scale(1.05);
    }
    
    .package-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: #667eea;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        z-index: 1;
    }
    
    .package-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
        text-align: center;
    }
    
    .package-name {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: white;
    }
    
    .package-price {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: white;
    }
    
    .package-description {
        opacity: 0.9;
        margin: 0;
    }
    
    .package-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 2rem;
    }

    .package-content .btn {
        margin-top: auto;
        align-self: center;
        min-width: 150px;
    }
    
    .package-features {
        list-style: none;
        margin-bottom: 2rem;
    }
    
    .package-features li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .package-features li:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #4CAF50;
        font-weight: bold;
    }
    
    .package-features li:last-child {
        border-bottom: none;
    }
    
    .services-cta {
        padding: 4rem 0;
        background: white;
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
    
    .service-detail-modal {
        z-index: 3000;
    }
    
    .service-modal {
        background: white;
        border-radius: 15px;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        margin: 5% auto;
        position: relative;
    }
    
    .service-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .service-modal-header h3 {
        margin: 0;
        color: #2c3e50;
    }
    
    .service-modal-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }
    
    .modal-service-img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        border-radius: 10px;
    }
    
    .detail-items {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .detail-label {
        font-weight: 500;
        color: #666;
    }
    
    .detail-value {
        color: #2c3e50;
        font-weight: 600;
    }
    
    .service-benefits h4,
    .service-description h4 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    
    .service-benefits ul {
        list-style: none;
        padding: 0;
    }
    
    .service-benefits li {
        padding: 0.5rem 0;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .service-benefits li:before {
        content: '•';
        position: absolute;
        left: 0;
        color: #667eea;
        font-weight: bold;
    }
    
    .service-actions {
        display: flex;
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .filter-controls {
            grid-template-columns: 1fr;
        }
        
        .services-grid {
            grid-template-columns: 1fr;
        }
        
        .packages-grid {
            grid-template-columns: 1fr;
        }
        
        .package-card.featured {
            transform: none;
        }
        
        .service-modal-content {
            grid-template-columns: 1fr;
        }
        
        .service-actions {
            flex-direction: column;
        }
    }
`;

// Inject services styles
const servicesStyleSheet = document.createElement('style');
servicesStyleSheet.textContent = servicesStyles;
document.head.appendChild(servicesStyleSheet);

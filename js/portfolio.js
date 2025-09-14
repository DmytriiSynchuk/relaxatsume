// Portfolio page functionality for RelaxAtSume

// Initialize portfolio page
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolioPage();
});

function initializePortfolioPage() {
    bindCategoryFilters();
    initializeImageLightbox();
    initializeStatsAnimation();
}

// Bind category filter events
function bindCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(selectedCategory, portfolioItems);
        });
    });
}

// Filter portfolio items by category
function filterPortfolioItems(category, portfolioItems) {
    let visibleCount = 0;
    
    portfolioItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.classList.add('fade-in');
            visibleCount++;
        } else {
            item.style.display = 'none';
            item.classList.remove('fade-in');
        }
    });
}

// Initialize image lightbox functionality
function initializeImageLightbox() {
    const portfolioImages = document.querySelectorAll('.portfolio-img');
    
    portfolioImages.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
}

// Open lightbox for image viewing
function openLightbox(imageSrc, imageAlt) {
    const lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
            <img src="${imageSrc}" alt="${imageAlt}" class="lightbox-image">
            <div class="lightbox-caption">${imageAlt}</div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add CSS for lightbox
    const lightboxStyles = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            animation: fadeIn 0.3s ease-out forwards;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            z-index: 10001;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            margin-top: 1rem;
            font-size: 1.1rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .lightbox-content {
                max-width: 95%;
                max-height: 95%;
            }
            
            .lightbox-close {
                top: -30px;
                font-size: 1.5rem;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = lightboxStyles;
    document.head.appendChild(styleSheet);
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Initialize statistics animation
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.portfolio-stats');
    
    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// Animate statistics numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        const suffix = finalValue.replace(/[\d]/g, '');
        
        if (numericValue) {
            animateNumber(stat, 0, numericValue, 2000, suffix);
        }
    });
}

// Animate number counting
function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Export functions for global access
window.closeLightbox = closeLightbox;

// Add CSS for portfolio page
const portfolioStyles = `
    .portfolio-categories {
        background: #f8f9fa;
        padding: 2rem 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .categories-nav {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .category-btn {
        padding: 8px 20px;
        border: 2px solid #e0e0e0;
        background: white;
        color: #666;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .category-btn:hover {
        border-color: #667eea;
        color: #667eea;
    }
    
    .category-btn.active {
        background: #667eea;
        border-color: #667eea;
        color: white;
    }
    
    .portfolio-grid-section {
        padding: 4rem 0;
        background: white;
    }
    
    .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }
    
    .portfolio-item {
        position: relative;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .portfolio-item.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .portfolio-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    .portfolio-image {
        position: relative;
        height: 250px;
        overflow: hidden;
    }
    
    .portfolio-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
        cursor: pointer;
    }
    
    .portfolio-item:hover .portfolio-img {
        transform: scale(1.05);
    }
    
    .portfolio-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        color: white;
        padding: 2rem 1.5rem 1.5rem;
        transform: translateY(100%);
        transition: transform 0.3s ease;
    }
    
    .portfolio-item:hover .portfolio-overlay {
        transform: translateY(0);
    }
    
    .portfolio-title {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        color: white;
    }
    
    .portfolio-description {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.9;
        line-height: 1.4;
    }
    
    .author-name {
        margin: 0 0 0.25rem 0;
        color: #2c3e50;
        font-size: 1rem;
    }
    
    .author-title {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .portfolio-stats {
        padding: 4rem 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        text-align: center;
    }
    
    .stat-item {
        padding: 1rem;
    }
    
    .stat-number {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: white;
    }
    
    .stat-label {
        font-size: 1.1rem;
        opacity: 0.9;
        color: white;
    }
    
    .portfolio-cta {
        padding: 4rem 0;
        background: white;
        text-align: center;
    }
    
    .cta-title {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    
    .cta-subtitle {
        color: #666;
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }
    
    .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    @media (max-width: 768px) {
        .portfolio-grid {
            grid-template-columns: 1fr;
        }
        
        .categories-nav {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 1rem;
        }
        
        .category-btn {
            white-space: nowrap;
        }
        
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .stat-number {
            font-size: 2.5rem;
        }
    }
`;

// Inject portfolio styles
const portfolioStyleSheet = document.createElement('style');
portfolioStyleSheet.textContent = portfolioStyles;
document.head.appendChild(portfolioStyleSheet);

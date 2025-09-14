// Cookie management functionality for RelaxAtSume

// Cookie consent management
document.addEventListener('DOMContentLoaded', function() {
    initializeCookieConsent();
    initializeCookieSettings();
});

// Initialize cookie consent banner
function initializeCookieConsent() {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    
    if (!consent) {
        showCookieBanner();
    }
}

// Show cookie consent banner
function showCookieBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-banner-content">
            <div class="cookie-banner-text">
                <h4>We Use Cookies</h4>
                <p>We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
            </div>
            <div class="cookie-banner-actions">
                <button class="btn btn-secondary btn-small" onclick="openCookieSettings()">Cookie Settings</button>
                <button class="btn btn-primary btn-small" onclick="acceptAllCookies()">Accept All</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add CSS for cookie banner
    const bannerStyles = `
        .cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(44, 62, 80, 0.95);
            color: white;
            padding: 1rem;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .cookie-banner-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
        }
        
        .cookie-banner-text h4 {
            margin: 0 0 0.5rem 0;
            color: white;
        }
        
        .cookie-banner-text p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .cookie-banner-actions {
            display: flex;
            gap: 1rem;
            flex-shrink: 0;
        }
        
        @media (max-width: 768px) {
            .cookie-banner-content {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
            }
            
            .cookie-banner-actions {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = bannerStyles;
    document.head.appendChild(styleSheet);
}

// Accept all cookies
function acceptAllCookies() {
    const consent = {
        essential: true,
        analytics: true,
        functionality: true,
        marketing: true,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    hideCookieBanner();
    enableAllCookies();
    showNotification('Cookie preferences saved. Thank you!', 'success');
}

// Open cookie settings modal
function openCookieSettings() {
    const modal = document.createElement('div');
    modal.id = 'cookie-settings-modal';
    modal.className = 'modal cookie-settings-modal';
    modal.innerHTML = `
        <div class="modal-content cookie-settings-content">
            <span class="modal-close" onclick="closeCookieSettings()">&times;</span>
            <h3 class="modal-title">Cookie Preferences</h3>
            <p class="modal-subtitle">Choose which cookies you want to allow. You can change these settings at any time.</p>
            
            <div class="cookie-categories">
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>Essential Cookies</h4>
                        <label class="toggle-switch">
                            <input type="checkbox" id="essential-cookies" checked disabled>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-category-description">These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.</p>
                </div>
                
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>Analytics Cookies</h4>
                        <label class="toggle-switch">
                            <input type="checkbox" id="analytics-cookies">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-category-description">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.</p>
                </div>
                
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>Functionality Cookies</h4>
                        <label class="toggle-switch">
                            <input type="checkbox" id="functionality-cookies">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-category-description">These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</p>
                </div>
                
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h4>Marketing Cookies</h4>
                        <label class="toggle-switch">
                            <input type="checkbox" id="marketing-cookies">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-category-description">These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites.</p>
                </div>
            </div>
            
            <div class="cookie-settings-actions">
                <button class="btn btn-secondary" onclick="rejectAllCookies()">Reject All</button>
                <button class="btn btn-primary" onclick="saveCookiePreferences()">Save Preferences</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Load current preferences
    loadCookiePreferences();
    
    // Add CSS for cookie settings modal
    const modalStyles = `
        .cookie-settings-modal {
            z-index: 10001;
        }
        
        .cookie-settings-content {
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-subtitle {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .cookie-categories {
            margin-bottom: 2rem;
        }
        
        .cookie-category {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .cookie-category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .cookie-category-header h4 {
            margin: 0;
            color: #2c3e50;
        }
        
        .cookie-category-description {
            color: #666;
            line-height: 1.6;
            margin: 0;
        }
        
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .toggle-slider {
            background-color: #667eea;
        }
        
        input:checked + .toggle-slider:before {
            transform: translateX(26px);
        }
        
        input:disabled + .toggle-slider {
            background-color: #667eea;
            opacity: 0.6;
        }
        
        .cookie-settings-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
            .cookie-settings-actions {
                flex-direction: column;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
}

// Close cookie settings modal
function closeCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// Load current cookie preferences
function loadCookiePreferences() {
    const consent = JSON.parse(localStorage.getItem('cookie_consent') || '{}');
    
    document.getElementById('analytics-cookies').checked = consent.analytics || false;
    document.getElementById('functionality-cookies').checked = consent.functionality || false;
    document.getElementById('marketing-cookies').checked = consent.marketing || false;
}

// Save cookie preferences
function saveCookiePreferences() {
    const consent = {
        essential: true, // Always true
        analytics: document.getElementById('analytics-cookies').checked,
        functionality: document.getElementById('functionality-cookies').checked,
        marketing: document.getElementById('marketing-cookies').checked,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    closeCookieSettings();
    hideCookieBanner();
    applyCookiePreferences(consent);
    showNotification('Cookie preferences saved successfully!', 'success');
}

// Reject all non-essential cookies
function rejectAllCookies() {
    const consent = {
        essential: true,
        analytics: false,
        functionality: false,
        marketing: false,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    closeCookieSettings();
    hideCookieBanner();
    applyCookiePreferences(consent);
    showNotification('Non-essential cookies disabled.', 'info');
}

// Apply cookie preferences
function applyCookiePreferences(consent) {
    // Enable/disable analytics cookies
    if (consent.analytics) {
        enableAnalyticsCookies();
    } else {
        disableAnalyticsCookies();
    }
    
    // Enable/disable functionality cookies
    if (consent.functionality) {
        enableFunctionalityCookies();
    } else {
        disableFunctionalityCookies();
    }
    
    // Enable/disable marketing cookies
    if (consent.marketing) {
        enableMarketingCookies();
    } else {
        disableMarketingCookies();
    }
}

// Enable all cookies
function enableAllCookies() {
    enableAnalyticsCookies();
    enableFunctionalityCookies();
    enableMarketingCookies();
}

// Enable analytics cookies
function enableAnalyticsCookies() {
    // Initialize Google Analytics or other analytics tools
    console.log('Analytics cookies enabled');
    
    // Example: Initialize Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }
}

// Disable analytics cookies
function disableAnalyticsCookies() {
    console.log('Analytics cookies disabled');
    
    // Example: Disable Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
    }
}

// Enable functionality cookies
function enableFunctionalityCookies() {
    console.log('Functionality cookies enabled');
    
    // Enable features that require functionality cookies
    // Example: Remember user preferences, language settings, etc.
}

// Disable functionality cookies
function disableFunctionalityCookies() {
    console.log('Functionality cookies disabled');
    
    // Disable features that require functionality cookies
    // Clear stored preferences
    localStorage.removeItem('user_preferences');
    localStorage.removeItem('language');
    localStorage.removeItem('recent_services');
}

// Enable marketing cookies
function enableMarketingCookies() {
    console.log('Marketing cookies enabled');
    
    // Initialize marketing tools
    // Example: Facebook Pixel, Google Ads, etc.
}

// Disable marketing cookies
function disableMarketingCookies() {
    console.log('Marketing cookies disabled');
    
    // Disable marketing tools
    // Example: Disable Facebook Pixel, Google Ads, etc.
}

// Hide cookie banner
function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Initialize cookie settings functionality
function initializeCookieSettings() {
    // This function can be used to initialize any cookie-related functionality
    // when the page loads
}

// Check if specific cookie category is allowed
function isCookieCategoryAllowed(category) {
    const consent = JSON.parse(localStorage.getItem('cookie_consent') || '{}');
    return consent[category] || false;
}

// Get all cookie preferences
function getCookiePreferences() {
    return JSON.parse(localStorage.getItem('cookie_consent') || '{}');
}

// Clear all cookies (except essential)
function clearAllCookies() {
    // Clear localStorage items related to cookies
    const keysToRemove = [
        'user_preferences',
        'language',
        'recent_services',
        'ads_preferences'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear document cookies (except essential ones)
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Don't clear essential cookies
        if (!['session_id', 'csrf_token', 'cookie_consent'].includes(name)) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
    });
    
    console.log('Non-essential cookies cleared');
}

// Export functions for global access
window.acceptAllCookies = acceptAllCookies;
window.openCookieSettings = openCookieSettings;
window.closeCookieSettings = closeCookieSettings;
window.saveCookiePreferences = saveCookiePreferences;
window.rejectAllCookies = rejectAllCookies;
window.isCookieCategoryAllowed = isCookieCategoryAllowed;
window.getCookiePreferences = getCookiePreferences;
window.clearAllCookies = clearAllCookies;

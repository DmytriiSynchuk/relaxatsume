// Blog functionality for RelaxAtSume

// Initialize blog page
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogPage();
});

function initializeBlogPage() {
    bindCategoryFilters();
    bindFooterCategoryLinks();
    initializeNewsletterForm();
    updateArticleViews();
    handleUrlCategoryFilter();
}

// Bind category filter events
function bindCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter articles
            filterArticles(selectedCategory, blogCards);
        });
    });
}

// Filter articles by category
function filterArticles(category, blogCards) {
    let visibleCount = 0;
    
    blogCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
    
    // Update URL without page reload
    updateUrlForCategory(category);
}

// Bind footer category links
function bindFooterCategoryLinks() {
    const footerCategoryLinks = document.querySelectorAll('.footer-links a[href*="category="]');
    
    footerCategoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Check if we're on the blog page or an individual blog post page
            const isOnBlogPage = window.location.pathname.includes('/blog/index.html') || 
                                window.location.pathname.endsWith('/blog/') ||
                                window.location.pathname.endsWith('/blog');
            
            if (isOnBlogPage) {
                // On blog page - prevent default and filter articles
                event.preventDefault();
                
                // Extract category from href
                const url = new URL(this.href, window.location.origin);
                const category = url.searchParams.get('category');
                
                if (category) {
                    // Update active category button
                    updateActiveCategoryButton(category);
                    
                    // Filter articles
                    const blogCards = document.querySelectorAll('.blog-card');
                    filterArticles(category, blogCards);
                    
                    // Scroll to top of page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
}

// Update active category button
function updateActiveCategoryButton(category) {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.category === category) {
            button.classList.add('active');
        }
    });
}

// Handle URL category filter on page load
function handleUrlCategoryFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Update active category button
        updateActiveCategoryButton(category);
        
        // Filter articles
        const blogCards = document.querySelectorAll('.blog-card');
        filterArticles(category, blogCards);
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

// Add CSS for notification animation
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-text {
        font-size: 0.9rem;
        font-weight: 500;
    }
`;

// Inject notification styles
const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);

// Initialize newsletter form
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();
            
            if (email) {
                handleNewsletterSubscription(email);
                emailInput.value = '';
            }
        });
    }
}

// Update article view counts (simulate)
function updateArticleViews() {
    const viewElements = document.querySelectorAll('.article-views');
    
    viewElements.forEach(element => {
        const currentViews = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const newViews = currentViews + Math.floor(Math.random() * 10);
        element.textContent = `${newViews.toLocaleString()} views`;
    });
}

// Track article reading time
function trackReadingTime(articleId, startTime) {
    const endTime = Date.now();
    const readingTime = Math.round((endTime - startTime) / 1000);
    
    // Save reading time to localStorage
    try {
        const readingData = JSON.parse(localStorage.getItem('article_reading_times') || '{}');
        readingData[articleId] = readingData[articleId] || [];
        readingData[articleId].push({
            readingTime: readingTime,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('article_reading_times', JSON.stringify(readingData));
        
        console.log(`Article ${articleId} reading time: ${readingTime} seconds`);
    } catch (error) {
        console.error('Error tracking reading time:', error);
    }
}

// Share article functionality
function shareArticle(articleTitle, articleUrl) {
    if (navigator.share) {
        navigator.share({
            title: articleTitle,
            url: articleUrl
        }).catch(error => {
            console.log('Error sharing:', error);
            fallbackShare(articleTitle, articleUrl);
        });
    } else {
        fallbackShare(articleTitle, articleUrl);
    }
}

// Fallback share functionality
function fallbackShare(articleTitle, articleUrl) {
    const shareText = `Check out this article: ${articleTitle}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}`;
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Bookmark article
function bookmarkArticle(articleId, articleTitle) {
    try {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
        
        const existingBookmark = bookmarks.find(bookmark => bookmark.id === articleId);
        
        if (existingBookmark) {
            // Remove bookmark
            const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== articleId);
            localStorage.setItem('bookmarked_articles', JSON.stringify(updatedBookmarks));
            showNotification('Article removed from bookmarks', 'info');
        } else {
            // Add bookmark
            bookmarks.push({
                id: articleId,
                title: articleTitle,
                bookmarkedAt: new Date().toISOString()
            });
            localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarks));
            showNotification('Article bookmarked successfully', 'success');
        }
        
        // Update bookmark button state
        updateBookmarkButton(articleId);
        
    } catch (error) {
        console.error('Error bookmarking article:', error);
        showNotification('Error bookmarking article', 'error');
    }
}

// Update bookmark button state
function updateBookmarkButton(articleId) {
    const bookmarkButtons = document.querySelectorAll(`[data-article-id="${articleId}"]`);
    
    try {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
        const isBookmarked = bookmarks.some(bookmark => bookmark.id === articleId);
        
        bookmarkButtons.forEach(button => {
            if (isBookmarked) {
                button.classList.add('bookmarked');
                button.textContent = 'Bookmarked';
            } else {
                button.classList.remove('bookmarked');
                button.textContent = 'Bookmark';
            }
        });
    } catch (error) {
        console.error('Error updating bookmark button:', error);
    }
}

// Get bookmarked articles
function getBookmarkedArticles() {
    try {
        return JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    } catch (error) {
        console.error('Error retrieving bookmarked articles:', error);
        return [];
    }
}

// Search articles
function searchArticles(query) {
    const blogCards = document.querySelectorAll('.blog-card');
    const searchQuery = query.toLowerCase();
    let visibleCount = 0;
    
    blogCards.forEach(card => {
        const title = card.querySelector('.blog-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
        const category = card.querySelector('.article-category').textContent.toLowerCase();
        
        if (title.includes(searchQuery) || excerpt.includes(searchQuery) || category.includes(searchQuery)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
    
    return visibleCount;
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('blog-search');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                if (query.length >= 2) {
                    const results = searchArticles(query);
                    updateSearchResults(results, query);
                } else if (query.length === 0) {
                    // Show all articles
                    const blogCards = document.querySelectorAll('.blog-card');
                    blogCards.forEach(card => {
                        card.style.display = 'block';
                        card.classList.add('fade-in');
                    });
                    updateSearchResults(blogCards.length, '');
                }
            }, 300);
        });
    }
}

// Update search results display
function updateSearchResults(count, query) {
    const resultsElement = document.getElementById('search-results');
    if (resultsElement) {
        if (query) {
            resultsElement.textContent = `${count} article${count !== 1 ? 's' : ''} found for "${query}"`;
        } else {
            resultsElement.textContent = '';
        }
    }
}

// Load more articles (pagination simulation)
function loadMoreArticles() {
    // This would typically load more articles from a server
    // For now, we'll simulate loading more content
    showNotification('Loading more articles...', 'info');
    
    setTimeout(() => {
        showNotification('All articles loaded', 'success');
    }, 1000);
}

// Export functions for global access
window.trackReadingTime = trackReadingTime;
window.shareArticle = shareArticle;
window.bookmarkArticle = bookmarkArticle;
window.getBookmarkedArticles = getBookmarkedArticles;
window.searchArticles = searchArticles;
window.loadMoreArticles = loadMoreArticles;

// Add CSS for blog functionality
const blogStyles = `
    .blog-categories {
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
    
    .featured-article {
        padding: 4rem 0;
        background: white;
    }
    
    .featured-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;
    }
    
    .featured-image {
        position: relative;
        display: flex;
        height: 100%;
        border-radius: 15px;
        overflow: hidden;
    }
    
    .featured-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .featured-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .featured-title {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 2rem;
        line-height: 1.2;
    }
    
    .featured-excerpt {
        color: #666;
        margin-bottom: 2rem;
        line-height: 1.6;
        font-size: 1.1rem;
    }
    
    .featured-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .article-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: #666;
    }
    
    .blog-grid-section {
        padding: 4rem 0;
        background: #f8f9fa;
    }
    
    .blog-results {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .results-text {
        color: #666;
        font-size: 1rem;
        margin: 0;
        padding: 0.5rem 1rem;
        background: white;
        border-radius: 20px;
        display: inline-block;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .blog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }
    
    .blog-card {
        background: white;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .blog-card.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    .blog-image {
        height: 200px;
        overflow: hidden;
    }
    
    .blog-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .blog-card:hover .blog-img {
        transform: scale(1.05);
    }
    
    .article-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        align-items: center;
    }
    
    .article-category {
        background: #667eea;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .detail-category {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .article-date {
        color: #666;
    }
    
    .detail-date {
        color: white;
    }
    
    .blog-title {
        color: #2c3e50;
        margin-bottom: 1rem;
        line-height: 1.3;
        font-size: 1.2rem;
    }
    
    .blog-excerpt {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .blog-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }
    
    .blog-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
    }
    
    .blog-link:hover {
        color: #764ba2;
    }
    
    .newsletter-section {
        padding: 4rem 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    
    .newsletter-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: center;
    }
    
    .newsletter-title {
        color: white;
        margin-bottom: 1rem;
        font-size: 1.8rem;
    }
    
    .newsletter-subtitle {
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
    }
    
    .newsletter-signup {
        display: flex;
        gap: 1rem;
    }
    
    .newsletter-signup input {
        flex: 1;
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
    }
    
    .newsletter-signup input:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }

    .subscribe-button {
        background: white;
    }
    
    .newsletter-privacy {
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .blog-cta {
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
    
    .bookmark-btn {
        background: transparent;
        border: 1px solid #667eea;
        color: #667eea;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .bookmark-btn:hover {
        background: #667eea;
        color: white;
    }
    
    .bookmark-btn.bookmarked {
        background: #667eea;
        color: white;
    }
    
    .share-btn {
        background: transparent;
        border: 1px solid #666;
        color: #666;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .share-btn:hover {
        background: #666;
        color: white;
    }
    
    @media (max-width: 768px) {
        .featured-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .featured-title {
            font-size: 1.5rem;
        }
        
        .blog-grid {
            grid-template-columns: 1fr;
        }
        
        .newsletter-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
        }
        
        .newsletter-signup {
            flex-direction: column;
        }
        
        .categories-nav {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 1rem;
        }
        
        .category-btn {
            white-space: nowrap;
        }
    }
    
    /* Smooth transitions for filtered content */
    .blog-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .blog-card.fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject blog styles
const blogStyleSheet = document.createElement('style');
blogStyleSheet.textContent = blogStyles;
document.head.appendChild(blogStyleSheet);

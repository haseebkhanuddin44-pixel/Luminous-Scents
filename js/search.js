// ===== SEARCH FUNCTIONALITY =====

class SearchManager {
    constructor() {
        this.products = [];
        this.searchInput = null;
        this.suggestionsContainer = null;
        this.currentQuery = '';
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.maxSuggestions = 8;
        this.maxHistory = 10;
        
        this.init();
    }

    async init() {
        // Wait for products to be loaded
        if (window.products && window.products.length > 0) {
            this.products = window.products;
        } else {
            // Try to load products if not available
            try {
                const response = await fetch('data/products.json');
                const data = await response.json();
                this.products = data.products;
            } catch (error) {
                console.error('Error loading products for search:', error);
            }
        }

        this.initializeSearchElements();
        this.bindEvents();
    }

    initializeSearchElements() {
        this.searchInput = document.getElementById('searchInput');
        this.suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (!this.suggestionsContainer && this.searchInput) {
            // Create suggestions container if it doesn't exist
            this.suggestionsContainer = document.createElement('div');
            this.suggestionsContainer.id = 'searchSuggestions';
            this.suggestionsContainer.className = 'search-suggestions';
            this.searchInput.parentNode.appendChild(this.suggestionsContainer);
        }
    }

    bindEvents() {
        if (!this.searchInput) return;

        // Input event for real-time search
        this.searchInput.addEventListener('input', this.debounce((e) => {
            const query = e.target.value.trim();
            this.currentQuery = query;
            
            if (query.length >= 2) {
                this.showSuggestions(query);
            } else {
                this.hideSuggestions();
            }
        }, 300));

        // Focus event to show recent searches
        this.searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim().length === 0) {
                this.showRecentSearches();
            }
        });

        // Blur event to hide suggestions (with delay for clicks)
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        });

        // Enter key to perform search
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.currentQuery);
            }
        });

        // Click outside to hide suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    showSuggestions(query) {
        if (!this.suggestionsContainer) return;

        const suggestions = this.generateSuggestions(query);
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        let suggestionsHTML = '';
        
        suggestions.forEach(suggestion => {
            suggestionsHTML += this.createSuggestionHTML(suggestion, query);
        });

        this.suggestionsContainer.innerHTML = suggestionsHTML;
        this.suggestionsContainer.style.display = 'block';
    }

    generateSuggestions(query) {
        const suggestions = [];
        const queryLower = query.toLowerCase();

        // Product name matches
        const productMatches = this.products.filter(product => 
            product.title.toLowerCase().includes(queryLower)
        ).slice(0, 4);

        productMatches.forEach(product => {
            suggestions.push({
                type: 'product',
                title: product.title,
                subtitle: `$${product.price.toFixed(2)}`,
                image: product.images[0],
                url: `product.html?id=${product.id}`,
                data: product
            });
        });

        // Category matches
        const categories = ['Floral', 'Woody', 'Fresh', 'Gourmand', 'Oriental'];
        const categoryMatches = categories.filter(cat => 
            cat.toLowerCase().includes(queryLower)
        ).slice(0, 2);

        categoryMatches.forEach(category => {
            suggestions.push({
                type: 'category',
                title: `${category} Candles`,
                subtitle: 'Browse category',
                icon: 'bi-grid',
                url: `shop.html?fragrance=${category.toLowerCase()}`
            });
        });

        // Fragrance note matches
        const allNotes = [...new Set(this.products.flatMap(p => p.fragrance_notes))];
        const noteMatches = allNotes.filter(note => 
            note.toLowerCase().includes(queryLower)
        ).slice(0, 2);

        noteMatches.forEach(note => {
            suggestions.push({
                type: 'note',
                title: note,
                subtitle: 'Fragrance note',
                icon: 'bi-flower1',
                url: `shop.html?search=${encodeURIComponent(note)}`
            });
        });

        return suggestions.slice(0, this.maxSuggestions);
    }

    createSuggestionHTML(suggestion, query) {
        const highlightedTitle = this.highlightMatch(suggestion.title, query);
        
        if (suggestion.type === 'product') {
            return `
                <div class="search-suggestion" onclick="selectSuggestion('${suggestion.url}', '${suggestion.title}')">
                    <div class="d-flex align-items-center">
                        <img src="${suggestion.image}" alt="${suggestion.title}" 
                             style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" class="me-3">
                        <div>
                            <div class="fw-medium">${highlightedTitle}</div>
                            <small class="text-muted">${suggestion.subtitle}</small>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="search-suggestion" onclick="selectSuggestion('${suggestion.url}', '${suggestion.title}')">
                    <div class="d-flex align-items-center">
                        <i class="bi ${suggestion.icon} me-3 text-primary"></i>
                        <div>
                            <div class="fw-medium">${highlightedTitle}</div>
                            <small class="text-muted">${suggestion.subtitle}</small>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    showRecentSearches() {
        if (!this.suggestionsContainer || this.searchHistory.length === 0) return;

        let suggestionsHTML = '<div class="search-suggestion-header">Recent Searches</div>';
        
        this.searchHistory.slice(0, 5).forEach(search => {
            suggestionsHTML += `
                <div class="search-suggestion" onclick="selectRecentSearch('${search}')">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-clock-history me-3 text-muted"></i>
                            <span>${search}</span>
                        </div>
                        <button class="btn btn-link btn-sm p-0 text-muted" 
                                onclick="event.stopPropagation(); removeFromHistory('${search}')">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        this.suggestionsContainer.innerHTML = suggestionsHTML;
        this.suggestionsContainer.style.display = 'block';
    }

    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'none';
        }
    }

    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    performSearch(query) {
        if (!query.trim()) return;

        // Add to search history
        this.addToHistory(query);
        
        // Redirect to search results page
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }

    addToHistory(query) {
        // Remove if already exists
        const index = this.searchHistory.indexOf(query);
        if (index > -1) {
            this.searchHistory.splice(index, 1);
        }
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Limit history size
        this.searchHistory = this.searchHistory.slice(0, this.maxHistory);
        
        // Save to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    removeFromHistory(query) {
        const index = this.searchHistory.indexOf(query);
        if (index > -1) {
            this.searchHistory.splice(index, 1);
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
            this.showRecentSearches();
        }
    }

    clearHistory() {
        this.searchHistory = [];
        localStorage.removeItem('searchHistory');
        this.hideSuggestions();
    }

    // Search products based on query
    searchProducts(query, filters = {}) {
        if (!query && Object.keys(filters).length === 0) {
            return this.products;
        }

        let results = this.products;

        // Text search
        if (query) {
            const queryLower = query.toLowerCase();
            results = results.filter(product => {
                return (
                    product.title.toLowerCase().includes(queryLower) ||
                    product.description.toLowerCase().includes(queryLower) ||
                    product.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
                    product.fragrance_notes.some(note => note.toLowerCase().includes(queryLower)) ||
                    product.fragrance_family.toLowerCase().includes(queryLower)
                );
            });
        }

        // Apply filters
        if (filters.category) {
            results = results.filter(product => {
                if (filters.category === 'new') return product.new_arrival;
                if (filters.category === 'bestsellers') return product.featured;
                return product.category === filters.category;
            });
        }

        if (filters.fragrance) {
            results = results.filter(product => 
                product.fragrance_family === filters.fragrance
            );
        }

        if (filters.priceMin !== undefined) {
            results = results.filter(product => product.price >= filters.priceMin);
        }

        if (filters.priceMax !== undefined) {
            results = results.filter(product => product.price <= filters.priceMax);
        }

        if (filters.rating) {
            results = results.filter(product => product.rating >= filters.rating);
        }

        if (filters.inStock) {
            results = results.filter(product => product.stock > 0);
        }

        return results;
    }

    // Sort search results
    sortResults(results, sortBy = 'relevance') {
        switch (sortBy) {
            case 'price-low':
                return results.sort((a, b) => a.price - b.price);
            case 'price-high':
                return results.sort((a, b) => b.price - a.price);
            case 'rating':
                return results.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return results.sort((a, b) => b.new_arrival - a.new_arrival);
            case 'name':
                return results.sort((a, b) => a.title.localeCompare(b.title));
            default:
                // Relevance sorting (featured first, then by rating)
                return results.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.rating - a.rating;
                });
        }
    }

    // Get search suggestions for autocomplete
    getAutocompleteSuggestions(query, limit = 5) {
        const queryLower = query.toLowerCase();
        const suggestions = [];

        // Product titles
        this.products.forEach(product => {
            if (product.title.toLowerCase().includes(queryLower)) {
                suggestions.push(product.title);
            }
        });

        // Fragrance notes
        const allNotes = [...new Set(this.products.flatMap(p => p.fragrance_notes))];
        allNotes.forEach(note => {
            if (note.toLowerCase().includes(queryLower)) {
                suggestions.push(note);
            }
        });

        // Remove duplicates and limit
        return [...new Set(suggestions)].slice(0, limit);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global functions for suggestion interactions
function selectSuggestion(url, title) {
    // Add to search history
    searchManager.addToHistory(title);
    
    // Navigate to URL
    window.location.href = url;
}

function selectRecentSearch(query) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = query;
        searchManager.performSearch(query);
    }
}

function removeFromHistory(query) {
    searchManager.removeFromHistory(query);
}

// Search results page functionality
function initializeSearchResultsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const category = urlParams.get('category') || '';
    const fragrance = urlParams.get('fragrance') || '';
    
    if (!query && !category && !fragrance) return;

    // Update search input with query
    const searchInput = document.getElementById('searchInput');
    if (searchInput && query) {
        searchInput.value = query;
    }

    // Perform search and display results
    const filters = {};
    if (category) filters.category = category;
    if (fragrance) filters.fragrance = fragrance;

    const results = searchManager.searchProducts(query, filters);
    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('searchResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!resultsContainer) return;

    // Update results count
    if (resultsCount) {
        const countText = results.length === 1 ? '1 result' : `${results.length} results`;
        resultsCount.textContent = query ? 
            `${countText} for "${query}"` : 
            `${countText} found`;
    }

    // Display results
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h3 class="mt-3">No results found</h3>
                <p class="text-muted">Try adjusting your search terms or browse our categories.</p>
                <a href="shop.html" class="btn btn-primary">Browse All Products</a>
            </div>
        `;
        return;
    }

    let resultsHTML = '<div class="row">';
    results.forEach(product => {
        resultsHTML += `
            <div class="col-lg-3 col-md-6 mb-4">
                ${createProductCard(product).innerHTML}
            </div>
        `;
    });
    resultsHTML += '</div>';

    resultsContainer.innerHTML = resultsHTML;
}

// Initialize search manager
let searchManager;

document.addEventListener('DOMContentLoaded', function() {
    searchManager = new SearchManager();
    
    // Initialize search results page if we're on it
    if (window.location.pathname.includes('search.html')) {
        // Wait for products to load
        setTimeout(initializeSearchResultsPage, 500);
    }
});

// Export for global access
window.searchManager = searchManager;
window.selectSuggestion = selectSuggestion;
window.selectRecentSearch = selectRecentSearch;
window.removeFromHistory = removeFromHistory;

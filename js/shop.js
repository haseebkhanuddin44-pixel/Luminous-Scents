// ===== SHOP PAGE FUNCTIONALITY =====

class ShopManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.displayedProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentFilters = {
            categories: [],
            fragrances: [],
            rating: 0,
            inStock: false
        };
        this.currentSort = 'featured';
        
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.initializeFilters();
            this.bindEvents();
            this.applyUrlFilters();
            this.filterAndDisplayProducts();
        } catch (error) {
            console.error('Error initializing shop:', error);
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            this.products = data.products;
            this.filteredProducts = [...this.products];
            console.log('Shop: Products loaded from JSON:', this.products.length);
        } catch (error) {
            console.error('Shop: Error loading products from JSON:', error);
            console.log('Shop: Loading fallback products...');
            
            // Use the same fallback products as app.js
            if (window.products && window.products.length > 0) {
                this.products = window.products;
            } else {
                this.products = this.getFallbackProducts();
            }
            this.filteredProducts = [...this.products];
            console.log('Shop: Fallback products loaded:', this.products.length);
        }
    }

    // Fallback products data (same as app.js)
    getFallbackProducts() {
        // Use the same fallback function as app.js
        if (window.getFallbackProducts) {
            return window.getFallbackProducts();
        }
        
        // If window function not available, return the products directly
        return window.products || [];
    }

    initializeFilters() {
        this.populateCategoryFilters();
        this.populateFragranceFilters();
    }

    populateCategoryFilters() {
        const container = document.getElementById('categoryFilters');
        const mobileContainer = document.getElementById('categoryFiltersMobile');
        
        const categories = [
            { id: 'all', name: 'All Candles', count: this.products.length },
            { id: 'new', name: 'New Arrivals', count: this.products.filter(p => p.new_arrival).length },
            { id: 'bestsellers', name: 'Best Sellers', count: this.products.filter(p => p.featured).length }
        ];

        let html = '';
        let mobileHtml = '';
        
        categories.forEach(category => {
            // Desktop version
            html += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="cat-${category.id}" 
                           value="${category.id}" onchange="shopManager.updateCategoryFilter('${category.id}', this.checked)">
                    <label class="form-check-label" for="cat-${category.id}">
                        ${category.name} (${category.count})
                    </label>
                </div>
            `;
            
            // Mobile version with different IDs
            mobileHtml += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="cat-${category.id}-mobile" 
                           value="${category.id}" onchange="shopManager.updateCategoryFilter('${category.id}', this.checked)">
                    <label class="form-check-label" for="cat-${category.id}-mobile">
                        ${category.name} (${category.count})
                    </label>
                </div>
            `;
        });

        if (container) container.innerHTML = html;
        if (mobileContainer) mobileContainer.innerHTML = mobileHtml;
    }

    populateFragranceFilters() {
        const container = document.getElementById('fragranceFilters');
        const mobileContainer = document.getElementById('fragranceFiltersMobile');

        const fragrances = [...new Set(this.products.map(p => p.fragrance_family))];
        const fragranceCounts = {};
        
        fragrances.forEach(fragrance => {
            fragranceCounts[fragrance] = this.products.filter(p => p.fragrance_family === fragrance).length;
        });

        let html = '';
        let mobileHtml = '';
        
        fragrances.forEach(fragrance => {
            const displayName = fragrance.charAt(0).toUpperCase() + fragrance.slice(1);
            
            // Desktop version
            html += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="frag-${fragrance}" 
                           value="${fragrance}" onchange="shopManager.updateFragranceFilter('${fragrance}', this.checked)">
                    <label class="form-check-label" for="frag-${fragrance}">
                        ${displayName} (${fragranceCounts[fragrance]})
                    </label>
                </div>
            `;
            
            // Mobile version with different IDs
            mobileHtml += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="frag-${fragrance}-mobile" 
                           value="${fragrance}" onchange="shopManager.updateFragranceFilter('${fragrance}', this.checked)">
                    <label class="form-check-label" for="frag-${fragrance}-mobile">
                        ${displayName} (${fragranceCounts[fragrance]})
                    </label>
                </div>
            `;
        });

        if (container) container.innerHTML = html;
        if (mobileContainer) mobileContainer.innerHTML = mobileHtml;
    }


    bindEvents() {
        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.filterAndDisplayProducts();
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }
    }

    applyUrlFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Category filter
        const category = urlParams.get('category');
        if (category) {
            this.currentFilters.categories = [category];
            const checkbox = document.getElementById(`cat-${category}`);
            if (checkbox) checkbox.checked = true;
        }

        // Fragrance filter
        const fragrance = urlParams.get('fragrance');
        if (fragrance) {
            this.currentFilters.fragrances = [fragrance];
            const checkbox = document.getElementById(`frag-${fragrance}`);
            if (checkbox) checkbox.checked = true;
        }

        // Search query
        const search = urlParams.get('search');
        if (search) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = search;
            this.currentFilters.search = search;
        }
    }

    updateCategoryFilter(category, checked) {
        if (checked) {
            if (!this.currentFilters.categories.includes(category)) {
                this.currentFilters.categories.push(category);
            }
        } else {
            this.currentFilters.categories = this.currentFilters.categories.filter(c => c !== category);
        }
        
        // Sync desktop and mobile checkboxes
        this.syncCategoryFilters(category, checked);
        
        this.filterAndDisplayProducts();
    }
    
    syncCategoryFilters(category, checked) {
        const desktopCheckbox = document.getElementById(`cat-${category}`);
        const mobileCheckbox = document.getElementById(`cat-${category}-mobile`);
        
        if (desktopCheckbox) desktopCheckbox.checked = checked;
        if (mobileCheckbox) mobileCheckbox.checked = checked;
    }

    updateFragranceFilter(fragrance, checked) {
        if (checked) {
            if (!this.currentFilters.fragrances.includes(fragrance)) {
                this.currentFilters.fragrances.push(fragrance);
            }
        } else {
            this.currentFilters.fragrances = this.currentFilters.fragrances.filter(f => f !== fragrance);
        }
        
        // Sync desktop and mobile checkboxes
        this.syncFragranceFilters(fragrance, checked);
        
        this.filterAndDisplayProducts();
    }
    
    syncFragranceFilters(fragrance, checked) {
        const desktopCheckbox = document.getElementById(`frag-${fragrance}`);
        const mobileCheckbox = document.getElementById(`frag-${fragrance}-mobile`);
        
        if (desktopCheckbox) desktopCheckbox.checked = checked;
        if (mobileCheckbox) mobileCheckbox.checked = checked;
    }

    filterProducts() {
        let filtered = [...this.products];

        // Text search
        if (this.currentFilters.search) {
            const query = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.fragrance_notes.some(note => note.toLowerCase().includes(query)) ||
                product.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Category filters
        if (this.currentFilters.categories.length > 0) {
            filtered = filtered.filter(product => {
                return this.currentFilters.categories.some(category => {
                    if (category === 'all') return true;
                    if (category === 'new') return product.new_arrival;
                    if (category === 'bestsellers') return product.featured;
                    return product.category === category;
                });
            });
        }

        // Fragrance filters
        if (this.currentFilters.fragrances.length > 0) {
            filtered = filtered.filter(product => 
                this.currentFilters.fragrances.includes(product.fragrance_family)
            );
        }

        // Price filter removed for cleaner interface

        // Rating filter
        if (this.currentFilters.rating > 0) {
            filtered = filtered.filter(product => product.rating >= this.currentFilters.rating);
        }

        // Stock filter
        if (this.currentFilters.inStock) {
            filtered = filtered.filter(product => product.stock > 0);
        }

        return filtered;
    }

    sortProducts(products) {
        const sorted = [...products];
        
        switch (this.currentSort) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => b.new_arrival - a.new_arrival);
            case 'name':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            default: // featured
                return sorted.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.rating - a.rating;
                });
        }
    }

    filterAndDisplayProducts() {
        // Filter products
        this.filteredProducts = this.filterProducts();
        
        // Sort products
        this.filteredProducts = this.sortProducts(this.filteredProducts);
        
        // Reset pagination
        this.currentPage = 1;
        this.displayedProducts = [];
        
        // Display products
        this.displayProducts();
        
        // Update results count
        this.updateResultsCount();
    }

    displayProducts() {
        const container = document.getElementById('productsGrid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        console.log('Shop: displayProducts called');
        console.log('Shop: productsGrid container found:', !!container);
        console.log('Shop: filteredProducts length:', this.filteredProducts.length);
        
        if (!container) {
            console.error('Shop: productsGrid container not found!');
            return;
        }

        // Calculate products to show
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        // Add to displayed products
        this.displayedProducts = this.displayedProducts.concat(productsToShow);
        
        // Clear container if first page
        if (this.currentPage === 1) {
            container.innerHTML = '';
        }
        
        // Add products to container
        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });
        
        // Show/hide load more button
        if (loadMoreBtn) {
            const hasMore = endIndex < this.filteredProducts.length;
            loadMoreBtn.style.display = hasMore ? 'block' : 'none';
        }
        
        // Add animation to new products
        const newCards = container.querySelectorAll('.product-card:not(.animated)');
        newCards.forEach((card, index) => {
            card.classList.add('animated');
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    createProductCard(product) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';
        
        const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
        const isNew = product.new_arrival;
        const isInWishlist = window.wishlist && window.wishlist.some(item => item.id === product.id);
        
        col.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
                    ${isOnSale ? '<span class="product-badge">Sale</span>' : ''}
                    ${isNew ? '<span class="product-badge" style="background: var(--success);">New</span>' : ''}
                    <div class="product-actions">
                        <button class="product-action" onclick="toggleWishlist(${product.id})" aria-label="Add to wishlist">
                            <i class="bi ${isInWishlist ? 'bi-heart-fill' : 'bi-heart'}"></i>
                        </button>
                        <button class="product-action" onclick="quickView(${product.id})" aria-label="Quick view">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-content">
                    <h3 class="product-title">
                        <a href="product.html?id=${product.id}" class="text-decoration-none">${product.title}</a>
                    </h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="price-current">$${product.price.toFixed(2)}</span>
                        ${isOnSale ? `<span class="price-original">$${product.compare_at_price.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.review_count})</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        return col;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="bi bi-star-fill star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="bi bi-star-half star"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="bi bi-star star empty"></i>';
        }
        
        return starsHTML;
    }

    loadMoreProducts() {
        this.currentPage++;
        this.displayProducts();
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (!resultsCount) return;
        
        const total = this.filteredProducts.length;
        const displayed = this.displayedProducts.length;
        
        if (total === 0) {
            resultsCount.textContent = 'No products found';
        } else if (displayed === total) {
            resultsCount.textContent = `Showing all ${total} products`;
        } else {
            resultsCount.textContent = `Showing ${displayed} of ${total} products`;
        }
    }

    clearAllFilters() {
        // Reset filters
        this.currentFilters = {
            categories: [],
            fragrances: [],
            rating: 0,
            inStock: false,
            search: ''
        };
        
        // Reset UI
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Price range removed for cleaner interface
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Update URL
        const url = new URL(window.location);
        url.search = '';
        window.history.replaceState({}, '', url);
        
        // Refresh display
        this.filterAndDisplayProducts();
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

// Global functions
function clearAllFilters() {
    if (window.shopManager) {
        window.shopManager.clearAllFilters();
    }
}

// Initialize shop manager
let shopManager;

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('shop.html')) {
        shopManager = new ShopManager();
        window.shopManager = shopManager;
    }
});

// Export for global access
window.clearAllFilters = clearAllFilters;

// Test function for mobile filters
window.testMobileFilters = function() {
    console.log('Testing mobile filter functionality...');
    
    // Check if mobile filter containers exist
    const categoryMobile = document.getElementById('categoryFiltersMobile');
    const fragranceMobile = document.getElementById('fragranceFiltersMobile');
    const filtersOffcanvas = document.getElementById('filtersOffcanvas');
    
    console.log('Mobile category filters:', categoryMobile);
    console.log('Mobile fragrance filters:', fragranceMobile);
    console.log('Filters offcanvas:', filtersOffcanvas);
    
    // Test opening the offcanvas
    if (filtersOffcanvas && typeof bootstrap !== 'undefined') {
        const offcanvas = new bootstrap.Offcanvas(filtersOffcanvas);
        offcanvas.show();
        console.log('Mobile filters offcanvas opened');
    } else {
        console.log('Bootstrap offcanvas not available or element not found');
    }
};

// ===== MAIN APPLICATION JAVASCRIPT =====

// Global variables
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize preloader
    initializePreloader();
    
    // Load products
    loadProducts();
    
    // Initialize cart and wishlist
    loadCart();
    loadWishlist();
    
    // Initialize UI components
    initializeSearch();
    initializeNewsletterForm();
    
    // Delay header initialization to ensure DOM is fully ready
    setTimeout(() => {
        console.log('Initializing header...');
        initializeHeader();
    }, 100);
    
    // Show cookie banner if not accepted
    showCookieBanner();
    
    // Initialize featured products on homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        displayFeaturedProducts();
    }
    
    console.log('App initialized successfully');
});

// ===== PREMIUM PRELOADER FUNCTIONALITY =====
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    // Start percentage counter
    animatePercentage();
    
    // Simulate loading time with minimum display duration
    const minLoadTime = 3500; // 3.5 seconds minimum for premium experience
    const startTime = Date.now();
    
    // Wait for all resources to load
    window.addEventListener('load', function() {
        const loadTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - loadTime);
        
        setTimeout(() => {
            hidePreloader();
        }, remainingTime);
    });
    
    // Fallback: hide preloader after maximum time
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            hidePreloader();
        }
    }, 6000); // 6 seconds maximum
}

function animatePercentage() {
    const percentageElement = document.querySelector('.progress-percentage');
    if (!percentageElement) return;
    
    let percentage = 0;
    const duration = 3000; // 3 seconds
    const increment = 100 / (duration / 50); // Update every 50ms
    
    const timer = setInterval(() => {
        percentage += increment;
        if (percentage >= 100) {
            percentage = 100;
            clearInterval(timer);
        }
        percentageElement.textContent = Math.round(percentage) + '%';
    }, 50);
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        
        // Remove from DOM after transition
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 800);
    }
}

// Load Products Data
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        products = data.products;
        console.log('Products loaded from JSON:', products.length);
        return products;
    } catch (error) {
        console.error('Error loading products from JSON:', error);
        console.log('Loading fallback products...');
        
        // Fallback products data for when JSON can't be loaded (file:// protocol)
        products = getFallbackProducts();
        console.log('Fallback products loaded:', products.length);
        return products;
    }
}

// Fallback products data
function getFallbackProducts() {
    return [
        {
            id: 1,
            title: "Autumn Spice",
            slug: "autumn-spice",
            description: "A warm blend of cinnamon, nutmeg, and vanilla that captures the essence of fall.",
            price: 32.00,
            compare_at_price: null,
            rating: 4.8,
            review_count: 127,
            images: [
                "https://yankeecandle.imgix.net/9aed2c71-1b87-3089-bcdd-8aab41698fd4/9aed2c71-1b87-3089-bcdd-8aab41698fd4.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/9aed2c71-1b87-3089-bcdd-8aab41698fd4/9aed2c71-1b87-3089-bcdd-8aab41698fd4.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/9aed2c71-1b87-3089-bcdd-8aab41698fd4/9aed2c71-1b87-3089-bcdd-8aab41698fd4.tif?auto=format,compress&w=1188"
            ],
            tags: ["bestseller", "seasonal", "warm"],
            category: "candles",
            fragrance_family: "woody",
            fragrance_notes: ["Cinnamon", "Nutmeg", "Vanilla", "Clove"],
            size_options: [
                {"size": "Small (6 oz)", "price": 32.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 48.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 68.00, "burn_time": "90-95 hours"}
            ],
            stock: 45,
            featured: true,
            new_arrival: false
        },
        {
            id: 2,
            title: "Ocean Breeze",
            slug: "ocean-breeze",
            description: "Fresh and invigorating scent reminiscent of coastal mornings with sea salt and driftwood.",
            price: 36.00,
            compare_at_price: 42.00,
            rating: 4.6,
            review_count: 89,
            images: [
                "https://yankeecandle.imgix.net/9d926164-e036-3ff9-b29f-4e6b1b375ff7/9d926164-e036-3ff9-b29f-4e6b1b375ff7.jpeg?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/9d926164-e036-3ff9-b29f-4e6b1b375ff7/9d926164-e036-3ff9-b29f-4e6b1b375ff7.jpeg?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/9d926164-e036-3ff9-b29f-4e6b1b375ff7/9d926164-e036-3ff9-b29f-4e6b1b375ff7.jpeg?auto=format,compress&w=1188"
            ],
            tags: ["fresh", "summer", "coastal"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Sea Salt", "Driftwood", "Ocean Mist", "White Tea"],
            size_options: [
                {"size": "Small (6 oz)", "price": 36.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 52.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 72.00, "burn_time": "90-95 hours"}
            ],
            stock: 23,
            featured: true,
            new_arrival: false
        },
        {
            id: 3,
            title: "Lavender Dreams",
            slug: "lavender-dreams",
            description: "Calming lavender with hints of chamomile and soft musk for ultimate relaxation.",
            price: 34.00,
            compare_at_price: null,
            rating: 4.9,
            review_count: 203,
            images: [
                "https://yankeecandle.imgix.net/5b44d9d8-2f9f-3e99-b068-910a201c930a/5b44d9d8-2f9f-3e99-b068-910a201c930a.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/5b44d9d8-2f9f-3e99-b068-910a201c930a/5b44d9d8-2f9f-3e99-b068-910a201c930a.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/5b44d9d8-2f9f-3e99-b068-910a201c930a/5b44d9d8-2f9f-3e99-b068-910a201c930a.tif?auto=format,compress&w=1188"
            ],
            tags: ["bestseller", "relaxing", "floral"],
            category: "candles",
            fragrance_family: "floral",
            fragrance_notes: ["French Lavender", "Chamomile", "Soft Musk", "Bergamot"],
            size_options: [
                {"size": "Small (6 oz)", "price": 34.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 50.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 70.00, "burn_time": "90-95 hours"}
            ],
            stock: 67,
            featured: true,
            new_arrival: false
        },
        {
            id: 4,
            title: "Vanilla Bourbon",
            slug: "vanilla-bourbon",
            description: "Rich vanilla bean with warm bourbon and caramel undertones for a luxurious experience.",
            price: 38.00,
            compare_at_price: null,
            rating: 4.7,
            review_count: 156,
            images: [
                "https://yankeecandle.imgix.net/6d7c706b-85c6-33b4-bd7a-b3586e901ca3/6d7c706b-85c6-33b4-bd7a-b3586e901ca3.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/6d7c706b-85c6-33b4-bd7a-b3586e901ca3/6d7c706b-85c6-33b4-bd7a-b3586e901ca3.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/6d7c706b-85c6-33b4-bd7a-b3586e901ca3/6d7c706b-85c6-33b4-bd7a-b3586e901ca3.tif?auto=format,compress&w=1188"
            ],
            tags: ["luxury", "warm", "sweet"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Madagascar Vanilla", "Bourbon", "Caramel", "Sandalwood"],
            size_options: [
                {"size": "Small (6 oz)", "price": 38.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 54.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 74.00, "burn_time": "90-95 hours"}
            ],
            stock: 34,
            featured: true,
            new_arrival: true
        },
        {
            id: 5,
            title: "Cedar & Sage",
            slug: "cedar-sage",
            description: "Earthy cedar wood balanced with fresh sage and eucalyptus for a grounding experience.",
            price: 35.00,
            compare_at_price: null,
            rating: 4.5,
            review_count: 78,
            images: [
                "https://yankeecandle.imgix.net/0613c231-039c-3018-9c85-ad640465cd27/0613c231-039c-3018-9c85-ad640465cd27.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/0613c231-039c-3018-9c85-ad640465cd27/0613c231-039c-3018-9c85-ad640465cd27.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/0613c231-039c-3018-9c85-ad640465cd27/0613c231-039c-3018-9c85-ad640465cd27.tif?auto=format,compress&w=1188"
            ],
            tags: ["earthy", "unisex", "natural"],
            category: "candles",
            fragrance_family: "woody",
            fragrance_notes: ["Cedar Wood", "White Sage", "Eucalyptus", "Pine"],
            size_options: [
                {"size": "Small (6 oz)", "price": 35.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 51.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 71.00, "burn_time": "90-95 hours"}
            ],
            stock: 56,
            featured: true,
            new_arrival: true
        },
        {
            id: 6,
            title: "Rose Garden",
            slug: "rose-garden",
            description: "Elegant blend of fresh roses with peony and a touch of green leaves.",
            price: 40.00,
            compare_at_price: 45.00,
            rating: 4.8,
            review_count: 134,
            images: [
                "https://yankeecandle.imgix.net/b8d603d3-cbc5-363e-a708-b8af6d516750/b8d603d3-cbc5-363e-a708-b8af6d516750.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/b8d603d3-cbc5-363e-a708-b8af6d516750/b8d603d3-cbc5-363e-a708-b8af6d516750.tif?auto=format,compress&w=1188",
                "https://yankeecandle.imgix.net/b8d603d3-cbc5-363e-a708-b8af6d516750/b8d603d3-cbc5-363e-a708-b8af6d516750.tif?auto=format,compress&w=1188"
            ],
            tags: ["floral", "elegant", "romantic"],
            category: "candles",
            fragrance_family: "floral",
            fragrance_notes: ["Damask Rose", "Peony", "Green Leaves", "White Musk"],
            size_options: [
                {"size": "Small (6 oz)", "price": 40.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 56.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 76.00, "burn_time": "90-95 hours"}
            ],
            stock: 29,
            featured: true,
            new_arrival: false
        },
        {
            id: 7,
            title: "Citrus Burst",
            slug: "citrus-burst",
            description: "Energizing blend of grapefruit, lemon, and orange with a hint of mint.",
            price: 33.00,
            compare_at_price: null,
            rating: 4.4,
            review_count: 92,
            images: [
                "https://yankeecandle.imgix.net/3a061acc-8e20-3eec-9528-ce7b205c62ea/3a061acc-8e20-3eec-9528-ce7b205c62ea.jpeg?fm=jpg",
                "https://yankeecandle.imgix.net/3a061acc-8e20-3eec-9528-ce7b205c62ea/3a061acc-8e20-3eec-9528-ce7b205c62ea.jpeg?fm=jpg",
                "https://yankeecandle.imgix.net/3a061acc-8e20-3eec-9528-ce7b205c62ea/3a061acc-8e20-3eec-9528-ce7b205c62ea.jpeg?fm=jpg"
            ],
            tags: ["energizing", "fresh", "citrus"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Pink Grapefruit", "Meyer Lemon", "Sweet Orange", "Fresh Mint"],
            size_options: [
                {"size": "Small (6 oz)", "price": 33.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 49.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 69.00, "burn_time": "90-95 hours"}
            ],
            stock: 41,
            featured: true,
            new_arrival: true
        },
        {
            id: 8,
            title: "Warm Amber",
            slug: "warm-amber",
            description: "Luxurious amber with sandalwood and patchouli for a sophisticated atmosphere.",
            price: 41.00,
            compare_at_price: 46.00,
            rating: 4.8,
            review_count: 142,
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjBCpDmVqFx7RgJSNewNJ7zqO__dTn0F9EFw&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjBCpDmVqFx7RgJSNewNJ7zqO__dTn0F9EFw&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjBCpDmVqFx7RgJSNewNJ7zqO__dTn0F9EFw&s"
            ],
            tags: ["luxury", "sophisticated", "warm"],
            category: "candles",
            fragrance_family: "oriental",
            fragrance_notes: ["Golden Amber", "Sandalwood", "Patchouli", "Vanilla"],
            size_options: [
                {"size": "Small (6 oz)", "price": 41.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 57.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 77.00, "burn_time": "90-95 hours"}
            ],
            stock: 31,
            featured: true,
            new_arrival: false
        },
        {
            id: 9,
            title: "Midnight Jasmine",
            slug: "midnight-jasmine",
            description: "Intoxicating jasmine blooms with hints of night-blooming cereus and soft musk.",
            price: 39.00,
            compare_at_price: null,
            rating: 4.7,
            review_count: 98,
            images: [
                "https://iperverde.it/cdn/shop/products/woodwick-candela-lavender-spa-ambientata.jpg?v=1608130605&width=1214",
                "https://iperverde.it/cdn/shop/products/woodwick-candela-lavender-spa-ambientata.jpg?v=1608130605&width=1214",
                "https://iperverde.it/cdn/shop/products/woodwick-candela-lavender-spa-ambientata.jpg?v=1608130605&width=1214"
            ],
            tags: ["floral", "evening", "romantic"],
            category: "candles",
            fragrance_family: "floral",
            fragrance_notes: ["Jasmine", "Night-blooming Cereus", "White Musk", "Moonflower"],
            size_options: [
                {"size": "Small (6 oz)", "price": 39.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 55.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 75.00, "burn_time": "90-95 hours"}
            ],
            stock: 22,
            featured: true,
            new_arrival: true
        },
        {
            id: 10,
            title: "Cozy Cabin",
            slug: "cozy-cabin",
            description: "Warm fireplace scent with cedar, pine, and a touch of smoky vanilla.",
            price: 37.00,
            compare_at_price: null,
            rating: 4.6,
            review_count: 156,
            images: [
                "https://iperverde.it/cdn/shop/products/woodwick-candela-vanilla-bean-insieme.jpg?v=1608030767&width=1214",
                "https://iperverde.it/cdn/shop/products/woodwick-candela-vanilla-bean-insieme.jpg?v=1608030767&width=1214",
                "https://iperverde.it/cdn/shop/products/woodwick-candela-vanilla-bean-insieme.jpg?v=1608030767&width=1214"
            ],
            tags: ["cozy", "winter", "woody"],
            category: "candles",
            fragrance_family: "woody",
            fragrance_notes: ["Cedar", "Pine", "Smoky Vanilla", "Firewood"],
            size_options: [
                {"size": "Small (6 oz)", "price": 37.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 53.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 73.00, "burn_time": "90-95 hours"}
            ],
            stock: 38,
            featured: false,
            new_arrival: false
        },
        {
            id: 11,
            title: "Tropical Paradise",
            slug: "tropical-paradise",
            description: "Escape to the tropics with coconut, pineapple, and tropical florals.",
            price: 35.00,
            compare_at_price: 40.00,
            rating: 4.4,
            review_count: 87,
            images: [
                "https://iperverde.it/cdn/shop/products/woodwick-candela-white-honey-ambientata.jpg?v=1608137911&width=1214",
                "https://iperverde.it/cdn/shop/products/woodwick-candela-white-honey-ambientata.jpg?v=1608137911&width=1214",
                "https://iperverde.it/cdn/shop/products/woodwick-candela-white-honey-ambientata.jpg?v=1608137911&width=1214"
            ],
            tags: ["tropical", "summer", "fruity"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Coconut", "Pineapple", "Hibiscus", "Ocean Breeze"],
            size_options: [
                {"size": "Small (6 oz)", "price": 35.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 51.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 71.00, "burn_time": "90-95 hours"}
            ],
            stock: 44,
            featured: false,
            new_arrival: true
        },
        {
            id: 12,
            title: "Spiced Apple Cider",
            slug: "spiced-apple-cider",
            description: "Warm apple cider with cinnamon, clove, and orange peel for autumn comfort.",
            price: 34.00,
            compare_at_price: null,
            rating: 4.8,
            review_count: 203,
            images: [
                "https://m.media-amazon.com/images/I/71OWRzUWaLL.jpg",
                "https://m.media-amazon.com/images/I/71OWRzUWaLL.jpg",
                "https://m.media-amazon.com/images/I/71OWRzUWaLL.jpg"
            ],
            tags: ["seasonal", "spicy", "autumn"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Apple Cider", "Cinnamon", "Clove", "Orange Peel"],
            size_options: [
                {"size": "Small (6 oz)", "price": 34.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 50.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 70.00, "burn_time": "90-95 hours"}
            ],
            stock: 52,
            featured: true,
            new_arrival: false
        },
        {
            id: 13,
            title: "Fresh Linen",
            slug: "fresh-linen",
            description: "Clean and crisp scent of freshly laundered linens with a hint of cotton blossom.",
            price: 32.00,
            compare_at_price: null,
            rating: 4.5,
            review_count: 124,
            images: [
                "https://nickelandore.ca/cdn/shop/products/IMG_3292.jpg?v=1707676528",
                "https://nickelandore.ca/cdn/shop/products/IMG_3292.jpg?v=1707676528",
                "https://nickelandore.ca/cdn/shop/products/IMG_3292.jpg?v=1707676528"
            ],
            tags: ["clean", "fresh", "cotton"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Fresh Linen", "Cotton Blossom", "White Tea", "Clean Air"],
            size_options: [
                {"size": "Small (6 oz)", "price": 32.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 48.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 68.00, "burn_time": "90-95 hours"}
            ],
            stock: 67,
            featured: false,
            new_arrival: false
        },
        {
            id: 14,
            title: "Black Cherry",
            slug: "black-cherry",
            description: "Rich black cherry with almond and vanilla undertones for a luxurious experience.",
            price: 38.00,
            compare_at_price: 43.00,
            rating: 4.7,
            review_count: 167,
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUgAVGTKFDT9QG6Ld5y29i2f3-ZbDLJcOZPQ&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUgAVGTKFDT9QG6Ld5y29i2f3-ZbDLJcOZPQ&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUgAVGTKFDT9QG6Ld5y29i2f3-ZbDLJcOZPQ&s"
            ],
            tags: ["fruity", "sweet", "luxury"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Black Cherry", "Sweet Almond", "Vanilla", "Tonka Bean"],
            size_options: [
                {"size": "Small (6 oz)", "price": 38.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 54.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 74.00, "burn_time": "90-95 hours"}
            ],
            stock: 29,
            featured: true,
            new_arrival: true
        },
        {
            id: 15,
            title: "Eucalyptus Mint",
            slug: "eucalyptus-mint",
            description: "Refreshing eucalyptus with spearmint and a touch of cooling menthol.",
            price: 33.00,
            compare_at_price: null,
            rating: 4.6,
            review_count: 95,
            images: [
                "https://www.rugsntimber.com.au/cdn/shop/products/ww92063-4_2400x.jpg?v=1676612252",
                "https://www.rugsntimber.com.au/cdn/shop/products/ww92063-4_2400x.jpg?v=1676612252",
                "https://www.rugsntimber.com.au/cdn/shop/products/ww92063-4_2400x.jpg?v=1676612252"
            ],
            tags: ["refreshing", "spa", "minty"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Eucalyptus", "Spearmint", "Menthol", "Green Tea"],
            size_options: [
                {"size": "Small (6 oz)", "price": 33.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 49.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 69.00, "burn_time": "90-95 hours"}
            ],
            stock: 41,
            featured: false,
            new_arrival: false
        },
        {
            id: 16,
            title: "Mahogany Teakwood",
            slug: "mahogany-teakwood",
            description: "Rich mahogany and teakwood with hints of dark cherry and oak.",
            price: 42.00,
            compare_at_price: null,
            rating: 4.9,
            review_count: 189,
            images: [
                "https://eadn-wc05-15571829.nxedge.io/cdn/media/catalog/product/cache/eec11dbd695aa5bc6b571a44e4419f5e/w/w/ww1707527_4.jpg",
                "https://eadn-wc05-15571829.nxedge.io/cdn/media/catalog/product/cache/eec11dbd695aa5bc6b571a44e4419f5e/w/w/ww1707527_4.jpg",
                "https://eadn-wc05-15571829.nxedge.io/cdn/media/catalog/product/cache/eec11dbd695aa5bc6b571a44e4419f5e/w/w/ww1707527_4.jpg"
            ],
            tags: ["masculine", "woody", "sophisticated"],
            category: "candles",
            fragrance_family: "woody",
            fragrance_notes: ["Mahogany", "Teakwood", "Dark Cherry", "Oak"],
            size_options: [
                {"size": "Small (6 oz)", "price": 42.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 58.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 78.00, "burn_time": "90-95 hours"}
            ],
            stock: 33,
            featured: true,
            new_arrival: false
        },
        {
            id: 17,
            title: "White Tea & Ginger",
            slug: "white-tea-ginger",
            description: "Serene white tea blended with warming ginger and subtle citrus notes.",
            price: 36.00,
            compare_at_price: null,
            rating: 4.6,
            review_count: 112,
            images: [
                "https://celebright.co.uk/cdn/shop/files/GlassHourglassDesign-ConsistentFragranceBliss.jpg?v=1695127525&width=1000",
                "https://celebright.co.uk/cdn/shop/files/GlassHourglassDesign-ConsistentFragranceBliss.jpg?v=1695127525&width=1000",
                "https://celebright.co.uk/cdn/shop/files/GlassHourglassDesign-ConsistentFragranceBliss.jpg?v=1695127525&width=1000"
            ],
            tags: ["zen", "spa", "calming"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["White Tea", "Fresh Ginger", "Lemon Zest", "Bamboo"],
            size_options: [
                {"size": "Small (6 oz)", "price": 36.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 52.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 72.00, "burn_time": "90-95 hours"}
            ],
            stock: 48,
            featured: false,
            new_arrival: true
        },
        {
            id: 18,
            title: "Pomegranate Noir",
            slug: "pomegranate-noir",
            description: "Dark and mysterious pomegranate with black currant and smoky incense.",
            price: 44.00,
            compare_at_price: 49.00,
            rating: 4.8,
            review_count: 178,
            images: [
                "https://media.kohlsimg.com/is/image/kohls/3750309_ALT?wid=400&hei=400&op_sharpen=1",
                "https://media.kohlsimg.com/is/image/kohls/3750309_ALT?wid=400&hei=400&op_sharpen=1",
                "https://media.kohlsimg.com/is/image/kohls/3750309_ALT?wid=400&hei=400&op_sharpen=1"
            ],
            tags: ["luxury", "mysterious", "evening"],
            category: "candles",
            fragrance_family: "oriental",
            fragrance_notes: ["Pomegranate", "Black Currant", "Smoky Incense", "Dark Plum"],
            size_options: [
                {"size": "Small (6 oz)", "price": 44.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 60.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 80.00, "burn_time": "90-95 hours"}
            ],
            stock: 26,
            featured: true,
            new_arrival: true
        },
        {
            id: 19,
            title: "Coconut Lime",
            slug: "coconut-lime",
            description: "Tropical coconut paired with zesty lime and a hint of sea breeze.",
            price: 33.00,
            compare_at_price: null,
            rating: 4.5,
            review_count: 143,
            images: [
                "https://karinyaflorist.com.au/wp-content/uploads/2018/04/Melon-Blossom-RANGE-Woodwick-Splosh-Pic.jpg",
                "https://karinyaflorist.com.au/wp-content/uploads/2018/04/Melon-Blossom-RANGE-Woodwick-Splosh-Pic.jpg",
                "https://karinyaflorist.com.au/wp-content/uploads/2018/04/Melon-Blossom-RANGE-Woodwick-Splosh-Pic.jpg"
            ],
            tags: ["tropical", "citrus", "summer"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Coconut Milk", "Key Lime", "Sea Breeze", "White Sand"],
            size_options: [
                {"size": "Small (6 oz)", "price": 33.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 49.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 69.00, "burn_time": "90-95 hours"}
            ],
            stock: 55,
            featured: false,
            new_arrival: false
        },
        {
            id: 20,
            title: "Leather & Tobacco",
            slug: "leather-tobacco",
            description: "Rich leather with warm tobacco leaves and hints of aged whiskey.",
            price: 45.00,
            compare_at_price: null,
            rating: 4.7,
            review_count: 134,
            images: [
                "https://mirandaschroeder.com/wp-content/uploads/2021/07/IMG_5596-1-768x1024.jpg",
                "https://mirandaschroeder.com/wp-content/uploads/2021/07/IMG_5596-1-768x1024.jpg",
                "https://mirandaschroeder.com/wp-content/uploads/2021/07/IMG_5596-1-768x1024.jpg"
            ],
            tags: ["masculine", "sophisticated", "luxury"],
            category: "candles",
            fragrance_family: "woody",
            fragrance_notes: ["Rich Leather", "Tobacco Leaves", "Aged Whiskey", "Cedar"],
            size_options: [
                {"size": "Small (6 oz)", "price": 45.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 61.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 81.00, "burn_time": "90-95 hours"}
            ],
            stock: 19,
            featured: true,
            new_arrival: false
        },
        {
            id: 21,
            title: "Peach Bellini",
            slug: "peach-bellini",
            description: "Juicy peach with sparkling champagne bubbles and white peach blossom.",
            price: 37.00,
            compare_at_price: 42.00,
            rating: 4.4,
            review_count: 98,
            images: [
                "https://homefrontgiftware.ie/cdn/shop/files/2654078e_0_1_1080x.jpg?v=1756841702",
                "https://homefrontgiftware.ie/cdn/shop/files/2654078e_0_1_1080x.jpg?v=1756841702",
                "https://homefrontgiftware.ie/cdn/shop/files/2654078e_0_1_1080x.jpg?v=1756841702"
            ],
            tags: ["fruity", "celebratory", "sweet"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Juicy Peach", "Champagne", "Peach Blossom", "Vanilla"],
            size_options: [
                {"size": "Small (6 oz)", "price": 37.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 53.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 73.00, "burn_time": "90-95 hours"}
            ],
            stock: 42,
            featured: false,
            new_arrival: true
        },
        {
            id: 22,
            title: "Bergamot & Sage",
            slug: "bergamot-sage",
            description: "Bright bergamot citrus balanced with earthy sage and white musk.",
            price: 35.00,
            compare_at_price: null,
            rating: 4.6,
            review_count: 156,
            images: [
                "https://www.harrodhorticultural.com/cache/product/350/350/medium-woodwick-scented-crackle-candles-1-2019128101.jpg",
                "https://www.harrodhorticultural.com/cache/product/350/350/medium-woodwick-scented-crackle-candles-1-2019128101.jpg",
                "https://www.harrodhorticultural.com/cache/product/350/350/medium-woodwick-scented-crackle-candles-1-2019128101.jpg"
            ],
            tags: ["citrus", "herbal", "unisex"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Bergamot", "Garden Sage", "White Musk", "Lemon Verbena"],
            size_options: [
                {"size": "Small (6 oz)", "price": 35.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 51.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 71.00, "burn_time": "90-95 hours"}
            ],
            stock: 61,
            featured: false,
            new_arrival: false
        },
        {
            id: 23,
            title: "Chocolate Truffle",
            slug: "chocolate-truffle",
            description: "Decadent dark chocolate with creamy truffle and a hint of espresso.",
            price: 39.00,
            compare_at_price: null,
            rating: 4.8,
            review_count: 201,
            images: [
                "https://www.bloemenrobberechtsshop.be/wp-content/uploads/2023/03/WoodWickCandles2.jpg",
                "https://www.bloemenrobberechtsshop.be/wp-content/uploads/2023/03/WoodWickCandles2.jpg",
                "https://www.bloemenrobberechtsshop.be/wp-content/uploads/2023/03/WoodWickCandles2.jpg"
            ],
            tags: ["indulgent", "dessert", "cozy"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Dark Chocolate", "Cream Truffle", "Espresso", "Cocoa"],
            size_options: [
                {"size": "Small (6 oz)", "price": 39.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 55.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 75.00, "burn_time": "90-95 hours"}
            ],
            stock: 37,
            featured: true,
            new_arrival: false
        },
        {
            id: 24,
            title: "Wild Fig & Cassis",
            slug: "wild-fig-cassis",
            description: "Mediterranean wild fig with black cassis and green leaves.",
            price: 41.00,
            compare_at_price: 46.00,
            rating: 4.7,
            review_count: 167,
            images: [
                "https://www.sheknows.com/wp-content/uploads/2023/10/woodwick-feature.jpg?w=1440",
                "https://www.sheknows.com/wp-content/uploads/2023/10/woodwick-feature.jpg?w=1440",
                "https://www.sheknows.com/wp-content/uploads/2023/10/woodwick-feature.jpg?w=1440"
            ],
            tags: ["mediterranean", "fruity", "elegant"],
            category: "candles",
            fragrance_family: "floral",
            fragrance_notes: ["Wild Fig", "Black Cassis", "Fig Leaves", "Green Stems"],
            size_options: [
                {"size": "Small (6 oz)", "price": 41.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 57.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 77.00, "burn_time": "90-95 hours"}
            ],
            stock: 28,
            featured: true,
            new_arrival: true
        },
        {
            id: 25,
            title: "Pine & Juniper",
            slug: "pine-juniper",
            description: "Fresh pine needles with juniper berries and crisp mountain air.",
            price: 34.00,
            compare_at_price: null,
            rating: 4.5,
            review_count: 89,
            images: [
                "https://www.foxandlantern.co.uk/wp-content/uploads/2020/05/WOODWICK-Pillar-Medium-Jar-Crimson-Berries1.jpg",
                "https://www.foxandlantern.co.uk/wp-content/uploads/2020/05/WOODWICK-Pillar-Medium-Jar-Crimson-Berries1.jpg",
                "https://www.foxandlantern.co.uk/wp-content/uploads/2020/05/WOODWICK-Pillar-Medium-Jar-Crimson-Berries1.jpg"
            ],
            tags: ["forest", "crisp", "winter"],
            category: "candles",
            fragrance_family: "woody",
            fragrance_notes: ["Pine Needles", "Juniper Berries", "Mountain Air", "Fir Balsam"],
            size_options: [
                {"size": "Small (6 oz)", "price": 34.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 50.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 70.00, "burn_time": "90-95 hours"}
            ],
            stock: 53,
            featured: false,
            new_arrival: false
        },
        {
            id: 26,
            title: "Honey Almond",
            slug: "honey-almond",
            description: "Golden honey with sweet almond and warm oat milk for comfort.",
            price: 36.00,
            compare_at_price: null,
            rating: 4.6,
            review_count: 145,
            images: [
                "https://i5.walmartimages.com/asr/b9bb47b6-3daa-43d5-90e0-0e71df8a33b5.02c8009ef763f75d6cd1e29ae1f2f6f5.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
                "https://i5.walmartimages.com/asr/b9bb47b6-3daa-43d5-90e0-0e71df8a33b5.02c8009ef763f75d6cd1e29ae1f2f6f5.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
                "https://i5.walmartimages.com/asr/b9bb47b6-3daa-43d5-90e0-0e71df8a33b5.02c8009ef763f75d6cd1e29ae1f2f6f5.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF"
            ],
            tags: ["sweet", "comforting", "warm"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Golden Honey", "Sweet Almond", "Oat Milk", "Vanilla Bean"],
            size_options: [
                {"size": "Small (6 oz)", "price": 36.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 52.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 72.00, "burn_time": "90-95 hours"}
            ],
            stock: 44,
            featured: false,
            new_arrival: true
        },
        {
            id: 27,
            title: "Gardenia Bloom",
            slug: "gardenia-bloom",
            description: "Intoxicating gardenia petals with white jasmine and soft powder.",
            price: 43.00,
            compare_at_price: null,
            rating: 4.9,
            review_count: 188,
            images: [
                "https://yankeecandle.imgix.net/d3ba253a-0c5c-32cc-a8b8-8889e7bac933/d3ba253a-0c5c-32cc-a8b8-8889e7bac933.jpeg?fm=jpg",
                "https://yankeecandle.imgix.net/d3ba253a-0c5c-32cc-a8b8-8889e7bac933/d3ba253a-0c5c-32cc-a8b8-8889e7bac933.jpeg?fm=jpg",
                "https://yankeecandle.imgix.net/d3ba253a-0c5c-32cc-a8b8-8889e7bac933/d3ba253a-0c5c-32cc-a8b8-8889e7bac933.jpeg?fm=jpg"
            ],
            tags: ["floral", "luxurious", "romantic"],
            category: "candles",
            fragrance_family: "floral",
            fragrance_notes: ["Gardenia Petals", "White Jasmine", "Soft Powder", "Creamy Musk"],
            size_options: [
                {"size": "Small (6 oz)", "price": 43.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 59.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 79.00, "burn_time": "90-95 hours"}
            ],
            stock: 31,
            featured: true,
            new_arrival: false
        },
        {
            id: 28,
            title: "Smoky Oud",
            slug: "smoky-oud",
            description: "Exotic oud wood with smoky incense and rich amber undertones.",
            price: 48.00,
            compare_at_price: 53.00,
            rating: 4.8,
            review_count: 156,
            images: [
                "https://media.4rgos.it/s/Argos/1234545_R_SET",
                "https://media.4rgos.it/s/Argos/1234545_R_SET",
                "https://media.4rgos.it/s/Argos/1234545_R_SET"
            ],
            tags: ["exotic", "luxury", "mysterious"],
            category: "candles",
            fragrance_family: "oriental",
            fragrance_notes: ["Oud Wood", "Smoky Incense", "Rich Amber", "Black Pepper"],
            size_options: [
                {"size": "Small (6 oz)", "price": 48.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 64.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 84.00, "burn_time": "90-95 hours"}
            ],
            stock: 22,
            featured: true,
            new_arrival: true
        },
        {
            id: 29,
            title: "Lemon Verbena",
            slug: "lemon-verbena",
            description: "Bright lemon verbena with fresh herbs and a touch of green tea.",
            price: 34.00,
            compare_at_price: null,
            rating: 4.5,
            review_count: 127,
            images: [
                "https://cookinglife.eu/cdn/shop/files/Sea-Salt-and-Vanilla_1.png?v=1726985167&width=1600",
                "https://cookinglife.eu/cdn/shop/files/Sea-Salt-and-Vanilla_1.png?v=1726985167&width=1600",
                "https://cookinglife.eu/cdn/shop/files/Sea-Salt-and-Vanilla_1.png?v=1726985167&width=1600"
            ],
            tags: ["herbal", "citrus", "energizing"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Lemon Verbena", "Fresh Herbs", "Green Tea", "Mint Leaves"],
            size_options: [
                {"size": "Small (6 oz)", "price": 34.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 50.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 70.00, "burn_time": "90-95 hours"}
            ],
            stock: 58,
            featured: false,
            new_arrival: true
        },
        {
            id: 30,
            title: "Cashmere Woods",
            slug: "cashmere-woods",
            description: "Soft cashmere with warm woods and a hint of vanilla musk.",
            price: 40.00,
            compare_at_price: 45.00,
            rating: 4.7,
            review_count: 165,
            images: [
                "https://formadore.com/woodwick/woodwick-woodwick-core-candle-rouge-oud__199076_825b4f0-imgm.jpg",
                "https://formadore.com/woodwick/woodwick-woodwick-core-candle-rouge-oud__199076_825b4f0-imgm.jpg",
                "https://formadore.com/woodwick/woodwick-woodwick-core-candle-rouge-oud__199076_825b4f0-imgm.jpg"
            ],
            tags: ["cozy", "luxurious", "warm"],
            category: "candles",
            fragrance_family: "woody",
            fragrance_notes: ["Cashmere", "Warm Woods", "Vanilla Musk", "Soft Amber"],
            size_options: [
                {"size": "Small (6 oz)", "price": 40.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 56.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 76.00, "burn_time": "90-95 hours"}
            ],
            stock: 35,
            featured: true,
            new_arrival: false
        },
        {
            id: 31,
            title: "Strawberry Rhubarb",
            slug: "strawberry-rhubarb",
            description: "Sweet strawberries with tart rhubarb and a hint of vanilla cream.",
            price: 35.00,
            compare_at_price: null,
            rating: 4.4,
            review_count: 89,
            images: [
                "https://luxefurniture.ca/cdn/shop/files/Pumpkin_Praline_Life_1050x700.jpg?v=1732336987",
                "https://luxefurniture.ca/cdn/shop/files/Pumpkin_Praline_Life_1050x700.jpg?v=1732336987",
                "https://luxefurniture.ca/cdn/shop/files/Pumpkin_Praline_Life_1050x700.jpg?v=1732336987"
            ],
            tags: ["fruity", "sweet", "summer"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Fresh Strawberry", "Tart Rhubarb", "Vanilla Cream", "Sugar"],
            size_options: [
                {"size": "Small (6 oz)", "price": 35.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 51.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 71.00, "burn_time": "90-95 hours"}
            ],
            stock: 47,
            featured: false,
            new_arrival: true
        },
        {
            id: 32,
            title: "Sandalwood Rose",
            slug: "sandalwood-rose",
            description: "Creamy sandalwood paired with delicate rose petals and soft musk.",
            price: 42.00,
            compare_at_price: null,
            rating: 4.8,
            review_count: 192,
            images: [
                "https://candlesdirect.com/cdn/shop/products/Wood-Wick-1720904E-02.jpg?v=1739442902&width=1000",
                "https://candlesdirect.com/cdn/shop/products/Wood-Wick-1720904E-02.jpg?v=1739442902&width=1000",
                "https://candlesdirect.com/cdn/shop/products/Wood-Wick-1720904E-02.jpg?v=1739442902&width=1000"
            ],
            tags: ["floral", "woody", "romantic"],
            category: "candles",
            fragrance_family: "floral",
            fragrance_notes: ["Creamy Sandalwood", "Rose Petals", "Soft Musk", "White Tea"],
            size_options: [
                {"size": "Small (6 oz)", "price": 42.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 58.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 78.00, "burn_time": "90-95 hours"}
            ],
            stock: 29,
            featured: true,
            new_arrival: false
        },
        {
            id: 33,
            title: "Sea Salt Caramel",
            slug: "sea-salt-caramel",
            description: "Rich caramel with a hint of sea salt and creamy vanilla.",
            price: 38.00,
            compare_at_price: 43.00,
            rating: 4.6,
            review_count: 174,
            images: [
                "https://www.fnp.qa/cdn/shop/files/woodwick-ellipse-jar-evening-onyx_1_f9410176-b25f-4657-93da-08f9d35dca18.jpg?format=webp&v=1750496086&width=420",
                "https://www.fnp.qa/cdn/shop/files/woodwick-ellipse-jar-evening-onyx_1_f9410176-b25f-4657-93da-08f9d35dca18.jpg?format=webp&v=1750496086&width=420",
                "https://www.fnp.qa/cdn/shop/files/woodwick-ellipse-jar-evening-onyx_1_f9410176-b25f-4657-93da-08f9d35dca18.jpg?format=webp&v=1750496086&width=420"
            ],
            tags: ["sweet", "indulgent", "cozy"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Rich Caramel", "Sea Salt", "Creamy Vanilla", "Butter"],
            size_options: [
                {"size": "Small (6 oz)", "price": 38.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 54.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 74.00, "burn_time": "90-95 hours"}
            ],
            stock: 41,
            featured: true,
            new_arrival: true
        },
        {
            id: 34,
            title: "Bamboo & White Tea",
            slug: "bamboo-white-tea",
            description: "Clean bamboo with white tea and a touch of cucumber freshness.",
            price: 36.00,
            compare_at_price: null,
            rating: 4.5,
            review_count: 138,
            images: [
                "https://formadore.com/woodwick/woodwick-core-woodwick-humidor-candle__78638_557a0cd-imgm.jpg",
                "https://formadore.com/woodwick/woodwick-core-woodwick-humidor-candle__78638_557a0cd-imgm.jpg",
                "https://formadore.com/woodwick/woodwick-core-woodwick-humidor-candle__78638_557a0cd-imgm.jpg"
            ],
            tags: ["clean", "zen", "spa"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Fresh Bamboo", "White Tea", "Cucumber", "Green Leaves"],
            size_options: [
                {"size": "Small (6 oz)", "price": 36.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 52.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 72.00, "burn_time": "90-95 hours"}
            ],
            stock: 52,
            featured: false,
            new_arrival: false
        },
        {
            id: 35,
            title: "Patchouli & Orange",
            slug: "patchouli-orange",
            description: "Earthy patchouli balanced with bright orange and warm spices.",
            price: 37.00,
            compare_at_price: null,
            rating: 4.3,
            review_count: 95,
            images: [
                "https://eadn-wc05-15571829.nxedge.io/cdn/media/catalog/product/cache/eec11dbd695aa5bc6b571a44e4419f5e/w/w/ww1728614_1.jpg",
                "https://eadn-wc05-15571829.nxedge.io/cdn/media/catalog/product/cache/eec11dbd695aa5bc6b571a44e4419f5e/w/w/ww1728614_1.jpg",
                "https://eadn-wc05-15571829.nxedge.io/cdn/media/catalog/product/cache/eec11dbd695aa5bc6b571a44e4419f5e/w/w/ww1728614_1.jpg"
            ],
            tags: ["earthy", "citrus", "bohemian"],
            category: "candles",
            fragrance_family: "oriental",
            fragrance_notes: ["Patchouli", "Sweet Orange", "Warm Spices", "Cedarwood"],
            size_options: [
                {"size": "Small (6 oz)", "price": 37.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 53.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 73.00, "burn_time": "90-95 hours"}
            ],
            stock: 33,
            featured: false,
            new_arrival: true
        },
        {
            id: 36,
            title: "Apple Cinnamon",
            slug: "apple-cinnamon",
            description: "Crisp red apples with warm cinnamon and a touch of brown sugar.",
            price: 33.00,
            compare_at_price: null,
            rating: 4.7,
            review_count: 203,
            images: [
                "https://magiadolar.pt/cdn/shop/products/93911E_vela_warm_woods_trilogy_woodwick.jpg?v=1654266665&width=416",
                "https://magiadolar.pt/cdn/shop/products/93911E_vela_warm_woods_trilogy_woodwick.jpg?v=1654266665&width=416",
                "https://magiadolar.pt/cdn/shop/products/93911E_vela_warm_woods_trilogy_woodwick.jpg?v=1654266665&width=416"
            ],
            tags: ["seasonal", "cozy", "autumn"],
            category: "candles",
            fragrance_family: "gourmand",
            fragrance_notes: ["Red Apple", "Cinnamon Bark", "Brown Sugar", "Nutmeg"],
            size_options: [
                {"size": "Small (6 oz)", "price": 33.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 49.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 69.00, "burn_time": "90-95 hours"}
            ],
            stock: 64,
            featured: true,
            new_arrival: false
        },
        {
            id: 37,
            title: "Violet & Iris",
            slug: "violet-iris",
            description: "Delicate violet petals with powdery iris and soft vanilla.",
            price: 41.00,
            compare_at_price: 46.00,
            rating: 4.6,
            review_count: 156,
            images: [
                "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/903903s2.jpg?im=Resize,width=750",
                "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/903903s2.jpg?im=Resize,width=750",
                "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/903903s2.jpg?im=Resize,width=750"
            ],
            tags: ["floral", "powdery", "vintage"],
            category: "candles",
            fragrance_family: "floral",
            fragrance_notes: ["Violet Petals", "Powdery Iris", "Soft Vanilla", "White Musk"],
            size_options: [
                {"size": "Small (6 oz)", "price": 41.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 57.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 77.00, "burn_time": "90-95 hours"}
            ],
            stock: 26,
            featured: false,
            new_arrival: true
        },
        {
            id: 38,
            title: "Cedarwood & Lavender",
            slug: "cedarwood-lavender",
            description: "Grounding cedarwood with calming lavender and herbal notes.",
            price: 39.00,
            compare_at_price: null,
            rating: 4.8,
            review_count: 187,
            images: [
                "https://m.media-amazon.com/images/I/81t6kB2Xl8L._UF1000,1000_QL80_.jpg",
                "https://m.media-amazon.com/images/I/81t6kB2Xl8L._UF1000,1000_QL80_.jpg",
                "https://m.media-amazon.com/images/I/81t6kB2Xl8L._UF1000,1000_QL80_.jpg"
            ],
            tags: ["woody", "calming", "unisex"],
            category: "candles",
            fragrance_family: "woody",
            fragrance_notes: ["Cedarwood", "French Lavender", "Rosemary", "Sage"],
            size_options: [
                {"size": "Small (6 oz)", "price": 39.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 55.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 75.00, "burn_time": "90-95 hours"}
            ],
            stock: 38,
            featured: true,
            new_arrival: false
        },
        {
            id: 39,
            title: "Grapefruit & Mint",
            slug: "grapefruit-mint",
            description: "Zesty pink grapefruit with cooling mint and lime zest.",
            price: 34.00,
            compare_at_price: null,
            rating: 4.4,
            review_count: 112,
            images: [
                "https://richhillcandles.com/cdn/shop/files/DSC_0529_1445x.png?v=1743039568",
                "https://richhillcandles.com/cdn/shop/files/DSC_0529_1445x.png?v=1743039568",
                "https://richhillcandles.com/cdn/shop/files/DSC_0529_1445x.png?v=1743039568"
            ],
            tags: ["citrus", "refreshing", "energizing"],
            category: "candles",
            fragrance_family: "fresh",
            fragrance_notes: ["Pink Grapefruit", "Fresh Mint", "Lime Zest", "Basil"],
            size_options: [
                {"size": "Small (6 oz)", "price": 34.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 50.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 70.00, "burn_time": "90-95 hours"}
            ],
            stock: 49,
            featured: false,
            new_arrival: true
        },
        {
            id: 40,
            title: "Amber & Musk",
            slug: "amber-musk",
            description: "Rich amber with sensual musk and warm vanilla undertones.",
            price: 44.00,
            compare_at_price: null,
            rating: 4.7,
            review_count: 198,
            images: [
                "https://www.woodwickbelgium.com/web/image/209529-4d82a6fa/WW%20Opulent%20Woods%201000x1000.png",
                "https://www.woodwickbelgium.com/web/image/209529-4d82a6fa/WW%20Opulent%20Woods%201000x1000.png",
                "https://www.woodwickbelgium.com/web/image/209529-4d82a6fa/WW%20Opulent%20Woods%201000x1000.png"
            ],
            tags: ["sensual", "warm", "evening"],
            category: "candles",
            fragrance_family: "oriental",
            fragrance_notes: ["Rich Amber", "Sensual Musk", "Warm Vanilla", "Tonka Bean"],
            size_options: [
                {"size": "Small (6 oz)", "price": 44.00, "burn_time": "35-40 hours"},
                {"size": "Medium (10 oz)", "price": 60.00, "burn_time": "60-65 hours"},
                {"size": "Large (16 oz)", "price": 80.00, "burn_time": "90-95 hours"}
            ],
            stock: 27,
            featured: true,
            new_arrival: false
        }
    ];
}

// Initialize Header Components
function initializeHeader() {
    console.log('initializeHeader function called');
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Cart icon click handler
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cart icon clicked');
            toggleCartDrawer();
        });
        cartIcon.setAttribute('data-initialized', 'true');
    } else {
        console.log('Cart icon not found');
    }
    
    // Close cart drawer
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    
    console.log('Close cart button element:', closeCart);
    console.log('Cart overlay element:', cartOverlay);
    
    if (closeCart) {
        closeCart.addEventListener('click', function(e) {
            console.log('Close cart button clicked');
            e.preventDefault();
            closeCartDrawer();
        });
        closeCart.setAttribute('data-initialized', 'true');
        console.log('Close cart button event listener added');
    } else {
        console.log('Close cart button not found');
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function(e) {
            console.log('Cart overlay clicked');
            closeCartDrawer();
        });
        cartOverlay.setAttribute('data-initialized', 'true');
        console.log('Cart overlay event listener added');
    } else {
        console.log('Cart overlay not found');
    }
    
    // Wishlist icon click handler
    const wishlistIcon = document.getElementById('wishlistIcon');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Wishlist icon clicked');
            openWishlistModal();
        });
        wishlistIcon.setAttribute('data-initialized', 'true');
    } else {
        console.log('Wishlist icon not found');
    }
}

// Cart Drawer Functions
function toggleCartDrawer() {
    console.log('toggleCartDrawer called');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    console.log('Cart drawer element:', cartDrawer);
    console.log('Cart overlay element:', cartOverlay);
    
    if (cartDrawer && cartOverlay) {
        const isOpen = cartDrawer.classList.contains('open');
        console.log('Cart drawer is open:', isOpen);
        
        if (isOpen) {
            closeCartDrawer();
        } else {
            openCartDrawer();
        }
    } else {
        console.log('Cart drawer or overlay not found');
    }
}

function openCartDrawer() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Load cart items
        loadCartDrawer();
    }
}

function closeCartDrawer() {
    console.log('closeCartDrawer called');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    console.log('Cart drawer element:', cartDrawer);
    console.log('Cart overlay element:', cartOverlay);
    
    if (cartDrawer && cartOverlay) {
        console.log('Closing cart drawer...');
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Cart drawer closed successfully');
    } else {
        console.log('Cart drawer or overlay elements not found');
    }
}

function loadCartDrawer() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cartBody || !cartFooter) return;
    
    const cartItems = cartManager ? cartManager.getItems() : cart;
    
    if (cartItems.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="bi bi-bag display-1 text-muted"></i>
                <p class="mt-3">Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-variant">${item.size || 'Standard'}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="quantity-input">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartBody.innerHTML = cartHTML;
    
    // Update footer
    const subtotalElement = document.getElementById('cartSubtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    cartFooter.style.display = 'block';
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const count = cartManager ? cartManager.getItemCount() : cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
        cartCount.classList.toggle('show', count > 0);
    }
}

// Update Wishlist Count
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        const count = wishlist.length;
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'block' : 'none';
        wishlistCount.classList.toggle('show', count > 0);
    }
}

// Load Cart from localStorage
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

// Load Wishlist from localStorage
function loadWishlist() {
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateWishlistCount();
}

// Initialize Cookie Banner
function initializeCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookiesAccepted && cookieBanner) {
        cookieBanner.style.display = 'block';
    }
}

// Cookie Banner Functions
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookie-banner').style.display = 'none';
}

function dismissCookies() {
    document.getElementById('cookie-banner').style.display = 'none';
}

// Initialize Modals
function initializeModals() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Handle Login Form Submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    console.log('Login attempt:', { email, rememberMe });
    
    // For demo purposes, just close the modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();
    
    // Show success message
    showNotification('Login successful!', 'success');
    
    // Reset form
    document.getElementById('loginForm').reset();
}

// Handle Register Form Submission
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!agreeTerms) {
        alert('Please agree to the terms of service');
        return;
    }
    
    // Simulate registration process
    console.log('Registration attempt:', { firstName, lastName, email });
    
    // For demo purposes, just close the modal
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    registerModal.hide();
    
    // Show success message
    showNotification('Account created successfully!', 'success');
    
    // Reset form
    document.getElementById('registerForm').reset();
}

// Initialize Newsletter
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }
}

// Handle Newsletter Signup
function handleNewsletterSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('newsletterEmail').value;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate newsletter signup
    console.log('Newsletter signup:', email);
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('newsletterSuccessModal'));
    successModal.show();
    
    // Reset form
    document.getElementById('newsletterForm').reset();
}

// Load Featured Products
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    console.log('Featured container found:', !!featuredContainer);
    console.log('Products available:', products.length);
    
    if (!featuredContainer || !products.length) return;
    
    // Get featured products (limit to 8)
    const featuredProducts = products.filter(product => product.featured).slice(0, 8);
    console.log('Featured products found:', featuredProducts.length);
    
    featuredContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredContainer.appendChild(productCard);
    });
    
    console.log('Featured products loaded successfully');
}

// Create Product Card Element
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-6 mb-4';
    
    const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
    const isNew = product.new_arrival;
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    col.innerHTML = `
        <div class="product-card fade-in">
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
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price-current">$${product.price.toFixed(2)}</span>
                    ${isOnSale ? `<span class="price-original">$${product.compare_at_price.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
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

// Generate Star Rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="bi bi-star-fill star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="bi bi-star-half star"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="bi bi-star star empty"></i>';
    }
    
    return starsHTML;
}

// Add to Cart Function
function addToCart(productId, size = 'Small (6 oz)', quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const sizeOption = product.size_options.find(s => s.size === size);
    const price = sizeOption ? sizeOption.price : product.price;
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            title: product.title,
            image: product.images[0],
            size: size,
            price: price,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show add to cart animation
    if (typeof event !== 'undefined' && event.target) {
        const button = event.target;
        button.classList.add('adding');
        button.textContent = 'Added!';
        
        setTimeout(() => {
            button.classList.remove('adding');
            button.textContent = 'Add to Cart';
        }, 2000);
    }
    
    // Show notification
    showNotification(`${product.title} added to cart!`, 'success');
}

// Toggle Wishlist
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        showNotification(`${product.title} removed from wishlist`, 'info');
    } else {
        // Add to wishlist
        wishlist.push({
            id: productId,
            title: product.title,
            image: product.images[0],
            price: product.price
        });
        showNotification(`${product.title} added to wishlist!`, 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count
    updateWishlistCount();
    
    // Update heart icon - find the clicked element
    if (typeof event !== 'undefined' && event.target) {
        const heartIcon = event.target.closest('.product-action').querySelector('i');
        if (heartIcon) {
            heartIcon.className = wishlist.some(item => item.id === productId) ? 'bi bi-heart-fill' : 'bi bi-heart';
        }
    }
    
    // Update all heart icons for this product on the page
    updateWishlistIcons();
}

// Quick View Function
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.images[0]}" alt="${product.title}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h4 class="text-primary-brown">${product.title}</h4>
                <p class="text-muted">${product.description}</p>
                <div class="product-price mb-3">
                    <span class="price-current h5">$${product.price.toFixed(2)}</span>
                    ${product.compare_at_price ? `<span class="price-original">$${product.compare_at_price.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating mb-3">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.review_count} reviews)</span>
                </div>
                <div class="mb-3">
                    <label class="form-label">Size:</label>
                    <select class="form-select" id="quickViewSize">
                        ${product.size_options.map(option => 
                            `<option value="${option.size}">${option.size} - $${option.price.toFixed(2)}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Quantity:</label>
                    <input type="number" class="form-control" id="quickViewQuantity" value="1" min="1" max="10" style="width: 80px;">
                </div>
                <button class="btn btn-primary w-100" onclick="addToCartFromQuickView(${productId})">
                    Add to Cart
                </button>
                <a href="product.html?id=${productId}" class="btn btn-outline-primary w-100 mt-2">
                    View Full Details
                </a>
            </div>
        </div>
    `;
    
    const quickViewModal = new bootstrap.Modal(modal);
    quickViewModal.show();
}

// Add to Cart from Quick View
function addToCartFromQuickView(productId) {
    const size = document.getElementById('quickViewSize').value;
    const quantity = parseInt(document.getElementById('quickViewQuantity').value);
    
    addToCart(productId, size, quantity);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
    modal.hide();
}

// Cart Drawer Functions
function toggleCartDrawer() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartDrawer.classList.contains('open')) {
        closeCartDrawer();
    } else {
        openCartDrawer();
    }
}

function openCartDrawer() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load cart items
    loadCartItems();
}


// Load Cart Items
function loadCartItems() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="bi bi-bag display-1 text-muted"></i>
                <p class="mt-3">Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-variant">${item.size}</div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')" aria-label="Remove item">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartBody.innerHTML = cartHTML;
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    cartFooter.style.display = 'block';
}

// Update Cart Quantity
function updateCartQuantity(productId, size, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId, size);
        return;
    }
    
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
    }
}

// Remove from Cart
function removeFromCart(productId, size) {
    const index = cart.findIndex(item => item.id === productId && item.size === size);
    if (index > -1) {
        const item = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
        showNotification(`${item.title} removed from cart`, 'info');
    }
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.add('show');
        } else {
            cartCount.classList.remove('show');
        }
    }
}

// Update Wishlist Count
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        if (wishlist.length > 0) {
            wishlistCount.classList.add('show');
        } else {
            wishlistCount.classList.remove('show');
        }
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'error' ? 'bi-exclamation-circle' : 'bi-info-circle'} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Wishlist Modal Functions
function openWishlistModal() {
    console.log('openWishlistModal called');
    // Create or get wishlist modal
    let wishlistModal = document.getElementById('wishlistModal');
    console.log('Wishlist modal element:', wishlistModal);
    
    if (!wishlistModal) {
        console.log('Creating wishlist modal');
        createWishlistModal();
        wishlistModal = document.getElementById('wishlistModal');
    }
    
    // Load wishlist items
    loadWishlistItems();
    
    // Show modal
    if (typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(wishlistModal);
        modal.show();
    } else {
        console.log('Bootstrap not available');
    }
}

function createWishlistModal() {
    const modalHTML = `
        <div class="modal fade" id="wishlistModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">My Wishlist</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="wishlistModalBody">
                        <!-- Wishlist items will be loaded here -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-outline-danger" onclick="clearWishlist()">Clear All</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function loadWishlistItems() {
    const wishlistBody = document.getElementById('wishlistModalBody');
    
    if (wishlist.length === 0) {
        wishlistBody.innerHTML = `
            <div class="empty-wishlist text-center py-5">
                <i class="bi bi-heart display-1 text-muted"></i>
                <h4 class="mt-3">Your wishlist is empty</h4>
                <p class="text-muted">Save items you love to your wishlist</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    let wishlistHTML = '<div class="row">';
    
    wishlist.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            wishlistHTML += `
                <div class="col-md-6 mb-3">
                    <div class="wishlist-item d-flex">
                        <div class="wishlist-item-image me-3">
                            <img src="${item.image}" alt="${item.title}" class="img-fluid rounded" style="width: 80px; height: 80px; object-fit: cover;">
                        </div>
                        <div class="wishlist-item-details flex-grow-1">
                            <h6 class="mb-1">${item.title}</h6>
                            <p class="text-primary mb-2">$${item.price.toFixed(2)}</p>
                            <div class="wishlist-item-actions">
                                <button class="btn btn-primary btn-sm me-2" onclick="addToCartFromWishlist(${item.id})">
                                    Add to Cart
                                </button>
                                <button class="btn btn-outline-danger btn-sm" onclick="removeFromWishlist(${item.id})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    wishlistHTML += '</div>';
    wishlistBody.innerHTML = wishlistHTML;
}

function addToCartFromWishlist(productId) {
    addToCart(productId);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(productId);
}

function removeFromWishlist(productId) {
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        const item = wishlist[index];
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        loadWishlistItems(); // Reload the modal content
        showNotification(`${item.title} removed from wishlist`, 'info');
        
        // Update heart icons on the page
        updateWishlistIcons();
    }
}

function clearWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlist = [];
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        loadWishlistItems();
        showNotification('Wishlist cleared', 'info');
        
        // Update all heart icons on the page
        updateWishlistIcons();
    }
}

function updateWishlistIcons() {
    // Update all heart icons on the current page
    document.querySelectorAll('.product-action i.bi-heart, .product-action i.bi-heart-fill').forEach(icon => {
        const productAction = icon.closest('.product-action');
        
        // Try to find product ID from onclick attribute or data attribute
        const onclickAttr = productAction.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/toggleWishlist\((\d+)\)/);
            if (match) {
                const productId = parseInt(match[1]);
                const isInWishlist = wishlist.some(item => item.id === productId);
                icon.className = isInWishlist ? 'bi bi-heart-fill' : 'bi bi-heart';
            }
        }
    });
}

// Debug function to test wishlist functionality
function testWishlistFunctionality() {
    console.log('Testing wishlist functionality...');
    console.log('Current wishlist:', wishlist);
    console.log('Wishlist count element:', document.getElementById('wishlistCount'));
    console.log('Wishlist icon element:', document.getElementById('wishlistIcon'));
    
    // Test adding an item to wishlist
    if (products.length > 0) {
        console.log('Testing with product:', products[0]);
        toggleWishlist(products[0].id);
        console.log('Wishlist after toggle:', wishlist);
    }
}

// Utility Functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function debounce(func, wait) {
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

// Lazy Loading Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeSmoothScrolling();
});

// Fallback initialization for cart and wishlist icons
window.addEventListener('load', function() {
    // Double-check that cart and wishlist icons are working
    setTimeout(() => {
        const cartIcon = document.getElementById('cartIcon');
        const wishlistIcon = document.getElementById('wishlistIcon');
        
        if (cartIcon && !cartIcon.hasAttribute('data-initialized')) {
            console.log('Fallback: Initializing cart icon');
            cartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Fallback cart icon clicked');
                toggleCartDrawer();
            });
            cartIcon.setAttribute('data-initialized', 'true');
        }
        
        if (wishlistIcon && !wishlistIcon.hasAttribute('data-initialized')) {
            console.log('Fallback: Initializing wishlist icon');
            wishlistIcon.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Fallback wishlist icon clicked');
                openWishlistModal();
            });
            wishlistIcon.setAttribute('data-initialized', 'true');
        }
        
        // Fallback for close cart button
        const closeCart = document.getElementById('closeCart');
        if (closeCart && !closeCart.hasAttribute('data-initialized')) {
            console.log('Fallback: Initializing close cart button');
            closeCart.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Fallback close cart button clicked');
                closeCartDrawer();
            });
            closeCart.setAttribute('data-initialized', 'true');
        }
        
        // Fallback for cart overlay
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartOverlay && !cartOverlay.hasAttribute('data-initialized')) {
            console.log('Fallback: Initializing cart overlay');
            cartOverlay.addEventListener('click', function(e) {
                console.log('Fallback cart overlay clicked');
                closeCartDrawer();
            });
            cartOverlay.setAttribute('data-initialized', 'true');
        }
    }, 500);
});

// Export functions for global access
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.quickView = quickView;
window.addToCartFromQuickView = addToCartFromQuickView;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.acceptCookies = acceptCookies;
window.dismissCookies = dismissCookies;
window.openWishlistModal = openWishlistModal;
window.addToCartFromWishlist = addToCartFromWishlist;
window.removeFromWishlist = removeFromWishlist;
window.clearWishlist = clearWishlist;
window.testWishlistFunctionality = testWishlistFunctionality;
window.getFallbackProducts = getFallbackProducts;
window.toggleCartDrawer = toggleCartDrawer;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.loadCartDrawer = loadCartDrawer;
window.updateCartCount = updateCartCount;
window.updateWishlistCount = updateWishlistCount;
window.loadCart = loadCart;
window.loadWishlist = loadWishlist;

// Test functions for debugging
window.testCartIcon = function() {
    console.log('Testing cart icon...');
    const cartIcon = document.getElementById('cartIcon');
    console.log('Cart icon element:', cartIcon);
    if (cartIcon) {
        cartIcon.click();
    } else {
        console.log('Cart icon not found!');
    }
};

window.testWishlistIcon = function() {
    console.log('Testing wishlist icon...');
    const wishlistIcon = document.getElementById('wishlistIcon');
    console.log('Wishlist icon element:', wishlistIcon);
    if (wishlistIcon) {
        wishlistIcon.click();
    } else {
        console.log('Wishlist icon not found!');
    }
};

window.testCartDrawer = function() {
    console.log('Testing cart drawer directly...');
    toggleCartDrawer();
};

window.testWishlistModal = function() {
    console.log('Testing wishlist modal directly...');
    openWishlistModal();
};

window.testCloseCart = function() {
    console.log('Testing close cart functionality...');
    const closeCart = document.getElementById('closeCart');
    console.log('Close cart button:', closeCart);
    if (closeCart) {
        closeCart.click();
    } else {
        console.log('Close cart button not found, calling closeCartDrawer directly...');
        closeCartDrawer();
    }
};

window.testCartOverlay = function() {
    console.log('Testing cart overlay click...');
    const cartOverlay = document.getElementById('cartOverlay');
    console.log('Cart overlay:', cartOverlay);
    if (cartOverlay) {
        cartOverlay.click();
    } else {
        console.log('Cart overlay not found');
    }
};

// Checkout functionality
function proceedToCheckout() {
    // Check if cart has items
    if (!window.cartManager || cartManager.getItemCount() === 0) {
        alert('Your cart is empty. Please add some items before proceeding to checkout.');
        return;
    }
    
    // Close cart drawer
    closeCartDrawer();
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Export checkout function
window.proceedToCheckout = proceedToCheckout;

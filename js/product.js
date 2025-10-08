// ===== PRODUCT PAGE FUNCTIONALITY =====

class ProductManager {
    constructor() {
        this.product = null;
        this.products = [];
        this.currentImageIndex = 0;
        this.selectedSize = '';
        this.selectedQuantity = 1;
        
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            await this.loadProduct();
            this.bindEvents();
        } catch (error) {
            console.error('Error initializing product page:', error);
            this.showError();
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.products = data.products;
        } catch (error) {
            console.error('Error loading products from JSON:', error);
            console.log('Loading fallback products...');
            
            // Use fallback products from app.js
            if (window.products && window.products.length > 0) {
                this.products = window.products;
            } else {
                // If app.js products aren't loaded yet, use the same fallback function
                this.products = this.getFallbackProducts();
            }
        }
    }

    getFallbackProducts() {
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

    async loadProduct() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (!productId) {
            this.showError('Product not found');
            return;
        }

        this.product = this.products.find(p => p.id === productId);
        
        if (!this.product) {
            this.showError('Product not found');
            return;
        }

        this.renderProduct();
        this.updateSEO();
        this.loadRelatedProducts();
    }

    renderProduct() {
        const container = document.getElementById('productContent');
        if (!container) return;

        // Set default selected size
        this.selectedSize = this.product.size_options[0].size;

        const isOnSale = this.product.compare_at_price && this.product.compare_at_price > this.product.price;
        const isNew = this.product.new_arrival;
        const isInWishlist = window.wishlist && window.wishlist.some(item => item.id === this.product.id);

        container.innerHTML = `
            <div class="col-lg-6">
                <!-- Product Image Gallery -->
                <div class="product-gallery">
                    <div class="main-image mb-3">
                        <img src="${this.product.images[0]}" alt="${this.product.title}" 
                             class="img-fluid rounded" id="mainProductImage" 
                             onclick="zoomImage('${this.product.images[0]}')">
                        ${isOnSale ? '<span class="product-badge position-absolute" style="top: 1rem; left: 1rem;">Sale</span>' : ''}
                        ${isNew ? '<span class="product-badge position-absolute" style="top: 1rem; right: 1rem; background: var(--success);">New</span>' : ''}
                    </div>
                    <div class="thumbnail-images">
                        <div class="row g-2">
                            ${this.product.images.map((image, index) => `
                                <div class="col-4">
                                    <img src="${image}" alt="${this.product.title}" 
                                         class="img-fluid rounded thumbnail ${index === 0 ? 'active' : ''}" 
                                         onclick="changeMainImage('${image}', ${index})">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-6">
                <!-- Product Information -->
                <div class="product-info">
                    <h1 class="product-title">${this.product.title}</h1>
                    
                    <div class="product-rating mb-3">
                        <div class="stars">
                            ${this.generateStars(this.product.rating)}
                        </div>
                        <span class="rating-count ms-2">(${this.product.review_count} reviews)</span>
                    </div>
                    
                    <div class="product-price mb-4">
                        <span class="price-current h3" id="currentPrice">$${this.product.price.toFixed(2)}</span>
                        ${isOnSale ? `<span class="price-original h5 ms-2">$${this.product.compare_at_price.toFixed(2)}</span>` : ''}
                    </div>
                    
                    <div class="product-description mb-4">
                        <p>${this.product.description}</p>
                    </div>
                    
                    <div class="fragrance-notes mb-4">
                        <h6 class="mb-2">Fragrance Notes:</h6>
                        <div class="notes-list">
                            ${this.product.fragrance_notes.map(note => 
                                `<span class="badge bg-light text-dark me-2 mb-2">${note}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <!-- Size Selection -->
                    <div class="size-selection mb-4">
                        <h6 class="mb-2">Size:</h6>
                        <div class="size-options">
                            ${this.product.size_options.map(option => `
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="size" 
                                           id="size-${option.size.replace(/\s+/g, '-')}" 
                                           value="${option.size}" 
                                           ${option.size === this.selectedSize ? 'checked' : ''}
                                           onchange="productManager.updateSelectedSize('${option.size}', ${option.price})">
                                    <label class="form-check-label" for="size-${option.size.replace(/\s+/g, '-')}">
                                        ${option.size} - $${option.price.toFixed(2)}
                                        <small class="text-muted d-block">${option.burn_time}</small>
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Quantity Selection -->
                    <div class="quantity-selection mb-4">
                        <h6 class="mb-2">Quantity:</h6>
                        <div class="quantity-controls d-flex align-items-center">
                            <button class="btn btn-outline-secondary" onclick="productManager.updateQuantity(-1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="number" class="form-control mx-2" id="quantityInput" 
                                   value="1" min="1" max="${this.product.stock}" 
                                   style="width: 80px; text-align: center;"
                                   onchange="productManager.setQuantity(this.value)">
                            <button class="btn btn-outline-secondary" onclick="productManager.updateQuantity(1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                        <small class="text-muted">In stock: ${this.product.stock} items</small>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="product-actions mb-4">
                        <button class="btn btn-primary btn-lg me-3" onclick="productManager.addToCart()" 
                                ${this.product.stock === 0 ? 'disabled' : ''}>
                            <i class="bi bi-bag me-2"></i>
                            ${this.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="btn btn-outline-primary btn-lg" onclick="toggleWishlist(${this.product.id})">
                            <i class="bi ${isInWishlist ? 'bi-heart-fill' : 'bi-heart'} me-2"></i>
                            ${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                    
                    <!-- Product Features -->
                    <div class="product-features">
                        <div class="row text-center">
                            <div class="col-4">
                                <i class="bi bi-truck display-6 text-primary"></i>
                                <p class="small mt-2 mb-0">Free Shipping<br>over $75</p>
                            </div>
                            <div class="col-4">
                                <i class="bi bi-arrow-clockwise display-6 text-primary"></i>
                                <p class="small mt-2 mb-0">30-Day<br>Returns</p>
                            </div>
                            <div class="col-4">
                                <i class="bi bi-leaf display-6 text-primary"></i>
                                <p class="small mt-2 mb-0">Eco-Friendly<br>Materials</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Show product info section
        document.getElementById('productInfoSection').style.display = 'block';
        
        // Update breadcrumb
        this.updateBreadcrumb();
        
        // Load product description in tabs
        this.loadProductTabs();
    }

    updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item"><a href="shop.html">Shop</a></li>
                <li class="breadcrumb-item"><a href="shop.html?fragrance=${this.product.fragrance_family}">${this.product.fragrance_family.charAt(0).toUpperCase() + this.product.fragrance_family.slice(1)}</a></li>
                <li class="breadcrumb-item active">${this.product.title}</li>
            `;
        }
    }

    updateSEO() {
        // Update page title
        document.title = `${this.product.title} - Lumière Candles`;
        
        // Update meta description
        const metaDesc = document.getElementById('productDescription');
        if (metaDesc) {
            metaDesc.content = this.product.description;
        }
        
        // Update JSON-LD schema
        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": this.product.title,
            "description": this.product.description,
            "image": this.product.images,
            "brand": {
                "@type": "Brand",
                "name": "Lumière Candles"
            },
            "offers": {
                "@type": "Offer",
                "price": this.product.price.toString(),
                "priceCurrency": "USD",
                "availability": this.product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": this.product.rating.toString(),
                "reviewCount": this.product.review_count.toString()
            }
        };
        
        const schemaScript = document.getElementById('productSchema');
        if (schemaScript) {
            schemaScript.textContent = JSON.stringify(schema);
        }
    }

    loadProductTabs() {
        // Load full description
        const descriptionTab = document.getElementById('productFullDescription');
        if (descriptionTab) {
            descriptionTab.innerHTML = `
                <h5>About ${this.product.title}</h5>
                <p>${this.product.description}</p>
                <p>This premium candle is part of our ${this.product.fragrance_family} collection, carefully crafted with natural soy wax and premium fragrance oils. Each candle is hand-poured and designed to provide hours of beautiful fragrance and ambiance.</p>
                
                <h6>Key Features:</h6>
                <ul>
                    <li>Made with 100% natural soy wax</li>
                    <li>Cotton core wick for clean burning</li>
                    <li>Premium fragrance oils</li>
                    <li>Reusable glass container</li>
                    <li>Hand-poured with care</li>
                </ul>
                
                <h6>Fragrance Profile:</h6>
                <p><strong>Family:</strong> ${this.product.fragrance_family.charAt(0).toUpperCase() + this.product.fragrance_family.slice(1)}</p>
                <p><strong>Notes:</strong> ${this.product.fragrance_notes.join(', ')}</p>
            `;
        }
        
        // Load reviews
        this.loadReviews();
    }

    loadReviews() {
        const reviewsContent = document.getElementById('reviewsContent');
        if (!reviewsContent) return;
        
        // Generate sample reviews based on product rating
        const sampleReviews = this.generateSampleReviews();
        
        let reviewsHTML = `
            <div class="reviews-summary mb-4">
                <div class="row">
                    <div class="col-md-4 text-center">
                        <div class="rating-overview">
                            <div class="display-4 text-primary">${this.product.rating}</div>
                            <div class="stars mb-2">
                                ${this.generateStars(this.product.rating)}
                            </div>
                            <p class="text-muted">${this.product.review_count} reviews</p>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="rating-breakdown">
                            ${[5,4,3,2,1].map(star => {
                                const percentage = this.calculateRatingPercentage(star);
                                return `
                                    <div class="d-flex align-items-center mb-2">
                                        <span class="me-2">${star} star</span>
                                        <div class="progress flex-grow-1 me-2" style="height: 8px;">
                                            <div class="progress-bar bg-primary" style="width: ${percentage}%"></div>
                                        </div>
                                        <span class="text-muted">${percentage}%</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="reviews-list">
                ${sampleReviews.map(review => `
                    <div class="review-item border-bottom pb-3 mb-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <strong>${review.name}</strong>
                                <div class="stars">
                                    ${this.generateStars(review.rating)}
                                </div>
                            </div>
                            <small class="text-muted">${review.date}</small>
                        </div>
                        <p class="mb-0">${review.comment}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        reviewsContent.innerHTML = reviewsHTML;
    }

    generateSampleReviews() {
        const reviews = [
            {
                name: "Sarah M.",
                rating: 5,
                date: "2 weeks ago",
                comment: "Absolutely love this candle! The scent is perfect and it burns evenly. Will definitely be ordering more."
            },
            {
                name: "Michael R.",
                rating: 4,
                date: "1 month ago", 
                comment: "Great quality candle with a beautiful fragrance. The only reason I'm not giving 5 stars is the price point, but the quality justifies it."
            },
            {
                name: "Emma L.",
                rating: 5,
                date: "1 month ago",
                comment: "This candle creates such a cozy atmosphere in my living room. The scent isn't overpowering and lasts for hours."
            }
        ];
        
        return reviews;
    }

    calculateRatingPercentage(star) {
        // Simple calculation for demo purposes
        const rating = this.product.rating;
        if (star === 5) return Math.round((rating - 4) * 100);
        if (star === 4) return Math.round((5 - rating) * 50);
        if (star === 3) return Math.round(Math.max(0, (3 - Math.abs(rating - 4)) * 20));
        return Math.round(Math.max(0, (2 - Math.abs(rating - 4)) * 10));
    }

    loadRelatedProducts() {
        const relatedContainer = document.getElementById('relatedProducts');
        const relatedSection = document.getElementById('relatedProductsSection');
        
        if (!relatedContainer || !relatedSection) return;
        
        // Find related products (same fragrance family, excluding current product)
        const related = this.products
            .filter(p => p.fragrance_family === this.product.fragrance_family && p.id !== this.product.id)
            .slice(0, 4);
        
        if (related.length === 0) {
            relatedSection.style.display = 'none';
            return;
        }
        
        let relatedHTML = '';
        related.forEach(product => {
            relatedHTML += `
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="product-card">
                        <div class="product-image">
                            <a href="product.html?id=${product.id}">
                                <img src="${product.images[0]}" alt="${product.title}" class="img-fluid">
                            </a>
                        </div>
                        <div class="product-content">
                            <h5 class="product-title">
                                <a href="product.html?id=${product.id}" class="text-decoration-none">${product.title}</a>
                            </h5>
                            <div class="product-price">
                                <span class="price-current">$${product.price.toFixed(2)}</span>
                            </div>
                            <div class="product-rating">
                                <div class="stars">
                                    ${this.generateStars(product.rating)}
                                </div>
                                <span class="rating-count">(${product.review_count})</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        relatedContainer.innerHTML = relatedHTML;
        relatedSection.style.display = 'block';
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

    updateSelectedSize(size, price) {
        this.selectedSize = size;
        const priceElement = document.getElementById('currentPrice');
        if (priceElement) {
            priceElement.textContent = `$${price.toFixed(2)}`;
        }
    }

    updateQuantity(change) {
        const input = document.getElementById('quantityInput');
        if (!input) return;
        
        const currentValue = parseInt(input.value);
        const newValue = Math.max(1, Math.min(this.product.stock, currentValue + change));
        
        input.value = newValue;
        this.selectedQuantity = newValue;
    }

    setQuantity(value) {
        const quantity = Math.max(1, Math.min(this.product.stock, parseInt(value) || 1));
        this.selectedQuantity = quantity;
        
        const input = document.getElementById('quantityInput');
        if (input) {
            input.value = quantity;
        }
    }

    addToCart() {
        if (window.addToCart) {
            window.addToCart(this.product.id, this.selectedSize, this.selectedQuantity);
        }
    }

    bindEvents() {
        // Image gallery events are handled by global functions
        // Quantity input validation
        const quantityInput = document.getElementById('quantityInput');
        if (quantityInput) {
            quantityInput.addEventListener('blur', () => {
                this.setQuantity(quantityInput.value);
            });
        }
    }

    showError(message = 'Product not found') {
        const container = document.getElementById('productContent');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
                    <h3 class="mt-3">${message}</h3>
                    <p class="text-muted">The product you're looking for doesn't exist or has been removed.</p>
                    <a href="shop.html" class="btn btn-primary">Browse All Products</a>
                </div>
            `;
        }
    }
}

// Global functions for image gallery
function changeMainImage(imageSrc, index) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageSrc;
        mainImage.onclick = () => zoomImage(imageSrc);
    }
    
    // Update thumbnail active state
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    if (window.productManager) {
        window.productManager.currentImageIndex = index;
    }
}

function zoomImage(imageSrc) {
    const zoomedImage = document.getElementById('zoomedImage');
    if (zoomedImage) {
        zoomedImage.src = imageSrc;
        const modal = new bootstrap.Modal(document.getElementById('imageZoomModal'));
        modal.show();
    }
}

// Initialize product manager
let productManager;

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product.html')) {
        productManager = new ProductManager();
        window.productManager = productManager;
    }
});

// Export for global access
window.changeMainImage = changeMainImage;
window.zoomImage = zoomImage;

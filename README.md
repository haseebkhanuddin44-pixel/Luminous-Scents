# Lumière Candles - Premium E-commerce Frontend

A complete, responsive, production-quality frontend e-commerce site inspired by premium candle brands. Built with HTML5, CSS3, JavaScript (ES6+), and Bootstrap 5.

## 🚀 Quick Start

### Running Locally

1. **Simple Method (Recommended)**
   - Open `index.html` directly in your web browser
   - All functionality works with file:// protocol

2. **Local Server Method (For full functionality)**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
   Then visit `http://localhost:8000`

## 📁 Project Structure

```
wood 45/
├── index.html              # Homepage
├── shop.html              # Product catalog with filters
├── product.html           # Product detail page
├── store-locator.html     # Store locator with map
├── css/
│   └── styles.css         # Main stylesheet
├── js/
│   ├── app.js            # Main application logic
│   ├── cart.js           # Shopping cart functionality
│   ├── search.js         # Search and suggestions
│   ├── shop.js           # Shop page filters/sorting
│   ├── product.js        # Product detail page
│   └── store-locator.js  # Store locator functionality
├── data/
│   └── products.json     # Sample product data
└── README.md
```

## ✨ Features

### Core Functionality
- ✅ **Responsive Design** - Mobile-first approach with Bootstrap 5
- ✅ **Product Catalog** - Grid view with filtering and sorting
- ✅ **Product Details** - Image gallery, variants, reviews
- ✅ **Shopping Cart** - Add/remove items, quantity updates, localStorage persistence
- ✅ **Search** - Real-time suggestions and results
- ✅ **Wishlist** - Save favorite products
- ✅ **Store Locator** - Find nearby stores with map integration

### Pages Implemented
- ✅ **Homepage** - Hero carousel, featured products, newsletter signup
- ✅ **Shop** - Product grid with advanced filters (price, category, fragrance, rating)
- ✅ **Product Detail** - Image zoom, size selection, reviews, related products
- ✅ **Store Locator** - Interactive store finder with location search

### User Experience
- ✅ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- ✅ **SEO Optimized** - Meta tags, JSON-LD schema, semantic HTML
- ✅ **Performance** - Lazy loading images, optimized assets
- ✅ **Animations** - Smooth transitions and hover effects

## 🎨 Design System

### Color Palette
- **Primary Brown**: `#6B3F26`
- **Accent Gold**: `#C9A464`
- **Neutral Cream**: `#F7F4F0`
- **Dark Text**: `#222222`
- **Light Gray**: `#E9E7E5`

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 🛠️ Customization

### Adding Real Product Images
1. Create `assets/images/products/` directory
2. Replace Unsplash URLs in `data/products.json` with local image paths
3. Update hero and feature images in `index.html`

### Integrating with Backend
The frontend is designed to work with REST APIs. Key integration points:

1. **Products API**: Replace `data/products.json` fetch with your API endpoint
2. **Cart API**: Update cart.js to sync with backend
3. **User Authentication**: Connect login/register modals to your auth system
4. **Search API**: Replace client-side search with server-side search

### Adding Map Integration
1. Get API key from Google Maps, Mapbox, or similar service
2. Replace map placeholder in `store-locator.html`
3. Update `js/store-locator.js` with real map integration

Example Google Maps integration:
```javascript
// Add to store-locator.js
function initMap() {
    const map = new google.maps.Map(document.getElementById('storeMap'), {
        zoom: 10,
        center: { lat: 40.7505, lng: -73.9934 }
    });
    
    // Add markers for each store
    stores.forEach(store => {
        new google.maps.Marker({
            position: store.coordinates,
            map: map,
            title: store.name
        });
    });
}
```

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔧 Development Notes

### Local Storage Usage
- Cart items: `localStorage.getItem('cart')`
- Wishlist: `localStorage.getItem('wishlist')`
- Search history: `localStorage.getItem('searchHistory')`
- Promo codes: `localStorage.getItem('promoCode')`

### Key JavaScript Classes
- `CartManager` - Handles all cart operations
- `SearchManager` - Manages search functionality
- `ShopManager` - Controls shop page filters/sorting
- `ProductManager` - Handles product detail page
- `StoreLocator` - Manages store finder functionality

### CSS Architecture
- CSS Custom Properties for theming
- Mobile-first responsive design
- Component-based class naming
- Utility classes for common patterns

## 🚀 Deployment

### Static Hosting (Recommended)
Deploy to any static hosting service:
- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to a GitHub repository
- **AWS S3**: Upload files to S3 bucket with static hosting

### CDN Integration
All external dependencies are loaded from CDN:
- Bootstrap 5.3.2
- Bootstrap Icons 1.11.1
- Google Fonts (Playfair Display, Inter)

## 📋 TODO for Production

### Required for Live Site
- [ ] Replace placeholder images with real product photos
- [ ] Add real product data and descriptions
- [ ] Integrate with payment processor (Stripe, PayPal, etc.)
- [ ] Connect to inventory management system
- [ ] Add real store locations and map API key
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Configure error tracking (Sentry, etc.)

### Optional Enhancements
- [ ] Add product reviews system
- [ ] Implement user accounts and order history
- [ ] Add live chat support
- [ ] Create admin panel for content management
- [ ] Add email marketing integration
- [ ] Implement A/B testing

## 🐛 Troubleshooting

### Products Not Loading
1. Check browser console for errors
2. Ensure `data/products.json` is accessible
3. Try running with a local server instead of file://

### Images Not Displaying
1. Check internet connection (using Unsplash CDN)
2. Replace with local images if needed
3. Verify image URLs in products.json

### Cart Not Persisting
1. Check if localStorage is enabled in browser
2. Clear browser cache and try again
3. Check browser console for JavaScript errors

## 📞 Support

For questions or issues with this template:
1. Check the browser console for error messages
2. Verify all files are in the correct directory structure
3. Ensure you're running the latest version of your browser

## 📄 License

This project is provided as-is for educational and commercial use. Feel free to modify and adapt for your needs.

---

**Built with ❤️ for premium e-commerce experiences**

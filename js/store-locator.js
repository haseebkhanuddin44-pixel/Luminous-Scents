// ===== STORE LOCATOR FUNCTIONALITY =====

class StoreLocator {
    constructor() {
        this.stores = [];
        this.filteredStores = [];
        this.userLocation = null;
        
        this.init();
    }

    init() {
        this.loadStores();
        this.bindEvents();
        this.displayStores();
    }

    loadStores() {
        // Sample store data - in a real app, this would come from an API
        this.stores = [
            {
                id: 1,
                name: "Lumière Flagship Store",
                address: "123 Madison Avenue",
                city: "New York",
                state: "NY",
                zip: "10016",
                phone: "(212) 555-0123",
                email: "flagship@lumierecandles.com",
                hours: {
                    "Monday": "10:00 AM - 8:00 PM",
                    "Tuesday": "10:00 AM - 8:00 PM", 
                    "Wednesday": "10:00 AM - 8:00 PM",
                    "Thursday": "10:00 AM - 8:00 PM",
                    "Friday": "10:00 AM - 9:00 PM",
                    "Saturday": "10:00 AM - 9:00 PM",
                    "Sunday": "11:00 AM - 7:00 PM"
                },
                features: ["Scent Bar", "Gift Wrapping", "Personal Shopping"],
                coordinates: { lat: 40.7505, lng: -73.9934 },
                distance: null
            },
            {
                id: 2,
                name: "Lumière SoHo",
                address: "456 Spring Street",
                city: "New York",
                state: "NY", 
                zip: "10012",
                phone: "(212) 555-0456",
                email: "soho@lumierecandles.com",
                hours: {
                    "Monday": "11:00 AM - 7:00 PM",
                    "Tuesday": "11:00 AM - 7:00 PM",
                    "Wednesday": "11:00 AM - 7:00 PM", 
                    "Thursday": "11:00 AM - 7:00 PM",
                    "Friday": "11:00 AM - 8:00 PM",
                    "Saturday": "10:00 AM - 8:00 PM",
                    "Sunday": "12:00 PM - 6:00 PM"
                },
                features: ["Scent Bar", "Gift Wrapping"],
                coordinates: { lat: 40.7242, lng: -74.0020 },
                distance: null
            },
            {
                id: 3,
                name: "Lumière Beverly Hills",
                address: "789 Rodeo Drive",
                city: "Beverly Hills",
                state: "CA",
                zip: "90210", 
                phone: "(310) 555-0789",
                email: "beverlyhills@lumierecandles.com",
                hours: {
                    "Monday": "10:00 AM - 8:00 PM",
                    "Tuesday": "10:00 AM - 8:00 PM",
                    "Wednesday": "10:00 AM - 8:00 PM",
                    "Thursday": "10:00 AM - 8:00 PM", 
                    "Friday": "10:00 AM - 9:00 PM",
                    "Saturday": "10:00 AM - 9:00 PM",
                    "Sunday": "11:00 AM - 7:00 PM"
                },
                features: ["Scent Bar", "Gift Wrapping", "Personal Shopping", "VIP Lounge"],
                coordinates: { lat: 34.0696, lng: -118.4005 },
                distance: null
            },
            {
                id: 4,
                name: "Lumière Chicago",
                address: "321 Michigan Avenue",
                city: "Chicago", 
                state: "IL",
                zip: "60611",
                phone: "(312) 555-0321",
                email: "chicago@lumierecandles.com",
                hours: {
                    "Monday": "10:00 AM - 8:00 PM",
                    "Tuesday": "10:00 AM - 8:00 PM",
                    "Wednesday": "10:00 AM - 8:00 PM",
                    "Thursday": "10:00 AM - 8:00 PM",
                    "Friday": "10:00 AM - 9:00 PM", 
                    "Saturday": "10:00 AM - 9:00 PM",
                    "Sunday": "11:00 AM - 7:00 PM"
                },
                features: ["Scent Bar", "Gift Wrapping"],
                coordinates: { lat: 41.8955, lng: -87.6244 },
                distance: null
            },
            {
                id: 5,
                name: "Lumière Miami",
                address: "654 Lincoln Road",
                city: "Miami Beach",
                state: "FL",
                zip: "33139",
                phone: "(305) 555-0654", 
                email: "miami@lumierecandles.com",
                hours: {
                    "Monday": "11:00 AM - 8:00 PM",
                    "Tuesday": "11:00 AM - 8:00 PM",
                    "Wednesday": "11:00 AM - 8:00 PM",
                    "Thursday": "11:00 AM - 8:00 PM",
                    "Friday": "11:00 AM - 9:00 PM",
                    "Saturday": "10:00 AM - 9:00 PM",
                    "Sunday": "12:00 PM - 7:00 PM"
                },
                features: ["Scent Bar", "Gift Wrapping"],
                coordinates: { lat: 25.7907, lng: -80.1300 },
                distance: null
            },
            {
                id: 6,
                name: "Lumière Seattle",
                address: "987 Pine Street", 
                city: "Seattle",
                state: "WA",
                zip: "98101",
                phone: "(206) 555-0987",
                email: "seattle@lumierecandles.com",
                hours: {
                    "Monday": "10:00 AM - 7:00 PM",
                    "Tuesday": "10:00 AM - 7:00 PM",
                    "Wednesday": "10:00 AM - 7:00 PM",
                    "Thursday": "10:00 AM - 7:00 PM",
                    "Friday": "10:00 AM - 8:00 PM",
                    "Saturday": "10:00 AM - 8:00 PM", 
                    "Sunday": "11:00 AM - 6:00 PM"
                },
                features: ["Scent Bar", "Gift Wrapping"],
                coordinates: { lat: 47.6131, lng: -122.3370 },
                distance: null
            },
            {
                id: 7,
                name: "Lumière Boston",
                address: "147 Newbury Street",
                city: "Boston",
                state: "MA",
                zip: "02116",
                phone: "(617) 555-0147",
                email: "boston@lumierecandles.com",
                hours: {
                    "Monday": "10:00 AM - 7:00 PM",
                    "Tuesday": "10:00 AM - 7:00 PM",
                    "Wednesday": "10:00 AM - 7:00 PM",
                    "Thursday": "10:00 AM - 7:00 PM",
                    "Friday": "10:00 AM - 8:00 PM",
                    "Saturday": "10:00 AM - 8:00 PM",
                    "Sunday": "11:00 AM - 6:00 PM"
                },
                features: ["Scent Bar", "Gift Wrapping"],
                coordinates: { lat: 42.3505, lng: -71.0759 },
                distance: null
            },
            {
                id: 8,
                name: "Lumière Austin",
                address: "258 South Lamar",
                city: "Austin",
                state: "TX", 
                zip: "78704",
                phone: "(512) 555-0258",
                email: "austin@lumierecandles.com",
                hours: {
                    "Monday": "11:00 AM - 7:00 PM",
                    "Tuesday": "11:00 AM - 7:00 PM",
                    "Wednesday": "11:00 AM - 7:00 PM",
                    "Thursday": "11:00 AM - 7:00 PM",
                    "Friday": "11:00 AM - 8:00 PM",
                    "Saturday": "10:00 AM - 8:00 PM",
                    "Sunday": "12:00 PM - 6:00 PM"
                },
                features: ["Scent Bar", "Gift Wrapping"],
                coordinates: { lat: 30.2500, lng: -97.7500 },
                distance: null
            }
        ];

        this.filteredStores = [...this.stores];
    }

    bindEvents() {
        // Search input
        const locationSearch = document.getElementById('locationSearch');
        if (locationSearch) {
            locationSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchStores();
                }
            });
        }
    }

    displayStores() {
        const storesList = document.getElementById('storesList');
        const storeCount = document.getElementById('storeCount');
        
        if (!storesList) return;

        // Update count
        if (storeCount) {
            const count = this.filteredStores.length;
            storeCount.textContent = `${count} store${count !== 1 ? 's' : ''}`;
        }

        // Clear existing content
        storesList.innerHTML = '';

        // Display stores
        this.filteredStores.forEach(store => {
            const storeCard = this.createStoreCard(store);
            storesList.appendChild(storeCard);
        });
    }

    createStoreCard(store) {
        const card = document.createElement('div');
        card.className = 'store-card mb-3 p-3 border rounded';
        
        const todayHours = this.getTodayHours(store);
        const isOpen = this.isStoreOpen(store);
        
        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="store-name mb-0">${store.name}</h5>
                <span class="badge ${isOpen ? 'bg-success' : 'bg-secondary'}">
                    ${isOpen ? 'Open' : 'Closed'}
                </span>
            </div>
            
            <div class="store-address mb-2">
                <i class="bi bi-geo-alt text-primary me-2"></i>
                <span>${store.address}, ${store.city}, ${store.state} ${store.zip}</span>
            </div>
            
            <div class="store-phone mb-2">
                <i class="bi bi-telephone text-primary me-2"></i>
                <a href="tel:${store.phone}" class="text-decoration-none">${store.phone}</a>
            </div>
            
            <div class="store-hours mb-3">
                <i class="bi bi-clock text-primary me-2"></i>
                <span>${todayHours}</span>
            </div>
            
            ${store.distance ? `
                <div class="store-distance mb-3">
                    <i class="bi bi-compass text-primary me-2"></i>
                    <span>${store.distance.toFixed(1)} miles away</span>
                </div>
            ` : ''}
            
            <div class="store-features mb-3">
                ${store.features.map(feature => 
                    `<span class="badge bg-light text-dark me-1 mb-1">${feature}</span>`
                ).join('')}
            </div>
            
            <div class="store-actions">
                <button class="btn btn-primary btn-sm me-2" onclick="storeLocator.showStoreDetails(${store.id})">
                    View Details
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="storeLocator.getDirections(${store.id})">
                    <i class="bi bi-compass"></i> Directions
                </button>
            </div>
        `;
        
        return card;
    }

    getTodayHours(store) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        return store.hours[today] || 'Hours not available';
    }

    isStoreOpen(store) {
        const now = new Date();
        const today = now.toLocaleDateString('en-US', { weekday: 'long' });
        const todayHours = store.hours[today];
        
        if (!todayHours || todayHours === 'Closed') return false;
        
        // Parse hours (simplified - assumes format like "10:00 AM - 8:00 PM")
        const hoursMatch = todayHours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/);
        if (!hoursMatch) return false;
        
        const [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = hoursMatch;
        
        // Convert to 24-hour format
        let openTime = parseInt(openHour);
        if (openPeriod === 'PM' && openTime !== 12) openTime += 12;
        if (openPeriod === 'AM' && openTime === 12) openTime = 0;
        
        let closeTime = parseInt(closeHour);
        if (closePeriod === 'PM' && closeTime !== 12) closeTime += 12;
        if (closePeriod === 'AM' && closeTime === 12) closeTime = 0;
        
        const currentTime = now.getHours() + (now.getMinutes() / 60);
        const openTimeDecimal = openTime + (parseInt(openMin) / 60);
        const closeTimeDecimal = closeTime + (parseInt(closeMin) / 60);
        
        return currentTime >= openTimeDecimal && currentTime <= closeTimeDecimal;
    }

    searchStores() {
        const searchInput = document.getElementById('locationSearch');
        if (!searchInput) return;
        
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.filteredStores = [...this.stores];
            this.displayStores();
            return;
        }
        
        // Filter stores based on search query
        this.filteredStores = this.stores.filter(store => {
            return (
                store.city.toLowerCase().includes(query) ||
                store.state.toLowerCase().includes(query) ||
                store.zip.includes(query) ||
                store.address.toLowerCase().includes(query) ||
                store.name.toLowerCase().includes(query)
            );
        });
        
        this.displayStores();
        
        // Show search results message
        if (this.filteredStores.length === 0) {
            this.showNoResults(query);
        }
    }

    showNoResults(query) {
        const storesList = document.getElementById('storesList');
        if (!storesList) return;
        
        storesList.innerHTML = `
            <div class="no-results text-center py-4">
                <i class="bi bi-search display-4 text-muted"></i>
                <h5 class="mt-3">No stores found</h5>
                <p class="text-muted">No stores found for "${query}". Try searching with a different location.</p>
                <button class="btn btn-outline-primary" onclick="storeLocator.clearSearch()">
                    Show All Stores
                </button>
            </div>
        `;
    }

    clearSearch() {
        const searchInput = document.getElementById('locationSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.filteredStores = [...this.stores];
        this.displayStores();
    }

    useCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }
        
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Getting location...';
        button.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                this.calculateDistances();
                this.sortByDistance();
                this.displayStores();
                
                button.innerHTML = originalText;
                button.disabled = false;
                
                // Update search input with approximate location
                this.reverseGeocode(this.userLocation);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please search manually.');
                
                button.innerHTML = originalText;
                button.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }

    calculateDistances() {
        if (!this.userLocation) return;
        
        this.stores.forEach(store => {
            store.distance = this.calculateDistance(
                this.userLocation.lat,
                this.userLocation.lng,
                store.coordinates.lat,
                store.coordinates.lng
            );
        });
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 3959; // Earth's radius in miles
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    sortByDistance() {
        this.filteredStores.sort((a, b) => {
            if (a.distance === null && b.distance === null) return 0;
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
    }

    reverseGeocode(location) {
        // In a real app, you would use a geocoding service
        // For demo purposes, just show coordinates
        const searchInput = document.getElementById('locationSearch');
        if (searchInput) {
            searchInput.value = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
        }
    }

    showStoreDetails(storeId) {
        const store = this.stores.find(s => s.id === storeId);
        if (!store) return;
        
        const modal = document.getElementById('storeDetailsModal');
        const title = document.getElementById('storeModalTitle');
        const body = document.getElementById('storeModalBody');
        const directionsBtn = document.getElementById('getDirectionsBtn');
        
        if (!modal || !title || !body) return;
        
        title.textContent = store.name;
        
        body.innerHTML = `
            <div class="store-details">
                <div class="mb-3">
                    <h6><i class="bi bi-geo-alt text-primary me-2"></i>Address</h6>
                    <p class="mb-0">${store.address}<br>${store.city}, ${store.state} ${store.zip}</p>
                </div>
                
                <div class="mb-3">
                    <h6><i class="bi bi-telephone text-primary me-2"></i>Contact</h6>
                    <p class="mb-1">Phone: <a href="tel:${store.phone}">${store.phone}</a></p>
                    <p class="mb-0">Email: <a href="mailto:${store.email}">${store.email}</a></p>
                </div>
                
                <div class="mb-3">
                    <h6><i class="bi bi-clock text-primary me-2"></i>Store Hours</h6>
                    <div class="hours-list">
                        ${Object.entries(store.hours).map(([day, hours]) => `
                            <div class="d-flex justify-content-between">
                                <span>${day}:</span>
                                <span>${hours}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="mb-3">
                    <h6><i class="bi bi-star text-primary me-2"></i>Store Features</h6>
                    <div class="features-list">
                        ${store.features.map(feature => 
                            `<span class="badge bg-primary me-1 mb-1">${feature}</span>`
                        ).join('')}
                    </div>
                </div>
                
                ${store.distance ? `
                    <div class="mb-3">
                        <h6><i class="bi bi-compass text-primary me-2"></i>Distance</h6>
                        <p class="mb-0">${store.distance.toFixed(1)} miles from your location</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Set up directions button
        if (directionsBtn) {
            directionsBtn.onclick = () => this.getDirections(storeId);
        }
        
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    getDirections(storeId) {
        const store = this.stores.find(s => s.id === storeId);
        if (!store) return;
        
        const address = encodeURIComponent(`${store.address}, ${store.city}, ${store.state} ${store.zip}`);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
        
        window.open(googleMapsUrl, '_blank');
    }
}

// Global functions
function searchStores() {
    if (window.storeLocator) {
        window.storeLocator.searchStores();
    }
}

function useCurrentLocation() {
    if (window.storeLocator) {
        window.storeLocator.useCurrentLocation();
    }
}

// Initialize store locator
let storeLocator;

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('store-locator.html')) {
        storeLocator = new StoreLocator();
        window.storeLocator = storeLocator;
    }
});

// Export for global access
window.searchStores = searchStores;
window.useCurrentLocation = useCurrentLocation;

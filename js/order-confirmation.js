// ===== ORDER CONFIRMATION FUNCTIONALITY =====

class OrderConfirmationManager {
    constructor() {
        this.orderData = null;
        this.init();
    }

    init() {
        this.loadOrderData();
        this.displayOrderDetails();
        this.calculateDeliveryDate();
        this.loadRecommendations();
        this.initializeEventListeners();
    }

    loadOrderData() {
        // Try to load order data from localStorage
        const savedOrder = localStorage.getItem('lastOrder');
        
        if (savedOrder) {
            try {
                this.orderData = JSON.parse(savedOrder);
            } catch (error) {
                console.error('Error parsing order data:', error);
                this.handleMissingOrder();
                return;
            }
        } else {
            // If no order data, check URL parameters for order ID
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('order');
            
            if (orderId) {
                // In a real app, you would fetch order data from server
                this.loadOrderById(orderId);
            } else {
                this.handleMissingOrder();
                return;
            }
        }

        // Clear the saved order data after loading
        if (savedOrder) {
            localStorage.removeItem('lastOrder');
        }
    }

    handleMissingOrder() {
        // Redirect to home page if no order data is found
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        
        // Show error message
        document.body.innerHTML = `
            <div class="container mt-5 text-center">
                <div class="alert alert-warning">
                    <h4>Order not found</h4>
                    <p>We couldn't find your order details. Redirecting to home page...</p>
                </div>
            </div>
        `;
    }

    loadOrderById(orderId) {
        // Simulate loading order by ID (in real app, this would be an API call)
        // For demo purposes, create a sample order
        this.orderData = {
            orderId: orderId,
            timestamp: new Date().toISOString(),
            customer: {
                email: 'customer@example.com',
                firstName: 'John',
                lastName: 'Doe',
                phone: '(555) 123-4567'
            },
            shipping: {
                address: '123 Main St',
                apartment: 'Apt 4B',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                method: 'standard'
            },
            payment: {
                method: 'card'
            },
            items: [],
            totals: {
                subtotal: 89.97,
                discount: 0,
                shipping: 9.99,
                tax: 7.99,
                total: 107.95
            },
            status: 'confirmed'
        };
    }

    displayOrderDetails() {
        if (!this.orderData) return;

        // Update order number
        const orderNumberElement = document.getElementById('orderNumber');
        if (orderNumberElement) {
            orderNumberElement.textContent = this.orderData.orderId;
        }

        // Update order date
        const orderDateElement = document.getElementById('orderDate');
        if (orderDateElement) {
            const orderDate = new Date(this.orderData.timestamp);
            orderDateElement.textContent = orderDate.toLocaleString();
        }

        // Display order items
        this.displayOrderItems();

        // Display order totals
        this.displayOrderTotals();

        // Display shipping address
        this.displayShippingAddress();

        // Display payment method
        this.displayPaymentMethod();
    }

    displayOrderItems() {
        const orderItemsContainer = document.getElementById('orderItems');
        if (!orderItemsContainer || !this.orderData.items) return;

        if (this.orderData.items.length === 0) {
            orderItemsContainer.innerHTML = `
                <div class="order-item text-center py-4">
                    <p class="text-muted">No items found in this order.</p>
                </div>
            `;
            return;
        }

        let itemsHTML = '';
        this.orderData.items.forEach(item => {
            itemsHTML += `
                <div class="order-item">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.title}" 
                             style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" class="me-3">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${item.title}</h6>
                            <p class="text-muted mb-1">${item.size}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-muted">Qty: ${item.quantity}</span>
                                <span class="fw-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        orderItemsContainer.innerHTML = itemsHTML;
    }

    displayOrderTotals() {
        if (!this.orderData.totals) return;

        const totals = this.orderData.totals;

        // Update totals display
        const subtotalElement = document.getElementById('subtotalAmount');
        const discountElement = document.getElementById('discountAmount');
        const discountRow = document.getElementById('discountRow');
        const shippingElement = document.getElementById('shippingAmount');
        const taxElement = document.getElementById('taxAmount');
        const totalElement = document.getElementById('totalAmount');

        if (subtotalElement) {
            subtotalElement.textContent = `$${totals.subtotal.toFixed(2)}`;
        }

        if (totals.discount > 0) {
            if (discountElement) {
                discountElement.textContent = `-$${totals.discount.toFixed(2)}`;
            }
            if (discountRow) {
                discountRow.style.display = 'flex';
            }
        }

        if (shippingElement) {
            shippingElement.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
        }

        if (taxElement) {
            taxElement.textContent = `$${totals.tax.toFixed(2)}`;
        }

        if (totalElement) {
            totalElement.textContent = `$${totals.total.toFixed(2)}`;
        }
    }

    displayShippingAddress() {
        const shippingAddressContainer = document.getElementById('shippingAddress');
        if (!shippingAddressContainer || !this.orderData.shipping) return;

        const shipping = this.orderData.shipping;
        const customer = this.orderData.customer;

        let addressHTML = `
            <div class="mb-2">
                <strong>${customer.firstName} ${customer.lastName}</strong>
            </div>
            <div>${shipping.address}</div>
        `;

        if (shipping.apartment) {
            addressHTML += `<div>${shipping.apartment}</div>`;
        }

        addressHTML += `
            <div>${shipping.city}, ${shipping.state} ${shipping.zipCode}</div>
            <div class="mt-2">
                <small class="text-muted">
                    <i class="bi bi-truck me-1"></i>
                    ${this.getShippingMethodName(shipping.method)}
                </small>
            </div>
        `;

        shippingAddressContainer.innerHTML = addressHTML;
    }

    displayPaymentMethod() {
        const paymentMethodContainer = document.getElementById('paymentMethod');
        if (!paymentMethodContainer || !this.orderData.payment) return;

        const payment = this.orderData.payment;
        let paymentHTML = '';

        switch (payment.method) {
            case 'card':
                paymentHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-credit-card me-2"></i>
                        <span>Credit Card</span>
                    </div>
                    <small class="text-muted">Payment processed securely</small>
                `;
                break;
            case 'paypal':
                paymentHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-paypal me-2 text-primary"></i>
                        <span>PayPal</span>
                    </div>
                    <small class="text-muted">Payment processed via PayPal</small>
                `;
                break;
            case 'apple':
                paymentHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-apple me-2"></i>
                        <span>Apple Pay</span>
                    </div>
                    <small class="text-muted">Payment processed via Apple Pay</small>
                `;
                break;
            default:
                paymentHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-credit-card me-2"></i>
                        <span>Payment Method</span>
                    </div>
                    <small class="text-muted">Payment processed securely</small>
                `;
        }

        paymentMethodContainer.innerHTML = paymentHTML;
    }

    calculateDeliveryDate() {
        if (!this.orderData) return;

        const orderDate = new Date(this.orderData.timestamp);
        const shippingMethod = this.orderData.shipping?.method || 'standard';
        
        let deliveryDays = 7; // Default to 7 days
        
        switch (shippingMethod) {
            case 'standard':
                deliveryDays = 7;
                break;
            case 'express':
                deliveryDays = 3;
                break;
            case 'overnight':
                deliveryDays = 1;
                break;
        }

        // Add business days (skip weekends)
        let deliveryDate = new Date(orderDate);
        let daysAdded = 0;
        
        while (daysAdded < deliveryDays) {
            deliveryDate.setDate(deliveryDate.getDate() + 1);
            
            // Skip weekends (0 = Sunday, 6 = Saturday)
            if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
                daysAdded++;
            }
        }

        const estimatedDeliveryElement = document.getElementById('estimatedDelivery');
        if (estimatedDeliveryElement) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            estimatedDeliveryElement.textContent = deliveryDate.toLocaleDateString('en-US', options);
        }
    }

    getShippingMethodName(method) {
        switch (method) {
            case 'standard':
                return 'Standard Shipping (5-7 business days)';
            case 'express':
                return 'Express Shipping (2-3 business days)';
            case 'overnight':
                return 'Overnight Shipping (Next business day)';
            default:
                return 'Standard Shipping';
        }
    }

    async loadRecommendations() {
        const recommendationsContainer = document.getElementById('recommendations');
        if (!recommendationsContainer) return;

        try {
            // Load products for recommendations
            let products = [];
            
            if (window.products && window.products.length > 0) {
                products = window.products;
            } else {
                const response = await fetch('data/products.json');
                const data = await response.json();
                products = data.products;
            }

            // Get random products for recommendations
            const shuffled = products.sort(() => 0.5 - Math.random());
            const recommendations = shuffled.slice(0, 4);

            let recommendationsHTML = '';
            recommendations.forEach(product => {
                recommendationsHTML += `
                    <div class="col-lg-3 col-md-6 mb-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="position-relative">
                                <img src="${product.images[0]}" class="card-img-top" alt="${product.title}" style="height: 250px; object-fit: cover;">
                                ${product.new_arrival ? '<span class="badge bg-success position-absolute top-0 start-0 m-2">New</span>' : ''}
                                ${product.featured ? '<span class="badge bg-warning position-absolute top-0 end-0 m-2">Popular</span>' : ''}
                            </div>
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title">${product.title}</h6>
                                <p class="card-text text-muted small flex-grow-1">${product.description.substring(0, 80)}...</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h6 mb-0">$${product.price.toFixed(2)}</span>
                                    <div class="text-warning">
                                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                                    </div>
                                </div>
                                <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm mt-2">View Product</a>
                            </div>
                        </div>
                    </div>
                `;
            });

            recommendationsContainer.innerHTML = recommendationsHTML;
        } catch (error) {
            console.error('Error loading recommendations:', error);
            recommendationsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">Unable to load recommendations at this time.</p>
                </div>
            `;
        }
    }

    initializeEventListeners() {
        // Email confirmation
        const emailBtn = document.querySelector('a[href^="mailto:"]');
        if (emailBtn && this.orderData) {
            const subject = `Order Confirmation - ${this.orderData.orderId}`;
            const body = `Hello,\n\nI have a question about my recent order ${this.orderData.orderId}.\n\nThank you!`;
            emailBtn.href = `mailto:support@lumierecandles.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
    }
}

// Social sharing functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Just ordered some amazing candles from Lumière Candles! 🕯️✨');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Just ordered some amazing candles from @LumiereCandles! 🕯️✨ #candles #homedecor');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnInstagram() {
    // Instagram doesn't support direct sharing via URL, so we'll copy text to clipboard
    const text = 'Just ordered some amazing candles from Lumière Candles! 🕯️✨ #candles #homedecor #lumierecandles';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Caption copied to clipboard! You can now paste it in your Instagram post.');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Caption copied to clipboard! You can now paste it in your Instagram post.');
    }
}

function copyOrderLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            alert('Order link copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Order link copied to clipboard!');
    }
}

// Initialize order confirmation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.orderConfirmationManager = new OrderConfirmationManager();
});

// Export for global access
window.OrderConfirmationManager = OrderConfirmationManager;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnInstagram = shareOnInstagram;
window.copyOrderLink = copyOrderLink;

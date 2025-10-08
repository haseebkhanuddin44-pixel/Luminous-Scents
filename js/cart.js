// ===== CART FUNCTIONALITY =====

// Cart-specific functions and utilities
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.promoCode = localStorage.getItem('promoCode') || '';
        this.discount = 0;
    }

    // Add item to cart
    addItem(productId, size = 'Small (6 oz)', quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return false;

        const sizeOption = product.size_options.find(s => s.size === size);
        const price = sizeOption ? sizeOption.price : product.price;

        // Check if item already exists
        const existingItem = this.cart.find(item => 
            item.id === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                title: product.title,
                slug: product.slug,
                image: product.images[0],
                size: size,
                price: price,
                quantity: quantity,
                stock: product.stock
            });
        }

        this.saveCart();
        return true;
    }

    // Remove item from cart
    removeItem(productId, size) {
        const index = this.cart.findIndex(item => 
            item.id === productId && item.size === size
        );
        
        if (index > -1) {
            this.cart.splice(index, 1);
            this.saveCart();
            return true;
        }
        return false;
    }

    // Update item quantity
    updateQuantity(productId, size, quantity) {
        const item = this.cart.find(item => 
            item.id === productId && item.size === size
        );

        if (item) {
            if (quantity <= 0) {
                return this.removeItem(productId, size);
            }
            item.quantity = Math.min(quantity, item.stock);
            this.saveCart();
            return true;
        }
        return false;
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.promoCode = '';
        this.discount = 0;
        this.saveCart();
        localStorage.removeItem('promoCode');
    }

    // Get cart totals
    getTotals() {
        const subtotal = this.cart.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
        
        const discountAmount = subtotal * (this.discount / 100);
        const shipping = this.calculateShipping(subtotal - discountAmount);
        const tax = (subtotal - discountAmount + shipping) * 0.08; // 8% tax
        const total = subtotal - discountAmount + shipping + tax;

        return {
            subtotal: subtotal,
            discount: discountAmount,
            shipping: shipping,
            tax: tax,
            total: total,
            itemCount: this.cart.reduce((sum, item) => sum + item.quantity, 0)
        };
    }

    // Calculate shipping cost
    calculateShipping(subtotal) {
        if (subtotal >= 75) return 0; // Free shipping over $75
        if (subtotal >= 50) return 5.99; // Reduced shipping
        return 9.99; // Standard shipping
    }

    // Apply promo code
    applyPromoCode(code) {
        const validCodes = {
            'FREESHIP75': { type: 'shipping', value: 0, minOrder: 75 },
            'SAVE10': { type: 'percentage', value: 10, minOrder: 0 },
            'SAVE20': { type: 'percentage', value: 20, minOrder: 100 },
            'WELCOME15': { type: 'percentage', value: 15, minOrder: 50 }
        };

        const promo = validCodes[code.toUpperCase()];
        if (!promo) {
            return { success: false, message: 'Invalid promo code' };
        }

        const subtotal = this.cart.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );

        if (subtotal < promo.minOrder) {
            return { 
                success: false, 
                message: `Minimum order of $${promo.minOrder} required for this code` 
            };
        }

        this.promoCode = code.toUpperCase();
        this.discount = promo.type === 'percentage' ? promo.value : 0;
        
        localStorage.setItem('promoCode', this.promoCode);
        this.saveCart();

        return { 
            success: true, 
            message: `Promo code applied! ${promo.value}% discount` 
        };
    }

    // Remove promo code
    removePromoCode() {
        this.promoCode = '';
        this.discount = 0;
        localStorage.removeItem('promoCode');
        this.saveCart();
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { cart: this.cart, totals: this.getTotals() }
        }));
    }

    // Get cart items
    getItems() {
        return this.cart;
    }

    // Get item count
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Check if product is in cart
    hasProduct(productId, size = null) {
        if (size) {
            return this.cart.some(item => item.id === productId && item.size === size);
        }
        return this.cart.some(item => item.id === productId);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Make cart manager globally available
window.cartManager = cartManager;

// Cart page specific functions
function initializeCartPage() {
    if (!document.getElementById('cartPage')) return;

    loadCartPage();
    initializePromoCode();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', function(e) {
        loadCartPage();
    });
}

// Load cart page content
function loadCartPage() {
    const cartItems = cartManager.getItems();
    const cartContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartContainer || !cartSummary) return;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="bi bi-bag display-1 text-muted"></i>
                <h3 class="mt-3">Your cart is empty</h3>
                <p class="text-muted">Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="btn btn-primary btn-lg">Start Shopping</a>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }

    // Render cart items
    let cartHTML = '';
    cartItems.forEach(item => {
        cartHTML += createCartItemHTML(item);
    });
    cartContainer.innerHTML = cartHTML;

    // Render cart summary
    renderCartSummary();
}

// Create cart item HTML
function createCartItemHTML(item) {
    const itemTotal = item.price * item.quantity;
    
    return `
        <div class="cart-item-row" data-product-id="${item.id}" data-size="${item.size}">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image}" alt="${item.title}" class="img-fluid rounded">
                </div>
                <div class="col-md-4">
                    <h5 class="mb-1">${item.title}</h5>
                    <p class="text-muted mb-0">${item.size}</p>
                    <small class="text-muted">In stock: ${item.stock}</small>
                </div>
                <div class="col-md-2">
                    <div class="quantity-controls">
                        <button class="btn btn-outline-secondary btn-sm" onclick="updateCartItemQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">
                            <i class="bi bi-dash"></i>
                        </button>
                        <input type="number" class="form-control form-control-sm mx-2" 
                               value="${item.quantity}" min="1" max="${item.stock}"
                               onchange="updateCartItemQuantity(${item.id}, '${item.size}', this.value)"
                               style="width: 70px; text-align: center;">
                        <button class="btn btn-outline-secondary btn-sm" onclick="updateCartItemQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2 text-center">
                    <span class="fw-bold">$${item.price.toFixed(2)}</span>
                </div>
                <div class="col-md-2 text-center">
                    <span class="fw-bold">$${itemTotal.toFixed(2)}</span>
                    <button class="btn btn-link text-danger p-0 ms-2" 
                            onclick="removeCartItem(${item.id}, '${item.size}')"
                            aria-label="Remove item">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <hr>
        </div>
    `;
}

// Render cart summary
function renderCartSummary() {
    const totals = cartManager.getTotals();
    const summaryContainer = document.getElementById('cartSummary');
    
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Order Summary</h5>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal (${totals.itemCount} items):</span>
                    <span>$${totals.subtotal.toFixed(2)}</span>
                </div>
                ${totals.discount > 0 ? `
                    <div class="d-flex justify-content-between mb-2 text-success">
                        <span>Discount (${cartManager.promoCode}):</span>
                        <span>-$${totals.discount.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>${totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>$${totals.tax.toFixed(2)}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong>$${totals.total.toFixed(2)}</strong>
                </div>
                
                <!-- Promo Code Section -->
                <div class="promo-code-section mb-3">
                    <div class="input-group">
                        <input type="text" class="form-control" id="promoCodeInput" 
                               placeholder="Enter promo code" value="${cartManager.promoCode}">
                        <button class="btn btn-outline-primary" onclick="applyPromoCode()">
                            Apply
                        </button>
                    </div>
                    ${cartManager.promoCode ? `
                        <div class="mt-2">
                            <span class="badge bg-success me-2">${cartManager.promoCode}</span>
                            <button class="btn btn-link btn-sm p-0" onclick="removePromoCode()">Remove</button>
                        </div>
                    ` : ''}
                </div>
                
                <button class="btn btn-primary w-100 btn-lg" onclick="proceedToCheckout()">
                    Proceed to Checkout
                </button>
                <a href="shop.html" class="btn btn-outline-primary w-100 mt-2">
                    Continue Shopping
                </a>
            </div>
        </div>
    `;
}

// Update cart item quantity
function updateCartItemQuantity(productId, size, quantity) {
    const newQuantity = parseInt(quantity);
    if (newQuantity < 1) {
        removeCartItem(productId, size);
        return;
    }
    
    cartManager.updateQuantity(productId, size, newQuantity);
}

// Remove cart item
function removeCartItem(productId, size) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        cartManager.removeItem(productId, size);
        showNotification('Item removed from cart', 'info');
    }
}

// Initialize promo code functionality
function initializePromoCode() {
    const promoInput = document.getElementById('promoCodeInput');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promoCodeInput');
    if (!promoInput) return;
    
    const code = promoInput.value.trim();
    if (!code) {
        showNotification('Please enter a promo code', 'warning');
        return;
    }
    
    const result = cartManager.applyPromoCode(code);
    
    if (result.success) {
        showNotification(result.message, 'success');
        renderCartSummary();
    } else {
        showNotification(result.message, 'error');
    }
}

// Remove promo code
function removePromoCode() {
    cartManager.removePromoCode();
    showNotification('Promo code removed', 'info');
    renderCartSummary();
}

// Proceed to checkout
function proceedToCheckout() {
    const totals = cartManager.getTotals();
    
    if (totals.itemCount === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Save for later functionality
function saveForLater(productId, size) {
    // Move item from cart to saved items
    const item = cartManager.getItems().find(item => 
        item.id === productId && item.size === size
    );
    
    if (item) {
        // Add to saved items (localStorage)
        let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
        savedItems.push(item);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        
        // Remove from cart
        cartManager.removeItem(productId, size);
        showNotification('Item saved for later', 'success');
    }
}

// Move saved item back to cart
function moveToCart(productId, size) {
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    const itemIndex = savedItems.findIndex(item => 
        item.id === productId && item.size === size
    );
    
    if (itemIndex > -1) {
        const item = savedItems[itemIndex];
        cartManager.addItem(item.id, item.size, item.quantity);
        
        // Remove from saved items
        savedItems.splice(itemIndex, 1);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        
        showNotification('Item moved to cart', 'success');
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
});

// Export functions for global access
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeCartItem = removeCartItem;
window.applyPromoCode = applyPromoCode;
window.removePromoCode = removePromoCode;
window.proceedToCheckout = proceedToCheckout;
window.saveForLater = saveForLater;
window.moveToCart = moveToCart;
window.cartManager = cartManager;

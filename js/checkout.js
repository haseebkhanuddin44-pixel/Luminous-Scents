// ===== CHECKOUT FUNCTIONALITY =====

class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.formData = {};
        this.shippingRates = {
            standard: 9.99,
            express: 19.99,
            overnight: 29.99
        };
        this.selectedShipping = 'standard';
        this.selectedPayment = 'card';
        
        this.init();
    }

    init() {
        console.log('Checkout manager initializing...');
        console.log('Cart manager available:', !!window.cartManager);
        if (window.cartManager) {
            console.log('Cart items:', window.cartManager.getItems());
            console.log('Cart item count:', window.cartManager.getItemCount());
        }
        
        this.loadOrderSummary();
        this.initializeEventListeners();
        this.initializeFormValidation();
        this.initializePaymentMethods();
        this.initializeShippingMethods();
        this.updateShippingCosts();
        this.loadSavedData();
    }

    initializeEventListeners() {
        // Form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Promo code
        const applyPromoBtn = document.getElementById('applyPromo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        const promoInput = document.getElementById('promoCode');
        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyPromoCode();
                }
            });
        }

        // Real-time form validation
        const formInputs = document.querySelectorAll('#checkoutForm input, #checkoutForm select');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });
        });

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => this.formatExpiryDate(e));
        }

        // CVV validation
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => this.formatCVV(e));
        }

        // Auto-advance steps
        document.addEventListener('focusout', () => {
            setTimeout(() => this.checkStepCompletion(), 100);
        });
    }

    initializePaymentMethods() {
        const paymentMethods = document.querySelectorAll('.payment-method[data-payment]');
        const cardForm = document.getElementById('cardForm');
        
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Remove selected class from all methods
                paymentMethods.forEach(m => m.classList.remove('selected'));
                
                // Add selected class to clicked method
                method.classList.add('selected');
                
                // Update radio button
                const radio = method.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    this.selectedPayment = radio.value;
                }
                
                // Show/hide card form
                if (cardForm) {
                    if (this.selectedPayment === 'card') {
                        cardForm.style.display = 'block';
                    } else {
                        cardForm.style.display = 'none';
                    }
                }
            });
        });
    }

    initializeShippingMethods() {
        const shippingMethods = document.querySelectorAll('.payment-method[data-shipping]');
        
        shippingMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Remove selected class from all methods
                shippingMethods.forEach(m => m.classList.remove('selected'));
                
                // Add selected class to clicked method
                method.classList.add('selected');
                
                // Update radio button
                const radio = method.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    this.selectedShipping = radio.value;
                }
                
                this.updateShippingCosts();
            });
        });
    }

    initializeFormValidation() {
        // Add Bootstrap validation classes
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.classList.add('needs-validation');
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing validation classes
        field.classList.remove('is-valid', 'is-invalid');

        // Skip validation for optional fields
        if (!field.required && value === '') {
            return true;
        }

        // Required field validation
        if (field.required && value === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Specific field validations
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;

            case 'tel':
                const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                if (value && !phoneRegex.test(value.replace(/\D/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number.';
                }
                break;

            default:
                // Custom validations based on field name
                if (field.name === 'cardNumber') {
                    const cardRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
                    if (value && !cardRegex.test(value.replace(/\s/g, ''))) {
                        isValid = false;
                        errorMessage = 'Please enter a valid card number.';
                    }
                } else if (field.name === 'expiryDate') {
                    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                    if (value && !expiryRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid expiry date (MM/YY).';
                    } else if (value) {
                        // Check if date is not in the past
                        const [month, year] = value.split('/');
                        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                        const now = new Date();
                        if (expiry < now) {
                            isValid = false;
                            errorMessage = 'Card has expired.';
                        }
                    }
                } else if (field.name === 'cvv') {
                    const cvvRegex = /^\d{3,4}$/;
                    if (value && !cvvRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid CVV.';
                    }
                } else if (field.name === 'zipCode') {
                    const zipRegex = /^\d{5}(-\d{4})?$/;
                    if (value && !zipRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid zip code.';
                    }
                }
                break;
        }

        // Apply validation classes
        if (isValid) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
            
            // Update error message
            const feedback = field.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.textContent = errorMessage;
            }
        }

        return isValid;
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substr(0, 19);
        }
        
        e.target.value = formattedValue;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    }

    formatCVV(e) {
        let value = e.target.value.replace(/[^0-9]/gi, '');
        e.target.value = value.substring(0, 4);
    }

    checkStepCompletion() {
        const steps = [
            { id: 'contactStep', fields: ['email'] },
            { id: 'shippingStep', fields: ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'] },
            { id: 'shippingMethodStep', fields: [] },
            { id: 'paymentStep', fields: this.selectedPayment === 'card' ? ['cardNumber', 'cardName', 'expiryDate', 'cvv'] : [] }
        ];

        steps.forEach((step, index) => {
            const stepElement = document.getElementById(step.id);
            const stepNumber = index + 1;
            
            if (!stepElement) return;

            let isComplete = true;
            
            // Check required fields for this step
            step.fields.forEach(fieldName => {
                const field = document.querySelector(`[name="${fieldName}"]`);
                if (field && field.required) {
                    if (!field.value.trim() || field.classList.contains('is-invalid')) {
                        isComplete = false;
                    }
                }
            });

            // Update step appearance
            if (isComplete && stepNumber < this.currentStep) {
                stepElement.classList.remove('active');
                stepElement.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                stepElement.classList.add('active');
                stepElement.classList.remove('completed');
            } else {
                stepElement.classList.remove('active', 'completed');
            }
        });
    }

    loadOrderSummary() {
        const orderItemsContainer = document.getElementById('orderItems');
        if (!orderItemsContainer) return;

        // Wait for cartManager to be available
        if (!window.cartManager) {
            setTimeout(() => this.loadOrderSummary(), 100);
            return;
        }

        const cartItems = cartManager.getItems();
        const totals = cartManager.getTotals();

        // Display cart items
        if (cartItems.length === 0) {
            orderItemsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-cart-x display-4 text-muted"></i>
                    <p class="mt-3 text-muted">Your cart is empty</p>
                    <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }

        let itemsHTML = '';
        cartItems.forEach(item => {
            itemsHTML += `
                <div class="order-item">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.title}" 
                             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" class="me-3">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${item.title}</h6>
                            <small class="text-muted">${item.size}</small>
                            <div class="d-flex justify-content-between align-items-center mt-1">
                                <span class="small">Qty: ${item.quantity}</span>
                                <span class="fw-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        orderItemsContainer.innerHTML = itemsHTML;
        this.updateOrderTotals();
    }

    updateOrderTotals() {
        if (!window.cartManager) {
            setTimeout(() => this.updateOrderTotals(), 100);
            return;
        }

        const totals = cartManager.getTotals();
        
        // Update shipping based on selected method
        const shippingCost = this.shippingRates[this.selectedShipping] || 9.99;
        
        // Recalculate totals with selected shipping
        const subtotal = totals.subtotal;
        const discount = totals.discount;
        const shipping = subtotal >= 75 ? 0 : shippingCost; // Free shipping over $75
        const tax = (subtotal - discount + shipping) * 0.08;
        const total = subtotal - discount + shipping + tax;

        // Update display
        document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shippingAmount').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;

        // Show/hide discount row
        const discountRow = document.getElementById('discountRow');
        const discountAmount = document.getElementById('discountAmount');
        if (discount > 0) {
            discountRow.style.display = 'flex';
            discountAmount.textContent = `-$${discount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    updateShippingCosts() {
        // Update standard shipping cost based on cart total
        if (!window.cartManager) {
            setTimeout(() => this.updateShippingCosts(), 100);
            return;
        }
        
        const totals = cartManager.getTotals();
        const standardPriceElement = document.getElementById('standardPrice');
        
        if (standardPriceElement) {
            if (totals.subtotal >= 75) {
                standardPriceElement.textContent = 'FREE';
                this.shippingRates.standard = 0;
            } else if (totals.subtotal >= 50) {
                standardPriceElement.textContent = '$5.99';
                this.shippingRates.standard = 5.99;
            } else {
                standardPriceElement.textContent = '$9.99';
                this.shippingRates.standard = 9.99;
            }
        }
        
        this.updateOrderTotals();
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const promoMessage = document.getElementById('promoMessage');
        
        if (!promoInput || !promoMessage) return;
        
        if (!window.cartManager) {
            promoMessage.innerHTML = '<span class="text-danger">Cart not ready. Please try again.</span>';
            return;
        }

        const code = promoInput.value.trim();
        if (!code) {
            promoMessage.innerHTML = '<span class="text-danger">Please enter a promo code.</span>';
            return;
        }

        const result = cartManager.applyPromoCode(code);
        
        if (result.success) {
            promoMessage.innerHTML = `<span class="text-success"><i class="bi bi-check-circle me-1"></i>${result.message}</span>`;
            promoInput.value = '';
            this.updateOrderTotals();
        } else {
            promoMessage.innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-circle me-1"></i>${result.message}</span>`;
        }
    }

    collectFormData() {
        const form = document.getElementById('checkoutForm');
        if (!form) return null;

        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Add selected shipping and payment methods
        data.shippingMethod = this.selectedShipping;
        data.paymentMethod = this.selectedPayment;

        return data;
    }

    validateForm() {
        const form = document.getElementById('checkoutForm');
        if (!form) return false;

        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Additional validations for payment method
        if (this.selectedPayment === 'card') {
            const cardFields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
            cardFields.forEach(fieldName => {
                const field = document.querySelector(`[name="${fieldName}"]`);
                if (field && !this.validateField(field)) {
                    isValid = false;
                }
            });
        }

        return isValid;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            // Scroll to first invalid field
            const firstInvalid = document.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
            return;
        }

        const formData = this.collectFormData();
        if (!formData) return;

        // Show loading state
        const submitBtn = document.getElementById('placeOrderBtn');
        const spinner = document.getElementById('orderSpinner');
        
        if (submitBtn && spinner) {
            submitBtn.disabled = true;
            spinner.classList.remove('d-none');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing Order...';
        }

        try {
            // Simulate order processing
            await this.processOrder(formData);
            
            // Save order data
            this.saveOrderData(formData);
            
            // Redirect to confirmation page
            window.location.href = 'order-confirmation.html';
            
        } catch (error) {
            console.error('Order processing error:', error);
            
            // Show error message
            alert('There was an error processing your order. Please try again.');
            
            // Reset button state
            if (submitBtn && spinner) {
                submitBtn.disabled = false;
                spinner.classList.add('d-none');
                submitBtn.innerHTML = 'Place Order';
            }
        }
    }

    async processOrder(formData) {
        // Simulate API call to process order
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ orderId: this.generateOrderId(), status: 'confirmed' });
                } else {
                    reject(new Error('Payment processing failed'));
                }
            }, 2000);
        });
    }

    generateOrderId() {
        return 'LUM-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    saveOrderData(formData) {
        const orderData = {
            orderId: this.generateOrderId(),
            timestamp: new Date().toISOString(),
            customer: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone
            },
            shipping: {
                address: formData.address,
                apartment: formData.apartment,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                method: formData.shippingMethod
            },
            payment: {
                method: formData.paymentMethod
            },
            items: cartManager.getItems(),
            totals: cartManager.getTotals(),
            status: 'confirmed'
        };

        // Save to localStorage for confirmation page
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Clear cart after successful order
        cartManager.clearCart();
    }

    loadSavedData() {
        // Load any saved form data from localStorage
        const savedData = localStorage.getItem('checkoutFormData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // Populate form fields
                Object.keys(data).forEach(key => {
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field && field.type !== 'password') {
                        field.value = data[key];
                    }
                });
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }

    saveFormData() {
        const formData = this.collectFormData();
        if (formData) {
            // Remove sensitive data before saving
            delete formData.cardNumber;
            delete formData.cvv;
            
            localStorage.setItem('checkoutFormData', JSON.stringify(formData));
        }
    }
}

// Initialize checkout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on checkout page
    if (document.getElementById('checkoutForm')) {
        // Wait a bit for all scripts to load
        setTimeout(() => {
            window.checkoutManager = new CheckoutManager();
            
            // Save form data periodically
            setInterval(() => {
                if (window.checkoutManager) {
                    window.checkoutManager.saveFormData();
                }
            }, 30000); // Save every 30 seconds
        }, 200);
    }
});

// Export for global access
window.CheckoutManager = CheckoutManager;

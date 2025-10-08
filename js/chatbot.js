/**
 * Lumière Candles AI Chatbot
 * Interactive customer service assistant
 */

class LumiereChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.messages = [];
        this.apiEndpoint = '/api/chat'; // Backend endpoint
        this.isTyping = false;
        
        // Initialize chatbot
        this.init();
    }

    init() {
        this.bindEvents();
        this.hideNotification();
        this.loadWelcomeMessage();
    }

    bindEvents() {
        // Toggle chatbot
        document.getElementById('chatbot-toggle').addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Close chatbot
        document.getElementById('chatbot-close').addEventListener('click', () => {
            this.closeChatbot();
        });

        // Minimize chatbot
        document.getElementById('chatbot-minimize').addEventListener('click', () => {
            this.minimizeChatbot();
        });

        // Send message
        document.getElementById('chatbot-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Input events
        const input = document.getElementById('chatbot-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        input.addEventListener('input', () => {
            this.toggleSendButton();
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.sendQuickMessage(message);
            });
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            const chatbotContainer = document.getElementById('chatbot-container');
            if (!chatbotContainer.contains(e.target) && this.isOpen && !this.isMinimized) {
                // Don't close on outside click for better UX
            }
        });
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        window.classList.add('show');
        toggle.style.transform = 'scale(0.9)';
        
        this.isOpen = true;
        this.isMinimized = false;
        this.hideNotification();
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 300);

        // Scroll to bottom
        this.scrollToBottom();
    }

    closeChatbot() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        window.classList.remove('show');
        toggle.style.transform = 'scale(1)';
        
        this.isOpen = false;
        this.isMinimized = false;
    }

    minimizeChatbot() {
        const window = document.getElementById('chatbot-window');
        
        if (this.isMinimized) {
            window.classList.add('show');
            this.isMinimized = false;
        } else {
            window.classList.remove('show');
            this.isMinimized = true;
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        input.value = '';
        this.toggleSendButton();
        
        // Show typing indicator
        this.showTyping();
        
        // Send to AI (simulate delay)
        this.processMessage(message);
    }

    sendQuickMessage(message) {
        // Add user message
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTyping();
        
        // Process message
        this.processMessage(message);
    }

    async processMessage(message) {
        try {
            // Try to send to backend first
            const response = await this.sendToAI(message);
            
            // Hide typing indicator
            this.hideTyping();
            
            // Add bot response
            this.addMessage(response, 'bot');
            
        } catch (error) {
            console.log('Backend not available, using fallback responses');
            
            // Hide typing indicator
            this.hideTyping();
            
            // Use fallback response
            const response = this.getFallbackResponse(message);
            this.addMessage(response, 'bot');
        }
    }

    async sendToAI(message) {
        // Add message to conversation history
        this.messages.push({ role: 'user', content: message });
        
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation: this.messages
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Add AI response to conversation history
        this.messages.push({ role: 'assistant', content: data.response });
        
        return data.response;
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Product-related responses
        if (lowerMessage.includes('best sell') || lowerMessage.includes('popular')) {
            return "Our best-selling candles include our Vanilla Woods, Lavender Dreams, and Cinnamon Spice collections. These fragrances are customer favorites for their long-lasting scent and premium quality. Would you like to know more about any specific fragrance?";
        }
        
        if (lowerMessage.includes('new arrival') || lowerMessage.includes('latest')) {
            return "We're excited about our new Opulent Woods collection featuring rich, grounding fragrances of textured woods and exotic spices. We also have seasonal florals perfect for spring. Check out our 'New Arrivals' section to see all the latest additions!";
        }
        
        if (lowerMessage.includes('fragrance') || lowerMessage.includes('scent') || lowerMessage.includes('smell')) {
            return "We offer three main fragrance families: 🌸 Floral (delicate blooms and fresh petals), 🌲 Woody (rich woods and warm spices), and 🌿 Fresh (clean, crisp scents). What type of atmosphere are you looking to create?";
        }
        
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
            return "Our candles range from $24.99 for our signature collection to $39.99 for premium limited editions. We currently have free shipping on orders over $75! Would you like me to help you find candles within a specific budget?";
        }
        
        if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return "We offer free shipping on orders over $75! Standard shipping takes 3-5 business days, and we also offer expedited 1-2 day shipping. All orders are carefully packaged to ensure your candles arrive safely.";
        }
        
        if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
            return "We have a 30-day return policy for unused candles in original packaging. If you're not completely satisfied with your purchase, we'll gladly process a return or exchange. Customer satisfaction is our top priority!";
        }
        
        if (lowerMessage.includes('burn time') || lowerMessage.includes('how long')) {
            return "Our candles have excellent burn times: Small candles (8oz) burn for 45-50 hours, Medium candles (14oz) burn for 75-85 hours, and Large candles (22oz) burn for 110-130 hours. We use premium soy wax for clean, even burning.";
        }
        
        if (lowerMessage.includes('ingredients') || lowerMessage.includes('natural') || lowerMessage.includes('soy')) {
            return "All our candles are made with 100% natural soy wax, cotton wicks, and premium fragrance oils. We're committed to eco-friendly, sustainable luxury - no paraffin, no toxins, just pure, clean-burning candles.";
        }
        
        if (lowerMessage.includes('gift') || lowerMessage.includes('present')) {
            return "Our candles make perfect gifts! We offer beautiful gift wrapping and can include personalized messages. Consider our gift sets or let me help you choose the perfect fragrance based on the recipient's preferences.";
        }
        
        if (lowerMessage.includes('store') || lowerMessage.includes('location') || lowerMessage.includes('visit')) {
            return "You can find our store locations using our Store Locator. We have boutique locations in major cities, or you can shop our full collection online with convenient home delivery.";
        }
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! Welcome to Lumière Candles. I'm here to help you find the perfect candles for your space. Are you looking for a specific fragrance, or would you like recommendations based on your preferences?";
        }
        
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're very welcome! I'm always here to help with any questions about our candles, orders, or anything else. Is there anything else I can assist you with today?";
        }
        
        if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
            return "I'm here to help! I can assist you with:\n• Finding the perfect candle fragrance\n• Product information and recommendations\n• Order and shipping questions\n• Care instructions\n• Store locations\n\nWhat would you like to know more about?";
        }
        
        // Default response
        return "Thank you for your question! I'd love to help you find the perfect candles for your needs. Could you tell me more about what you're looking for? Are you interested in a specific fragrance family, or do you have questions about our products?";
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="bi bi-${sender === 'user' ? 'person-fill' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <p></p>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        
        // Add typewriter effect for bot messages
        if (sender === 'bot') {
            this.typewriterEffect(messageDiv.querySelector('p'), content);
        } else {
            messageDiv.querySelector('p').textContent = content;
        }
        
        this.scrollToBottom();
    }

    typewriterEffect(element, text) {
        let index = 0;
        const speed = 30; // milliseconds per character
        
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, speed);
                this.scrollToBottom();
            }
        };
        
        typeChar();
    }

    showTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    toggleSendButton() {
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');
        
        if (input.value.trim()) {
            sendBtn.disabled = false;
        } else {
            sendBtn.disabled = true;
        }
    }

    showNotification() {
        const notification = document.getElementById('chatbot-notification');
        notification.style.display = 'flex';
    }

    hideNotification() {
        const notification = document.getElementById('chatbot-notification');
        notification.style.display = 'none';
    }

    loadWelcomeMessage() {
        // Welcome message is already in HTML, no need to add programmatically
    }

    // Public methods for external use
    sendNotification(message) {
        if (!this.isOpen) {
            this.showNotification();
        }
    }

    openWithMessage(message) {
        this.openChatbot();
        setTimeout(() => {
            document.getElementById('chatbot-input').value = message;
            this.toggleSendButton();
        }, 300);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lumiereChatbot = new LumiereChatbot();
    
    // Show notification after 5 seconds if not opened
    setTimeout(() => {
        if (!window.lumiereChatbot.isOpen) {
            window.lumiereChatbot.sendNotification();
        }
    }, 5000);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LumiereChatbot;
}

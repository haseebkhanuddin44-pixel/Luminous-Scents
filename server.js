/**
 * Lumière Candles AI Chatbot Server
 * Express.js server with multi-AI provider support
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// AI Provider configurations
const AI_PROVIDERS = {
    openai: {
        name: 'OpenAI GPT',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    },
    anthropic: {
        name: 'Anthropic Claude',
        endpoint: 'https://api.anthropic.com/v1/messages',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        }
    },
    gemini: {
        name: 'Google Gemini',
        endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

// System prompt for the AI
const SYSTEM_PROMPT = `You are a helpful customer service assistant for Lumière Candles, a premium handcrafted candle company. 

About Lumière Candles:
- We create premium handcrafted candles made with 100% natural soy wax
- Our fragrances are carefully curated and come in three main families: Floral, Woody, and Fresh
- We offer candles in three sizes: Small (8oz, 45-50hr burn), Medium (14oz, 75-85hr burn), Large (22oz, 110-130hr burn)
- Price range: $24.99 - $39.99
- Free shipping on orders over $75
- 30-day return policy
- We have physical stores and online shopping
- Current collections include: Best Sellers, New Arrivals, Opulent Woods, Seasonal Florals

Your personality:
- Warm, friendly, and knowledgeable
- Passionate about candles and home fragrance
- Helpful in finding the perfect candle for each customer
- Professional but approachable

Guidelines:
- Always be helpful and informative
- Ask follow-up questions to better understand customer needs
- Recommend specific products when appropriate
- Provide accurate information about shipping, returns, and policies
- If you don't know something specific, offer to help them contact customer service
- Keep responses conversational and not too long
- Focus on the luxury and quality aspects of our products

Respond naturally and helpfully to customer inquiries.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversation = [] } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Input validation
        if (message.length > 1000) {
            return res.status(400).json({ error: 'Message too long' });
        }

        // Get AI provider (default to OpenAI, fallback to others)
        const provider = process.env.AI_PROVIDER || 'openai';
        
        let response;
        
        try {
            response = await getAIResponse(message, conversation, provider);
        } catch (error) {
            console.log(`${provider} failed, trying fallback...`);
            // Try other providers as fallback
            const fallbackProviders = Object.keys(AI_PROVIDERS).filter(p => p !== provider);
            
            for (const fallbackProvider of fallbackProviders) {
                try {
                    response = await getAIResponse(message, conversation, fallbackProvider);
                    break;
                } catch (fallbackError) {
                    console.log(`${fallbackProvider} also failed`);
                    continue;
                }
            }
            
            if (!response) {
                throw new Error('All AI providers failed');
            }
        }

        res.json({ response });
        
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ 
            error: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment or contact our customer service team for immediate assistance.' 
        });
    }
});

async function getAIResponse(message, conversation, provider) {
    const config = AI_PROVIDERS[provider];
    
    if (!config) {
        throw new Error(`Unknown AI provider: ${provider}`);
    }

    let requestBody;
    
    switch (provider) {
        case 'openai':
            requestBody = {
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...conversation.slice(-10), // Keep last 10 messages for context
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            };
            break;
            
        case 'anthropic':
            requestBody = {
                model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
                max_tokens: 500,
                messages: [
                    ...conversation.slice(-10),
                    { role: 'user', content: `${SYSTEM_PROMPT}\n\nUser: ${message}` }
                ]
            };
            break;
            
        case 'gemini':
            requestBody = {
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT}\n\nConversation context: ${JSON.stringify(conversation.slice(-5))}\n\nUser: ${message}`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7
                }
            };
            break;
    }

    const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`${provider} API error: ${response.status}`);
    }

    const data = await response.json();
    
    let aiResponse;
    
    switch (provider) {
        case 'openai':
            aiResponse = data.choices[0].message.content;
            break;
        case 'anthropic':
            aiResponse = data.content[0].text;
            break;
        case 'gemini':
            aiResponse = data.candidates[0].content.parts[0].text;
            break;
    }

    return aiResponse;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        provider: process.env.AI_PROVIDER || 'openai'
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🕯️  Lumière Candles Chatbot Server running on port ${PORT}`);
    console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
    console.log(`🌐 Access your website at: http://localhost:${PORT}`);
});

module.exports = app;

# Lumière Candles AI Chatbot

A sophisticated AI-powered customer service chatbot integrated into the Lumière Candles website. The chatbot provides intelligent responses about products, shipping, returns, and general customer inquiries.

## Features

### 🤖 AI Integration
- **Multi-Provider Support**: OpenAI GPT, Anthropic Claude, and Google Gemini
- **Intelligent Fallbacks**: Automatic provider switching if primary fails
- **Context Awareness**: Maintains conversation history for better responses
- **Fallback Responses**: Works without API keys using predefined responses

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Professional slide-in/out effects
- **Typing Indicators**: Shows when AI is processing
- **Quick Actions**: Pre-defined buttons for common questions
- **Notification System**: Subtle notifications for new messages

### 🔒 Security & Performance
- **Rate Limiting**: Prevents abuse with request limits
- **Input Validation**: Sanitizes and validates all inputs
- **CORS Protection**: Secure cross-origin request handling
- **Helmet Security**: Additional security headers
- **Error Handling**: Graceful error recovery

## Installation

### Prerequisites
- Node.js 16.0.0 or higher
- npm (comes with Node.js)

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Copy the example environment file
   copy .env.example .env
   
   # Edit .env with your API keys (optional)
   notepad .env
   ```

3. **Start the Server**
   ```bash
   # Option 1: Use the batch file (Windows)
   start-chatbot.bat
   
   # Option 2: Use npm
   npm start
   
   # Option 3: Development mode with auto-reload
   npm run dev
   ```

4. **Access Your Website**
   Open your browser and go to: `http://localhost:3000`

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Choose your AI provider
AI_PROVIDER=openai

# OpenAI (recommended)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Anthropic Claude (optional)
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Google Gemini (optional)
GEMINI_API_KEY=your-key-here

# Server settings
PORT=3000
```

### API Key Setup

#### OpenAI (Recommended)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `.env` file

#### Anthropic Claude (Alternative)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account
3. Generate an API key
4. Add it to your `.env` file

#### Google Gemini (Alternative)
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create an API key
3. Add it to your `.env` file

## Usage

### Basic Chatbot Functions

The chatbot appears as a floating button in the bottom-right corner of your website:

- **Click the chat icon** to open the chatbot
- **Type messages** in the input field
- **Use quick action buttons** for common questions
- **Click minimize** to hide but keep active
- **Click close** to fully close the chatbot

### Customization

#### Styling
Edit `css/styles.css` to customize the chatbot appearance:
- Colors match your brand (currently Lumière gold/brown theme)
- Animations and transitions
- Responsive breakpoints

#### Responses
Edit `js/chatbot.js` to modify fallback responses:
- Product information
- Pricing details
- Shipping policies
- Return policies

#### AI Behavior
Edit `server.js` to customize the AI system prompt:
- Brand personality
- Product knowledge
- Response style
- Conversation guidelines

## File Structure

```
├── index.html              # Main website (chatbot integrated)
├── css/
│   └── styles.css         # Chatbot styles (added to existing)
├── js/
│   └── chatbot.js         # Frontend chatbot logic
├── server.js              # Backend AI server
├── package.json           # Dependencies and scripts
├── .env.example           # Environment template
├── start-chatbot.bat      # Windows startup script
└── README-chatbot.md      # This documentation
```

## API Endpoints

### POST `/api/chat`
Send a message to the AI chatbot.

**Request:**
```json
{
  "message": "What are your best selling candles?",
  "conversation": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response:**
```json
{
  "response": "Our best-selling candles include..."
}
```

### GET `/api/health`
Check server status and configuration.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "provider": "openai"
}
```

## Troubleshooting

### Common Issues

**Chatbot not appearing:**
- Check that `js/chatbot.js` is loaded
- Verify no JavaScript errors in browser console
- Ensure CSS styles are applied

**AI responses not working:**
- Check your API keys in `.env` file
- Verify internet connection
- Check server logs for errors
- Fallback responses should still work

**Server won't start:**
- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check port 3000 is available

**Styling issues:**
- Clear browser cache
- Check CSS file is loading
- Verify no conflicting styles

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

### Getting Help

1. Check the browser console for JavaScript errors
2. Check the server logs for backend issues
3. Verify your `.env` configuration
4. Test with fallback responses (no API keys needed)

## Production Deployment

### Security Checklist
- [ ] Set strong API keys
- [ ] Configure rate limiting
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up monitoring

### Performance Tips
- Use a reverse proxy (nginx)
- Enable gzip compression
- Set up CDN for static assets
- Monitor API usage and costs
- Implement caching for common responses

## License

MIT License - See LICENSE file for details.

## Support

For technical support or customization requests, please contact the development team.

---

**Enjoy your new AI-powered customer service chatbot! 🕯️✨**

# Bamenda Livestock Shop

A comprehensive e-commerce platform for buying and selling livestock, poultry, and farming accessories in Bamenda, Cameroon.

## Features

### 🛒 E-commerce Features
- **Product Catalog**: Browse livestock, poultry, and farming accessories
- **Shopping Cart**: Add items, manage quantities, and checkout
- **WhatsApp Integration**: Direct order placement via WhatsApp
- **Search & Filter**: Find products by category or search terms
- **Responsive Design**: Mobile-friendly interface

### 👤 User Management
- **User Registration**: Sign up with phone verification
- **User Authentication**: Secure login system
- **SMS Verification**: Phone number verification for security
- **User Profiles**: Manage account information
- **Order History**: Track past orders

### 📱 SMS Verification System
- **Multiple SMS APIs**: Support for various free SMS services
- **Fallback System**: Console logging when SMS unavailable
- **Code Expiration**: Time-limited verification codes
- **Resend Functionality**: Request new codes if needed

## Setup Instructions

### 1. Basic Setup
1. Clone or download the project files
2. Open `index.html` in a web browser
3. The website will work immediately with simulated SMS verification

### 2. SMS Verification Setup (Optional)

#### Option A: TextLocal (Recommended - Free Tier)
1. Sign up at [TextLocal](https://www.textlocal.in/)
2. Get your API key from the dashboard
3. Edit `config.js`:
   ```javascript
   textlocal: {
       enabled: true,
       apiKey: 'YOUR_ACTUAL_API_KEY',
       sender: 'TXTLCL',
       url: 'https://api.textlocal.in/send/'
   }
   ```

#### Option B: Twilio (Free Trial)
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID, Auth Token, and phone number
3. Edit `config.js`:
   ```javascript
   twilio: {
       enabled: true,
       accountSid: 'YOUR_ACCOUNT_SID',
       authToken: 'YOUR_AUTH_TOKEN',
       fromNumber: 'YOUR_TWILIO_PHONE_NUMBER'
   }
   ```

#### Option C: Vonage (Free Trial)
1. Sign up at [Vonage](https://www.vonage.com/)
2. Get your API key, secret, and phone number
3. Edit `config.js`:
   ```javascript
   vonage: {
       enabled: true,
       apiKey: 'YOUR_API_KEY',
       apiSecret: 'YOUR_API_SECRET',
       fromNumber: 'YOUR_VONAGE_PHONE_NUMBER'
   }
   ```

#### Option D: Free SMS API
1. Sign up at [Free SMS API](https://www.freesmsapi.com/)
2. Get your API key
3. Edit `config.js`:
   ```javascript
   freesmsapi: {
       enabled: true,
       apiKey: 'YOUR_API_KEY',
       sender: 'BAMENDA'
   }
   ```

#### Option E: MSG91
1. Sign up at [MSG91](https://msg91.com/)
2. Get your API key
3. Edit `config.js`:
   ```javascript
   msg91: {
       enabled: true,
       apiKey: 'YOUR_API_KEY',
       sender: 'BAMENDA'
   }
   ```

### 3. WhatsApp Business API (Alternative to SMS)
1. Set up WhatsApp Business API
2. Get your Phone Number ID and Access Token
3. Edit `config.js`:
   ```javascript
   WHATSAPP_CONFIG: {
       enabled: true,
       phoneNumberId: 'YOUR_PHONE_NUMBER_ID',
       accessToken: 'YOUR_ACCESS_TOKEN'
   }
   ```

## File Structure

```
LF/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── config.js           # SMS API configuration
└── README.md           # This file
```

## Features in Detail

### Product Categories
- **Poultry**: Day-old chicks, broilers, layers
- **Livestock**: Pigs, goats, cattle
- **Accessories**: Feeders, drinkers, farming equipment

### User Authentication Flow
1. User clicks "Sign Up"
2. Fills registration form (name, phone, location, password)
3. System sends SMS verification code
4. User enters verification code
5. Account created and user logged in

### Shopping Cart System
1. Add products to cart
2. Manage quantities
3. View cart total
4. Proceed to checkout via WhatsApp
5. Order details sent to business WhatsApp

### SMS Verification Process
1. User submits phone number
2. System generates 6-digit code
3. Code sent via configured SMS API
4. If SMS fails, code shown in console (development)
5. User enters code to verify
6. Account activated upon successful verification

## Configuration Options

### SMS Service Priority
The system tries SMS services in this order:
1. TextLocal
2. Twilio
3. Vonage
4. Free SMS API
5. MSG91
6. Console fallback

### Customization
- **Business Information**: Update contact details in `index.html`
- **Products**: Modify product list in `script.js`
- **Styling**: Customize colors and layout in `styles.css`
- **SMS Message**: Edit message template in SMS functions

## Security Features

- **Password Validation**: Minimum 6 characters
- **Phone Verification**: SMS-based verification
- **Session Management**: Local storage for user sessions
- **Input Validation**: Form validation and sanitization

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Troubleshooting

### SMS Not Working
1. Check API credentials in `config.js`
2. Verify phone number format (+237XXXXXXXXX)
3. Check browser console for errors
4. Ensure SMS service is enabled in config

### User Registration Issues
1. Check browser console for JavaScript errors
2. Verify all form fields are filled
3. Ensure password meets requirements
4. Check verification code format

### Cart Issues
1. Clear browser cache
2. Check localStorage for corrupted data
3. Refresh page and try again

## Development Notes

### Local Development
- No server required - runs in browser
- Uses localStorage for data persistence
- SMS verification works in console for development

### Production Deployment
- Host on web server (Apache, Nginx, etc.)
- Configure SMS API credentials
- Test all features thoroughly
- Consider HTTPS for security

## Support

For technical support or questions:
- WhatsApp: +237 681837578
- Email: [Your Email]
- Website: [Your Website]

## License

This project is created for Bamenda Livestock Shop. All rights reserved.

---

**Note**: This is a frontend-only application. For production use, consider adding a backend server for enhanced security and data management. 
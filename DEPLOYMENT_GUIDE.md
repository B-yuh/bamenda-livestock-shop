# 🐄 Bamenda Livestock Shop - Deployment Guide

## 🎉 Your Webapp is Ready!

Congratulations! You now have a fully functional e-commerce webapp for livestock trading. Here's everything you need to know to deploy and use it.

## 🌐 **Current Status**
- ✅ **Frontend**: Running on http://localhost:8080
- ✅ **Backend**: Running on http://localhost:5000  
- ✅ **Database**: Ready for MongoDB connection
- ✅ **SMS Integration**: Multiple API support

## 🚀 **Quick Start**

### Option 1: Use the Startup Script
```bash
./start.sh
```

### Option 2: Manual Start
```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Start backend (Terminal 1)
cd backend && node index.js

# Start frontend (Terminal 2)
python3 -m http.server 8080
```

### Option 3: Using npm scripts
```bash
npm run dev
```

## 📋 **What's Included**

### 🎨 **Frontend Features**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Product Catalog**: Browse livestock, poultry, and accessories
- **Shopping Cart**: Add/remove items, manage quantities
- **User Authentication**: Sign up/sign in with SMS verification
- **WhatsApp Integration**: Direct ordering via WhatsApp
- **Search & Filter**: Find products by category
- **Ask a Vet**: Submit questions to veterinary experts

### 🔧 **Backend Features**
- **REST API**: Complete CRUD operations
- **User Management**: Registration, authentication
- **Product Management**: Add, edit, delete products
- **Order Management**: Track orders and sales
- **Database Integration**: MongoDB ready
- **CORS Enabled**: Frontend-backend communication

### 📱 **SMS Verification**
Multiple SMS service providers supported:
- TextLocal (Free tier available)
- Twilio (Free trial)
- Vonage (Free trial)
- Free SMS API
- MSG91

## 🛠 **Production Deployment**

### 📊 **Database Setup**

#### Option A: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `backend/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bamenda-livestock
```

#### Option B: Local MongoDB
```bash
# Install MongoDB
sudo apt update
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Use local connection in .env
MONGO_URI=mongodb://localhost:27017/bamenda-livestock
```

### 🌍 **Web Hosting**

#### Frontend Deployment
**Option 1: Netlify (Free)**
1. Create account at [Netlify](https://netlify.com)
2. Drag and drop these files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `config.js`
3. Update API URLs in `config.js`

**Option 2: GitHub Pages**
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Update API endpoints

**Option 3: Traditional Web Host**
- Upload files via FTP/cPanel
- Ensure PHP/static hosting is enabled

#### Backend Deployment
**Option 1: Heroku (Easy)**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create bamenda-livestock-api

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_connection_string

# Deploy
git subtree push --prefix backend heroku main
```

**Option 2: DigitalOcean/AWS/VPS**
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# Deploy backend
cd backend
npm install
pm2 start index.js --name "livestock-api"
pm2 startup
pm2 save
```

**Option 3: Vercel**
```bash
npm install -g vercel
cd backend
vercel
```

### 🔐 **Environment Configuration**

Update `backend/.env` for production:
```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/bamenda-livestock

# Server
PORT=5000
NODE_ENV=production

# JWT Secret
JWT_SECRET=your-super-secret-key-here

# SMS API Keys (choose one or more)
TEXTLOCAL_API_KEY=your_textlocal_key
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
VONAGE_API_KEY=your_vonage_key
VONAGE_SECRET=your_vonage_secret
```

## 📱 **SMS Setup Guide**

### TextLocal Setup (Recommended)
1. Sign up at [TextLocal](https://www.textlocal.in/)
2. Get API key from dashboard
3. Update `config.js`:
```javascript
textlocal: {
    enabled: true,
    apiKey: 'YOUR_API_KEY',
    sender: 'BAMENDA'
}
```

### Twilio Setup
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get Account SID, Auth Token, and phone number
3. Update `config.js` with credentials

## 🎨 **Customization**

### 🏪 **Business Information**
Update in `index.html`:
- Business name and contact details
- WhatsApp number (+237681837578)
- Location information
- Social media links

### 🛍 **Products**
Update in `script.js`:
```javascript
let products = [
    {
        id: 1,
        name: "Your Product",
        price: 5000,
        category: "poultry",
        description: "Product description",
        image: "fas fa-icon"
    }
    // Add more products
];
```

### 🎨 **Styling**
Customize in `styles.css`:
- Colors and branding
- Fonts and typography
- Layout and spacing
- Mobile responsiveness

## 📊 **Admin Features**

Access admin panel at `/backend/admin.html` for:
- User management
- Product management
- Order tracking
- Vet question responses

## 🔧 **API Endpoints**

### User Management
- `POST /api/signup` - User registration
- `POST /api/signin` - User login
- `GET /api/users` - Get all users

### Product Management
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/order` - Place order
- `GET /api/orders` - Get all orders

### Vet Questions
- `POST /api/ask-vet` - Submit question
- `GET /api/vet-questions` - Get all questions

## 🛡 **Security Considerations**

### For Production:
1. **Password Hashing**: Implement bcrypt for password security
2. **JWT Tokens**: Add token-based authentication
3. **Rate Limiting**: Prevent API abuse
4. **HTTPS**: Use SSL certificates
5. **Environment Variables**: Secure API keys
6. **Input Validation**: Sanitize user inputs

### Recommended Updates:
```javascript
// Add to backend/package.json
"bcryptjs": "^2.4.3",
"jsonwebtoken": "^9.0.0",
"express-rate-limit": "^6.0.0",
"helmet": "^6.0.0"
```

## 📈 **Performance Optimization**

### Frontend:
- Compress images
- Minify CSS/JS
- Enable caching
- Use CDN for assets

### Backend:
- Add database indexing
- Implement caching (Redis)
- Use compression middleware
- Monitor with APM tools

## 🐛 **Troubleshooting**

### Common Issues:

**Frontend not loading:**
```bash
# Check if server is running
curl http://localhost:8080
# Restart if needed
python3 -m http.server 8080
```

**Backend not responding:**
```bash
# Check backend status
curl http://localhost:5000
# Check logs
cd backend && node index.js
```

**Database connection issues:**
- Verify MongoDB connection string
- Check network connectivity
- Ensure IP whitelist in MongoDB Atlas

**SMS not working:**
- Check API credentials in `config.js`
- Verify phone number format
- Check console for error messages

## 📞 **Support**

For technical support:
- Check browser console for errors
- Review server logs
- Verify API credentials
- Test with different browsers

## 🎯 **Next Steps**

1. **Set up MongoDB database**
2. **Configure SMS API**
3. **Deploy to production hosting**
4. **Add custom domain**
5. **Set up analytics**
6. **Add payment integration**
7. **Implement push notifications**

## 📄 **License**

This webapp is created for Bamenda Livestock Shop. All rights reserved.

---

**🎉 Congratulations! Your webapp is ready for users. Visit http://localhost:8080 to see it in action!**
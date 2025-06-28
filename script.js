// Global variables
let cart = [];
let currentUser = null;
let products = [
    {
        id: 1,
        name: "Day-old Chicks",
        price: 500,
        category: "poultry",
        description: "Healthy day-old chicks, ready for rearing",
        image: "fas fa-kiwi-bird"
    },
    {
        id: 2,
        name: "Broilers (2kg)",
        price: 8000,
        category: "poultry",
        description: "Fresh broilers, perfect for meat production",
        image: "fas fa-drumstick-bite"
    },
    {
        id: 3,
        name: "Layers (1.5kg)",
        price: 6000,
        category: "poultry",
        description: "Productive layers for egg production",
        image: "fas fa-egg"
    },
    {
        id: 4,
        name: "Piglets",
        price: 25000,
        category: "livestock",
        description: "Healthy piglets for pig farming",
        image: "fas fa-piggy-bank"
    },
    {
        id: 5,
        name: "Goats",
        price: 35000,
        category: "livestock",
        description: "Quality goats for meat and milk",
        image: "fas fa-horse"
    },
    {
        id: 6,
        name: "Cattle",
        price: 150000,
        category: "livestock",
        description: "Strong cattle for farming and meat",
        image: "fas fa-cow"
    },
    {
        id: 7,
        name: "Feeders",
        price: 5000,
        category: "accessories",
        description: "Automatic feeders for poultry",
        image: "fas fa-utensils"
    },
    {
        id: 8,
        name: "Drinkers",
        price: 3000,
        category: "accessories",
        description: "Automatic drinkers for livestock",
        image: "fas fa-tint"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    checkUserSession();
    setupEventListeners();

    // Ask a Vet form handler
    const askVetForm = document.getElementById('askVetForm');
    if (askVetForm) {
        askVetForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('vetName').value.trim();
            const phone = document.getElementById('vetPhone').value.trim();
            const question = document.getElementById('vetQuestion').value.trim();
            if (!name || !phone || !question) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            // WhatsApp message
            const message = `*Ask a Vet Question*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Question:* ${question}`;
            const whatsappUrl = `https://wa.me/237681837578?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            showNotification('Your question has been sent to our vet via WhatsApp!', 'success');
            askVetForm.reset();
        });
    }
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterProducts(this.value);
        });
    }

    // Form submissions
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
    }

    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }

    // Close modals when clicking overlay
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeAllModals);
    }
}

// User Authentication Functions
function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

function updateUserInterface() {
    const userNotLoggedIn = document.getElementById('userNotLoggedIn');
    const userLoggedIn = document.getElementById('userLoggedIn');
    const userName = document.getElementById('userName');

    if (currentUser) {
        userNotLoggedIn.style.display = 'none';
        userLoggedIn.style.display = 'flex';
        if (userName) {
            userName.textContent = currentUser.name;
        }
    } else {
        userNotLoggedIn.style.display = 'flex';
        userLoggedIn.style.display = 'none';
    }
}

// Modal Functions
function openSignUpModal() {
    const modal = document.getElementById('signUpModal');
    const overlay = document.getElementById('modalOverlay');
    modal.classList.add('show');
    overlay.classList.add('show');
}

function closeSignUpModal() {
    const modal = document.getElementById('signUpModal');
    const overlay = document.getElementById('modalOverlay');
    modal.classList.remove('show');
    overlay.classList.remove('show');
    resetSignUpForm();
}

function openSignInModal() {
    const modal = document.getElementById('signInModal');
    const overlay = document.getElementById('modalOverlay');
    modal.classList.add('show');
    overlay.classList.add('show');
}

function closeSignInModal() {
    const modal = document.getElementById('signInModal');
    const overlay = document.getElementById('modalOverlay');
    modal.classList.remove('show');
    overlay.classList.remove('show');
    resetSignInForm();
}

function closeAllModals() {
    closeSignUpModal();
    closeSignInModal();
}

function switchToSignIn() {
    closeSignUpModal();
    openSignInModal();
}

function switchToSignUp() {
    closeSignInModal();
    openSignUpModal();
}

function resetSignUpForm() {
    const form = document.getElementById('signUpForm');
    if (form) {
        form.reset();
        const verificationGroup = document.getElementById('verificationGroup');
        if (verificationGroup) {
            verificationGroup.style.display = 'none';
        }
    }
}

function resetSignInForm() {
    const form = document.getElementById('signInForm');
    if (form) {
        form.reset();
    }
}

// SMS Verification Functions
async function sendVerificationCode(phoneNumber) {
    try {
        // Generate a 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000);
        
        // Store the verification code temporarily with expiration
        const expirationTime = Date.now() + (SMS_CONFIG.default.codeExpirationMinutes * 60 * 1000);
        sessionStorage.setItem('verificationCode', code.toString());
        sessionStorage.setItem('verificationPhone', phoneNumber);
        sessionStorage.setItem('verificationExpiration', expirationTime.toString());
        
        // Try to send SMS using configured services
        const smsSent = await sendSMSViaConfiguredServices(phoneNumber, code);
        
        if (smsSent) {
            showNotification('Verification code sent! Check your phone.', 'success');
        } else {
            // Fallback: Show code in console for development
            console.log(`Verification code for ${phoneNumber}: ${code}`);
            showNotification('SMS service unavailable. Check console for code.', 'warning');
        }
        
        return true;
    } catch (error) {
        console.error('Error sending verification code:', error);
        
        // Fallback: Generate and show code locally
        const code = Math.floor(100000 + Math.random() * 900000);
        const expirationTime = Date.now() + (SMS_CONFIG.default.codeExpirationMinutes * 60 * 1000);
        sessionStorage.setItem('verificationCode', code.toString());
        sessionStorage.setItem('verificationPhone', phoneNumber);
        sessionStorage.setItem('verificationExpiration', expirationTime.toString());
        
        console.log(`Verification code for ${phoneNumber}: ${code}`);
        showNotification('SMS service unavailable. Check console for code.', 'warning');
        
        return true;
    }
}

async function sendSMSViaConfiguredServices(phoneNumber, code) {
    // Try each configured SMS service in order
    const services = [
        { name: 'TextLocal', func: sendSMSViaTextLocal },
        { name: 'Twilio', func: sendSMSViaTwilio },
        { name: 'Vonage', func: sendSMSViaVonage },
        { name: 'Free SMS API', func: sendSMSViaFreeSMSAPI },
        { name: 'MSG91', func: sendSMSViaMSG91 }
    ];
    
    for (const service of services) {
        if (SMS_CONFIG[service.name.toLowerCase().replace(/\s+/g, '')]?.enabled) {
            try {
                const success = await service.func(phoneNumber, code);
                if (success) {
                    console.log(`SMS sent successfully via ${service.name}`);
                    return true;
                }
            } catch (error) {
                console.error(`${service.name} SMS error:`, error);
            }
        }
    }
    
    return false;
}

async function sendSMSViaTextLocal(phoneNumber, code) {
    if (!SMS_CONFIG.textlocal.enabled) return false;
    
    try {
        const message = `Your Bamenda Livestock Shop verification code is: ${code}. Valid for ${SMS_CONFIG.default.codeExpirationMinutes} minutes.`;
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        const params = new URLSearchParams({
            apikey: SMS_CONFIG.textlocal.apiKey,
            numbers: formattedPhone,
            message: message,
            sender: SMS_CONFIG.textlocal.sender
        });
        
        const response = await fetch(SMS_CONFIG.textlocal.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        const result = await response.json();
        return result.status === 'success';
        
    } catch (error) {
        console.error('TextLocal SMS error:', error);
        return false;
    }
}

async function sendSMSViaTwilio(phoneNumber, code) {
    if (!SMS_CONFIG.twilio.enabled) return false;
    
    try {
        const message = `Your Bamenda Livestock Shop verification code is: ${code}. Valid for ${SMS_CONFIG.default.codeExpirationMinutes} minutes.`;
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        const url = `${SMS_CONFIG.twilio.url}${SMS_CONFIG.twilio.accountSid}/Messages.json`;
        const params = new URLSearchParams({
            To: formattedPhone,
            From: SMS_CONFIG.twilio.fromNumber,
            Body: message
        });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(SMS_CONFIG.twilio.accountSid + ':' + SMS_CONFIG.twilio.authToken),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        const result = await response.json();
        return !!result.sid;
        
    } catch (error) {
        console.error('Twilio SMS error:', error);
        return false;
    }
}

async function sendSMSViaVonage(phoneNumber, code) {
    if (!SMS_CONFIG.vonage.enabled) return false;
    
    try {
        const message = `Your Bamenda Livestock Shop verification code is: ${code}. Valid for ${SMS_CONFIG.default.codeExpirationMinutes} minutes.`;
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        const params = new URLSearchParams({
            api_key: SMS_CONFIG.vonage.apiKey,
            api_secret: SMS_CONFIG.vonage.apiSecret,
            to: formattedPhone,
            from: SMS_CONFIG.vonage.fromNumber,
            text: message
        });
        
        const response = await fetch(SMS_CONFIG.vonage.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        const result = await response.json();
        return result.messages && result.messages[0].status === '0';
        
    } catch (error) {
        console.error('Vonage SMS error:', error);
        return false;
    }
}

async function sendSMSViaFreeSMSAPI(phoneNumber, code) {
    if (!SMS_CONFIG.freesmsapi.enabled) return false;
    
    try {
        const message = `Your Bamenda Livestock Shop verification code is: ${code}. Valid for ${SMS_CONFIG.default.codeExpirationMinutes} minutes.`;
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        const params = new URLSearchParams({
            apikey: SMS_CONFIG.freesmsapi.apiKey,
            numbers: formattedPhone,
            message: message,
            sender: SMS_CONFIG.freesmsapi.sender
        });
        
        const response = await fetch(SMS_CONFIG.freesmsapi.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        const result = await response.json();
        return result.status === 'success';
        
    } catch (error) {
        console.error('Free SMS API error:', error);
        return false;
    }
}

async function sendSMSViaMSG91(phoneNumber, code) {
    if (!SMS_CONFIG.msg91.enabled) return false;
    
    try {
        const message = `Your Bamenda Livestock Shop verification code is: ${code}. Valid for ${SMS_CONFIG.default.codeExpirationMinutes} minutes.`;
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        const params = new URLSearchParams({
            authkey: SMS_CONFIG.msg91.apiKey,
            mobiles: formattedPhone,
            message: message,
            sender: SMS_CONFIG.msg91.sender,
            route: '4'
        });
        
        const response = await fetch(SMS_CONFIG.msg91.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        const result = await response.json();
        return result.type === 'success';
        
    } catch (error) {
        console.error('MSG91 SMS error:', error);
        return false;
    }
}

function formatPhoneNumber(phoneNumber) {
    let formattedPhone = phoneNumber;
    
    // Remove any non-digit characters except +
    formattedPhone = formattedPhone.replace(/[^\d+]/g, '');
    
    // Format for Cameroon (+237)
    if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('237')) {
            formattedPhone = '+' + formattedPhone;
        } else if (formattedPhone.startsWith('0')) {
            formattedPhone = '+237' + formattedPhone.substring(1);
        } else {
            formattedPhone = '+237' + formattedPhone;
        }
    }
    
    return formattedPhone;
}

function verifyCode(inputCode) {
    const storedCode = sessionStorage.getItem('verificationCode');
    const storedPhone = sessionStorage.getItem('verificationPhone');
    const expirationTime = sessionStorage.getItem('verificationExpiration');
    
    // Check if code has expired
    if (expirationTime && Date.now() > parseInt(expirationTime)) {
        sessionStorage.removeItem('verificationCode');
        sessionStorage.removeItem('verificationPhone');
        sessionStorage.removeItem('verificationExpiration');
        return false;
    }
    
    if (inputCode === storedCode) {
        sessionStorage.removeItem('verificationCode');
        sessionStorage.removeItem('verificationPhone');
        sessionStorage.removeItem('verificationExpiration');
        return true;
    }
    return false;
}

async function resendCode() {
    const phoneInput = document.getElementById('signupPhone');
    if (phoneInput && phoneInput.value) {
        await sendVerificationCode(phoneInput.value);
    } else {
        showNotification('Please enter a phone number first.', 'error');
    }
}

// Form Handlers
async function handleSignUp(event) {
    event.preventDefault();
    
    // Get form values directly from input elements
    const name = document.getElementById('signupName').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const location = document.getElementById('signupLocation').value.trim();
    const password = document.getElementById('signupPassword').value;
    const verificationCode = document.getElementById('verificationCode').value.trim();
    
    // Validation
    if (!name || !phone || !location || !password) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    // Check if verification is required
    const verificationGroup = document.getElementById('verificationGroup');
    if (verificationGroup.style.display === 'none') {
        // First step: Send verification code
        const success = await sendVerificationCode(phone);
        if (success) {
            verificationGroup.style.display = 'flex';
            showNotification('Please enter the verification code sent to your phone.', 'info');
        }
        return;
    }
    
    // Second step: Verify code and complete registration
    if (!verificationCode) {
        showNotification('Please enter the verification code!', 'error');
        return;
    }
    
    if (!verifyCode(verificationCode)) {
        showNotification('Invalid verification code!', 'error');
        return;
    }
    
    // Create user account
    const user = {
        id: Date.now(),
        name: name,
        phone: phone,
        location: location,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    // Save user to localStorage (in production, this would go to a database)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log in the user
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    updateUserInterface();
    closeSignUpModal();
    showNotification('Account created successfully! Welcome to Bamenda Livestock Shop.', 'success');
}

function handleSignIn(event) {
    event.preventDefault();
    
    // Get form values directly from input elements
    const phone = document.getElementById('signinPhone').value.trim();
    const password = document.getElementById('signinPassword').value;
    
    // Validation
    if (!phone || !password) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === phone && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserInterface();
        closeSignInModal();
        showNotification('Welcome back, ' + user.name + '!', 'success');
    } else {
        showNotification('Invalid phone number or password!', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showNotification('Logged out successfully!', 'info');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function showUserProfile() {
    if (currentUser) {
        showNotification(`Profile: ${currentUser.name} - ${currentUser.phone}`, 'info');
    }
}

function showOrderHistory() {
    showNotification('Order history feature coming soon!', 'info');
}

function forgotPassword() {
    showNotification('Password reset feature coming soon!', 'info');
}

// Product Functions
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <i class="${product.image}"></i>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${product.price.toLocaleString()} FCFA</div>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i>
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

function filterProducts(searchTerm) {
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #666;">No products found.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function filterByCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #666;">No products in this category.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = '0 FCFA';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="${item.image}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} FCFA</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString() + ' FCFA';
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('show');
        updateCartDisplay();
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please sign in to place an order!', 'error');
        openSignInModal();
        return;
    }
    
    // Create order message for WhatsApp
    const orderItems = cart.map(item => 
        `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} FCFA`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const message = `*New Order from ${currentUser.name}*\n\n` +
                   `*Items:*\n${orderItems}\n\n` +
                   `*Total: ${total.toLocaleString()} FCFA*\n\n` +
                   `*Customer Details:*\n` +
                   `Name: ${currentUser.name}\n` +
                   `Phone: ${currentUser.phone}\n` +
                   `Location: ${currentUser.location}\n\n` +
                   `Please confirm this order.`;
    
    const whatsappUrl = `https://wa.me/237681837578?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after order
    cart = [];
    updateCartCount();
    updateCartDisplay();
    toggleCart();
    
    showNotification('Order sent to WhatsApp! We\'ll contact you soon.', 'success');
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#2e7d32';
        case 'error': return '#f44336';
        case 'warning': return '#ff9800';
        default: return '#2196f3';
    }
}

// Navigation Functions
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', setActiveNavLink);
});

// Close user dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
    }
}); 

// Product Listing Modal Functions
function openListProductModal() {
    const modal = document.getElementById('listProductModal');
    const overlay = document.getElementById('modalOverlay');
    modal.classList.add('show');
    overlay.classList.add('show');
}

function closeListProductModal() {
    const modal = document.getElementById('listProductModal');
    const overlay = document.getElementById('modalOverlay');
    modal.classList.remove('show');
    overlay.classList.remove('show');
    resetListProductForm();
}

function resetListProductForm() {
    const form = document.getElementById('listProductForm');
    if (form) {
        form.reset();
        hideImagePreview();
    }
}

// Image Upload Functions
function previewImage(input) {
    const file = input.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification('Image size must be less than 5MB', 'error');
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    const input = document.getElementById('listImage');
    const preview = document.getElementById('imagePreview');
    input.value = '';
    hideImagePreview();
}

function hideImagePreview() {
    const preview = document.getElementById('imagePreview');
    if (preview) {
        preview.style.display = 'none';
    }
}

// Drag and Drop functionality
function setupDragAndDrop() {
    const fileUploadContainer = document.querySelector('.file-upload-container');
    if (fileUploadContainer) {
        fileUploadContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        fileUploadContainer.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        fileUploadContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const input = document.getElementById('listImage');
                input.files = files;
                previewImage(input);
            }
        });
    }
}

// Enhanced Product Listing Form Submission
function setupProductListingForm() {
    const listProductForm = document.getElementById('listProductForm');
    if (listProductForm) {
        listProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!currentUser) {
                showNotification('Please sign in to list a product.', 'error');
                openSignInModal();
                return;
            }
            
            const formData = new FormData(this);
            const imageFile = document.getElementById('listImage').files[0];
            
            // Create product data
            const productData = {
                name: formData.get('name'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                location: formData.get('location'),
                description: formData.get('description'),
                seller: currentUser._id || currentUser.id
            };
            
            // Handle image upload
            if (imageFile) {
                try {
                    // Convert image to base64 for now (in production, you'd upload to a server)
                    const base64Image = await convertImageToBase64(imageFile);
                    productData.image = base64Image;
                } catch (error) {
                    showNotification('Error processing image. Please try again.', 'error');
                    return;
                }
            }
            
            try {
                const response = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });
                
                if (response.ok) {
                    showNotification('Product listed successfully!', 'success');
                    closeListProductModal();
                    // Refresh products if connected to backend
                    if (typeof loadProductsFromBackend === 'function') {
                        loadProductsFromBackend();
                    }
                } else {
                    const errorData = await response.json();
                    showNotification(errorData.message || 'Failed to list product.', 'error');
                }
            } catch (error) {
                showNotification('Network error. Please try again.', 'error');
            }
        });
    }
}

// Convert image to base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Initialize product listing functionality
document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
    setupProductListingForm();
});
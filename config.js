// SMS API Configuration
// This file contains configuration for various SMS services
// Replace the placeholder values with your actual API credentials

const SMS_CONFIG = {
    // TextLocal API (Free tier available)
    // Sign up at https://www.textlocal.in/ for free credits
    textlocal: {
        enabled: false, // Set to true to enable
        apiKey: 'YOUR_TEXTLOCAL_API_KEY', // Replace with your actual API key
        sender: 'BALISH',
        url: 'https://api.textlocal.in/send/'
    },
    
    // Twilio API (Free trial available)
    // Sign up at https://www.twilio.com/ for free credits
    twilio: {
        enabled: false, // Set to true to enable
        accountSid: 'YOUR_TWILIO_ACCOUNT_SID', // Replace with your actual Account SID
        authToken: 'YOUR_TWILIO_AUTH_TOKEN', // Replace with your actual Auth Token
        fromNumber: 'YOUR_TWILIO_PHONE_NUMBER', // Replace with your actual Twilio phone number
        url: 'https://api.twilio.com/2010-04-01/Accounts/'
    },
    
    // Vonage API (Free trial available)
    // Sign up at https://www.vonage.com/ for free credits
    vonage: {
        enabled: false, // Set to true to enable
        apiKey: 'YOUR_VONAGE_API_KEY',
        apiSecret: 'YOUR_VONAGE_API_SECRET',
        fromNumber: 'YOUR_VONAGE_PHONE_NUMBER',
        url: 'https://rest.nexmo.com/sms/json'
    },
    
    // Free SMS API (Free tier available)
    // Sign up at https://www.freesmsapi.com/ for free credits
    freesmsapi: {
        enabled: false, // Set to true to enable
        apiKey: 'YOUR_FREESMSAPI_KEY',
        sender: 'BAMENDA',
        url: 'https://www.freesmsapi.com/api/send'
    },
    
    // MSG91 API (Free tier available)
    // Sign up at https://msg91.com/ for free credits
    msg91: {
        enabled: false, // Set to true to enable
        apiKey: 'YOUR_MSG91_API_KEY',
        sender: 'BAMENDA',
        url: 'https://api.msg91.com/api/v5/flow/'
    },
    
    // Default settings
    default: {
        // Fallback to console logging if no SMS service is configured
        fallbackToConsole: true,
        // Code expiration time in minutes
        codeExpirationMinutes: 10,
        // Maximum attempts for verification
        maxAttempts: 3
    }
};

// WhatsApp Business API Configuration (Alternative to SMS)
const WHATSAPP_CONFIG = {
    enabled: false, // Set to true to enable
    phoneNumberId: 'YOUR_WHATSAPP_PHONE_NUMBER_ID',
    accessToken: 'YOUR_WHATSAPP_ACCESS_TOKEN',
    url: 'https://graph.facebook.com/v17.0/'
};

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SMS_CONFIG, WHATSAPP_CONFIG };
} 
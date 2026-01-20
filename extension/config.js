// Configuration for PhishGuard Extension
// This file manages API URLs for different environments

const CONFIG = {
  // Development environment (default)
  development: {
    API_URL: 'http://localhost:3000/api/phishing/analyze'
  },
  
  // Production environment
  // Update this URL to match your production deployment
  production: {
    API_URL: 'https://phishguard-project.vercel.app/api/phishing/analyze'
  }
};

// Determine current environment
// This value is automatically set during the build process
// - 'development' for local testing (default)
// - 'production' for production deployment
const CURRENT_ENV = 'development';

// Export the configuration for current environment
const ACTIVE_CONFIG = CONFIG[CURRENT_ENV];

// Make config globally available
if (typeof window !== 'undefined') {
  window.PHISHGUARD_CONFIG = ACTIVE_CONFIG;
}

// For use in service workers (background.js)
if (typeof self !== 'undefined') {
  self.PHISHGUARD_CONFIG = ACTIVE_CONFIG;
}

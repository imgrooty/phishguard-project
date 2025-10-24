// Configuration constants and environment variables
export const config = {
  // API URLs
  PHISHING_API_URL: process.env.PHISHING_API_URL || "http://127.0.0.1:8000/predict",
  VIRUSTOTAL_API_URL: "https://www.virustotal.com/api/v3",
  GOOGLE_SAFE_BROWSING_API_URL: "https://safebrowsing.googleapis.com/v4/threatMatches:find",
  
  // API Keys
  PHISHING_API_KEY: process.env.PHISHING_API_KEY || "",
  VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY || "",
  GOOGLE_SAFE_BROWSING_API_KEY: process.env.GOOGLE_SAFE_BROWSING_API_KEY || "",
  
  // OAuth
  GOOGLE_ID: process.env.GOOGLE_ID || "",
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || "",
  AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID || "",
  AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET || "",
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/phishguard",
  
  // NextAuth
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  
  // Performance settings
  EMAIL_BATCH_SIZE: 3,
  REQUEST_TIMEOUT: 15000,
  TOKEN_REFRESH_TIMEOUT: 10000,
  
  // Phishing detection thresholds
  PHISHING_THRESHOLD: 0.6,
  HIGH_CONFIDENCE_THRESHOLD: 0.9,
  VIRUSTOTAL_MALICIOUS_THRESHOLD: 1
};

// Validate required environment variables
export function validateConfig() {
  const required = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'GOOGLE_ID',
    'GOOGLE_SECRET',
    'AZURE_AD_CLIENT_ID',
    'AZURE_AD_CLIENT_SECRET'
  ];
  
  const optional = [
    'GOOGLE_SAFE_BROWSING_API_KEY',
    'VIRUSTOTAL_API_KEY',
    'PHISHING_API_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
  }
  
  // Log optional API availability
  const availableAPIs = optional.filter(key => process.env[key]);
  if (availableAPIs.length > 0) {
    console.log(`✅ Available APIs: ${availableAPIs.join(', ')}`);
  }
  
  return missing.length === 0;
}

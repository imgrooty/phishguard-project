import '@testing-library/jest-dom'

// Mock environment variables for testing
process.env.MONGODB_URI = 'mongodb://localhost:27017/phishguard-test'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.GOOGLE_ID = 'test-google-id'
process.env.GOOGLE_SECRET = 'test-google-secret'
process.env.AZURE_AD_CLIENT_ID = 'test-azure-id'
process.env.AZURE_AD_CLIENT_SECRET = 'test-azure-secret'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.PHISHING_API_URL = 'http://localhost:8000/predict'
process.env.PHISHING_API_KEY = 'test-api-key'
process.env.VIRUSTOTAL_API_KEY = 'test-virustotal-key'
process.env.GOOGLE_SAFE_BROWSING_API_KEY = 'test-safe-browsing-key'
process.env.HF_API_TOKEN = 'hf_test_token'

// Mock fetch globally
global.fetch = jest.fn()

// Mock next-auth
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

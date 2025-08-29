export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://phishguard-api.onrender.com'
  : 'http://localhost:8000';

export const config = {
  apiUrl: API_BASE_URL,
} as const;
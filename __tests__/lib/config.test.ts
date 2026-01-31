/**
 * @jest-environment node
 */

import { config, validateConfig } from '@/lib/config';

describe('Configuration', () => {
  describe('config object', () => {
    it('should have all required API URLs defined', () => {
      expect(config.PHISHING_API_URL).toBeDefined();
      expect(config.VIRUSTOTAL_API_URL).toBe('https://www.virustotal.com/api/v3');
      expect(config.GOOGLE_SAFE_BROWSING_API_URL).toBe('https://safebrowsing.googleapis.com/v4/threatMatches:find');
    });

    it('should have OAuth credentials configured', () => {
      expect(config.GOOGLE_ID).toBeDefined();
      expect(config.GOOGLE_SECRET).toBeDefined();
      expect(config.AZURE_AD_CLIENT_ID).toBeDefined();
      expect(config.AZURE_AD_CLIENT_SECRET).toBeDefined();
    });

    it('should have database URI configured', () => {
      expect(config.MONGODB_URI).toBeDefined();
      expect(config.MONGODB_URI).toContain('mongodb://');
    });

    it('should have NextAuth configuration', () => {
      expect(config.NEXTAUTH_URL).toBeDefined();
      expect(config.NEXTAUTH_SECRET).toBeDefined();
    });

    it('should have performance settings', () => {
      expect(config.EMAIL_BATCH_SIZE).toBe(3);
      expect(config.REQUEST_TIMEOUT).toBe(8000);
      expect(config.ML_TIMEOUT).toBe(5000);
      expect(config.TOKEN_REFRESH_TIMEOUT).toBe(10000);
    });

    it('should have phishing detection thresholds', () => {
      expect(config.PHISHING_THRESHOLD).toBe(0.6);
      expect(config.HIGH_CONFIDENCE_THRESHOLD).toBe(0.9);
      expect(config.VIRUSTOTAL_MALICIOUS_THRESHOLD).toBe(1);
    });

    it('should have API keys configured', () => {
      expect(config.PHISHING_API_KEY).toBeDefined();
      expect(config.HF_API_TOKEN).toBeDefined();
      expect(config.VIRUSTOTAL_API_KEY).toBeDefined();
      expect(config.GOOGLE_SAFE_BROWSING_API_KEY).toBeDefined();
    });
  });

  describe('validateConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset environment before each test
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should return true when all required variables are present', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.GOOGLE_ID = 'test-google-id';
      process.env.GOOGLE_SECRET = 'test-google-secret';
      process.env.AZURE_AD_CLIENT_ID = 'test-azure-id';
      process.env.AZURE_AD_CLIENT_SECRET = 'test-azure-secret';

      const result = validateConfig();
      expect(result).toBe(true);
    });

    it('should return false when required variables are missing', () => {
      // Clear required environment variables
      delete process.env.MONGODB_URI;
      delete process.env.NEXTAUTH_SECRET;

      const result = validateConfig();
      expect(result).toBe(false);
    });

    it('should log warning for missing variables', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      delete process.env.MONGODB_URI;
      validateConfig();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing environment variables')
      );

      consoleSpy.mockRestore();
    });
  });
});

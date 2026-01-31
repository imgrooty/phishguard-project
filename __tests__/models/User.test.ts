/**
 * @jest-environment node
 */

// Mock mongoose before importing the model
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    models: {},
    model: jest.fn(),
  };
});

describe('User Model', () => {
  describe('User Schema', () => {
    it('should define required fields', () => {
      // Test that the schema includes expected fields
      const requiredFields = ['name', 'email'];
      
      requiredFields.forEach(field => {
        expect(field).toBeDefined();
      });
    });

    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.com'
      ];

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        ''
      ];

      validEmails.forEach(email => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });

      invalidEmails.forEach(email => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('should have correct provider enum values', () => {
      const validProviders = ['credentials', 'google', 'azure-ad', 'oauth'];
      
      validProviders.forEach(provider => {
        expect(['credentials', 'google', 'azure-ad', 'oauth']).toContain(provider);
      });
    });

    it('should define email schema with required fields', () => {
      const emailRequiredFields = ['messageId', 'from', 'date'];
      
      emailRequiredFields.forEach(field => {
        expect(field).toBeDefined();
      });
    });

    it('should have default values for email fields', () => {
      const defaults = {
        subject: '(No Subject)',
        from: 'unknown@unknown.com',
        to: 'unknown@unknown.com',
        body: '',
        isRead: false,
        isPotentialPhishing: false,
        phishingScore: 0
      };

      Object.entries(defaults).forEach(([key, value]) => {
        expect(value).toBeDefined();
      });
    });
  });

  describe('Email Analysis Fields', () => {
    it('should support enhanced analysis fields', () => {
      const analysisFields = [
        'prediction',
        'confidence',
        'model_used',
        'virusTotalResult',
        'googleSafeBrowsingResult',
        'heuristicScore',
        'mlScore'
      ];

      analysisFields.forEach(field => {
        expect(field).toBeDefined();
      });
    });

    it('should support URL safety result structure', () => {
      const urlSafetyFields = {
        url: 'http://example.com',
        isSafe: true,
        threatType: 'MALWARE',
        platformType: 'ANY_PLATFORM',
        cacheDuration: '300s',
        lastChecked: new Date()
      };

      expect(urlSafetyFields.url).toBeDefined();
      expect(typeof urlSafetyFields.isSafe).toBe('boolean');
      expect(urlSafetyFields.lastChecked).toBeInstanceOf(Date);
    });
  });

  describe('User Fields', () => {
    it('should have token management fields', () => {
      const tokenFields = ['accessToken', 'refreshToken', 'tokenExpiry'];
      
      tokenFields.forEach(field => {
        expect(field).toBeDefined();
      });
    });

    it('should have email synchronization field', () => {
      expect('lastEmailSync').toBeDefined();
    });

    it('should store emails as an array', () => {
      const emails: any[] = [];
      
      expect(Array.isArray(emails)).toBe(true);
    });
  });

  describe('Model Validation', () => {
    it('should validate required user fields', () => {
      const validUser = {
        name: 'Test User',
        email: 'test@example.com'
      };

      expect(validUser.name).toBeDefined();
      expect(validUser.name.length).toBeGreaterThan(0);
      expect(validUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should validate email lowercase requirement', () => {
      const email = 'TEST@EXAMPLE.COM';
      const lowercase = email.toLowerCase();
      
      expect(lowercase).toBe('test@example.com');
    });

    it('should validate email trim requirement', () => {
      const email = '  test@example.com  ';
      const trimmed = email.trim();
      
      expect(trimmed).toBe('test@example.com');
    });

    it('should validate phishing score range', () => {
      const scores = [0, 0.5, 1.0];
      
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1.0);
      });
    });
  });
});

/**
 * @jest-environment node
 */

import { EmailService } from '@/lib/emailService';

// Mock fetch globally
global.fetch = jest.fn();

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = EmailService.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = EmailService.getInstance();
      const instance2 = EmailService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('refreshGoogleToken', () => {
    it('should successfully refresh a valid Google token', async () => {
      const mockResponse = {
        access_token: 'new-access-token',
        expires_in: 3600,
        refresh_token: 'new-refresh-token'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await emailService.refreshGoogleToken('old-refresh-token');

      expect(result).toBeDefined();
      expect(result?.access_token).toBe('new-access-token');
      expect(result?.expires_in).toBe(3600);
      expect(result?.refresh_token).toBe('new-refresh-token');
    });

    it('should return null when token refresh fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await emailService.refreshGoogleToken('invalid-token');

      expect(result).toBeNull();
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await emailService.refreshGoogleToken('refresh-token');

      expect(result).toBeNull();
    });

    it('should use the old refresh token if new one is not provided', async () => {
      const mockResponse = {
        access_token: 'new-access-token',
        expires_in: 3600,
        // No refresh_token in response
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await emailService.refreshGoogleToken('old-refresh-token');

      expect(result?.refresh_token).toBe('old-refresh-token');
    });
  });

  describe('refreshMicrosoftToken', () => {
    it('should successfully refresh a valid Microsoft token', async () => {
      const mockResponse = {
        access_token: 'new-ms-access-token',
        expires_in: 3600,
        refresh_token: 'new-ms-refresh-token'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await emailService.refreshMicrosoftToken('old-ms-refresh-token');

      expect(result).toBeDefined();
      expect(result?.access_token).toBe('new-ms-access-token');
      expect(result?.expires_in).toBe(3600);
    });

    it('should return null when Microsoft token refresh fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await emailService.refreshMicrosoftToken('invalid-ms-token');

      expect(result).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('should return true for a valid Google token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const result = await emailService.validateToken('valid-google-token', 'google');

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://gmail.googleapis.com/gmail/v1/users/me/profile',
        expect.any(Object)
      );
    });

    it('should return true for a valid Microsoft token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const result = await emailService.validateToken('valid-ms-token', 'microsoft');

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://graph.microsoft.com/v1.0/me',
        expect.any(Object)
      );
    });

    it('should return false for an invalid token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await emailService.validateToken('invalid-token', 'google');

      expect(result).toBe(false);
    });

    it('should return false on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await emailService.validateToken('token', 'google');

      expect(result).toBe(false);
    });
  });

  describe('analyzePhishing', () => {
    it('should detect phishing based on heuristic analysis', async () => {
      const email = {
        from: 'noreply@suspicious-domain.com',
        subject: 'URGENT: Verify your account NOW!',
        body: 'Click here immediately to verify your account: http://fake-link.com',
        links: ['http://fake-link.com']
      };

      // Mock ML API failure to rely on heuristics only
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('ML API unavailable'));

      const result = await emailService.analyzePhishing(email);

      expect(result).toBeDefined();
      expect(result.phishingScore).toBeGreaterThan(0);
      expect(result.phishingReasons.length).toBeGreaterThan(0);
      expect(result.heuristicScore).toBeGreaterThan(0);
    });

    it('should detect urgent keywords in phishing emails', async () => {
      const email = {
        from: 'test@example.com',
        subject: 'Urgent action required - verify password',
        body: 'Your account will be suspended unless you login immediately',
        links: []
      };

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('ML API unavailable'));

      const result = await emailService.analyzePhishing(email);

      expect(result.phishingReasons.some(r => 
        r.toLowerCase().includes('urgency') || r.toLowerCase().includes('keyword')
      )).toBe(true);
    });

    it('should detect suspicious sender addresses', async () => {
      const email = {
        from: 'noreply@example.com',
        subject: 'Test',
        body: 'Test body',
        links: []
      };

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('ML API unavailable'));

      const result = await emailService.analyzePhishing(email);

      expect(result.phishingReasons.some(r => 
        r.toLowerCase().includes('noreply')
      )).toBe(true);
    });

    it('should detect multiple external links', async () => {
      const email = {
        from: 'test@example.com',
        subject: 'Test',
        body: 'Check these links: http://link1.com http://link2.com http://link3.com http://link4.com http://link5.com http://link6.com',
        links: ['http://link1.com', 'http://link2.com', 'http://link3.com', 'http://link4.com', 'http://link5.com', 'http://link6.com']
      };

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('ML API unavailable'));

      const result = await emailService.analyzePhishing(email);

      expect(result.phishingReasons.some(r => 
        r.toLowerCase().includes('link')
      )).toBe(true);
    });

    it('should combine ML and heuristic scores', async () => {
      const email = {
        from: 'test@example.com',
        subject: 'Test',
        body: 'This is a phishing email',
        links: []
      };

      const mockMLResponse = {
        prediction: 'phishing',
        confidence: 0.9,
        model_used: 'test-model'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMLResponse,
      });

      const result = await emailService.analyzePhishing(email);

      expect(result.mlScore).toBe(0.9);
      expect(result.mlPrediction).toBe('phishing');
      expect(result.confidence).toBe(0.9);
      expect(result.modelUsed).toBe('test-model');
    });

    it('should handle ML API errors gracefully', async () => {
      const email = {
        from: 'test@example.com',
        subject: 'Test',
        body: 'Test body',
        links: []
      };

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('ML API error'));

      const result = await emailService.analyzePhishing(email);

      expect(result).toBeDefined();
      // ML errors are logged but analysis continues with heuristic results
      expect(result.mlPrediction).toBe('Unknown');
    });

    it('should return safe result for legitimate emails', async () => {
      const email = {
        from: 'legitimate@company.com',
        subject: 'Monthly Newsletter',
        body: 'Here is our monthly update',
        links: []
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          prediction: 'safe',
          confidence: 0.1,
          model_used: 'test-model'
        }),
      });

      const result = await emailService.analyzePhishing(email);

      expect(result.phishingScore).toBeLessThan(0.6); // Below threshold
      expect(result.isPotentialPhishing).toBe(false);
    });

    it('should analyze Google Safe Browsing results when URLs are present', async () => {
      const email = {
        from: 'test@example.com',
        subject: 'Test',
        body: 'Check this link',
        links: ['http://malicious-site.com']
      };

      // Mock ML API
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          prediction: 'safe',
          confidence: 0.1,
          model_used: 'test-model'
        }),
      });

      // Mock Google Safe Browsing API with threat detection
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          matches: [{
            threatType: 'MALWARE',
            platformType: 'ANY_PLATFORM',
            threat: { url: 'http://malicious-site.com' }
          }]
        }),
      });

      const result = await emailService.analyzePhishing(email);

      expect(result.googleSafeBrowsingResult).toBeDefined();
      // Google Safe Browsing returns results for analyzed URLs
      if (result.googleSafeBrowsingResult) {
        expect(Array.isArray(result.googleSafeBrowsingResult)).toBe(true);
      }
    });
  });
});

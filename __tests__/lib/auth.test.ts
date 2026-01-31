/**
 * @jest-environment node
 */

import { signToken, verifyToken, unauthorizedResponse } from '@/lib/auth';

describe('Auth Utilities', () => {
  describe('signToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { userId: 'test-user-123' };
      const token = signToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include userId in the token payload', () => {
      const payload = { userId: 'test-user-456' };
      const token = signToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe('test-user-456');
    });

    it('should create different tokens for different user IDs', () => {
      const token1 = signToken({ userId: 'user-1' });
      const token2 = signToken({ userId: 'user-2' });
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { userId: 'verify-test-user' };
      const token = signToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe('verify-test-user');
    });

    it('should return null for an invalid token', () => {
      const invalidToken = 'invalid.token.string';
      const decoded = verifyToken(invalidToken);
      
      expect(decoded).toBeNull();
    });

    it('should return null for a malformed token', () => {
      const malformedToken = 'not-a-jwt-token';
      const decoded = verifyToken(malformedToken);
      
      expect(decoded).toBeNull();
    });

    it('should return null for an empty token', () => {
      const decoded = verifyToken('');
      
      expect(decoded).toBeNull();
    });
  });

  describe('unauthorizedResponse', () => {
    it('should return a 401 response', () => {
      const response = unauthorizedResponse();
      
      expect(response.status).toBe(401);
    });

    it('should include an error message in the response body', async () => {
      const response = unauthorizedResponse();
      const body = await response.json();
      
      expect(body).toHaveProperty('error');
      expect(body.error).toBe('Unauthorized');
    });
  });
});

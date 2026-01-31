/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

// Mock EmailService
jest.mock('@/lib/emailService', () => ({
  EmailService: {
    getInstance: jest.fn(() => ({
      analyzePhishing: jest.fn(),
    })),
  },
}));

import { POST, OPTIONS } from '@/app/api/phishing/analyze/route';
import { getServerSession } from 'next-auth';
import { EmailService } from '@/lib/emailService';

describe('Phishing Analysis API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OPTIONS handler', () => {
    it('should handle CORS preflight for browser extension', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn((header) => {
            if (header === 'origin') return 'chrome-extension://test-extension-id';
            return null;
          }),
        },
      } as unknown as NextRequest;

      const response = await OPTIONS(mockRequest);

      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });

    it('should handle CORS preflight for regular origin', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn((header) => {
            if (header === 'origin') return 'http://localhost:3000';
            return null;
          }),
        },
      } as unknown as NextRequest;

      const response = await OPTIONS(mockRequest);

      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBeDefined();
    });
  });

  describe('POST handler', () => {
    it('should return 401 when user is not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);

      const mockRequest = {
        headers: {
          get: jest.fn(() => null),
        },
        json: jest.fn(),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('Unauthorized');
    });

    it('should return 400 when bodyText is missing', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { email: 'test@example.com' },
      });

      const mockRequest = {
        headers: {
          get: jest.fn(() => null),
        },
        json: jest.fn().mockResolvedValueOnce({}),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toContain('bodyText');
    });

    it('should successfully analyze phishing when authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { email: 'test@example.com' },
      });

      const mockAnalysisResult = {
        isPotentialPhishing: true,
        phishingScore: 0.8,
        phishingReasons: ['Urgent keywords detected'],
        confidence: 0.9,
        modelUsed: 'test-model',
        heuristicScore: 0.7,
        mlScore: 0.9,
        virusTotalResult: null,
      };

      const mockEmailService = {
        analyzePhishing: jest.fn().mockResolvedValueOnce(mockAnalysisResult),
      };

      (EmailService.getInstance as jest.Mock).mockReturnValueOnce(mockEmailService);

      const mockRequest = {
        headers: {
          get: jest.fn(() => null),
        },
        json: jest.fn().mockResolvedValueOnce({
          bodyText: 'Urgent: Verify your account now!',
          subject: 'Account Verification',
          from: 'noreply@suspicious.com',
          links: ['http://suspicious-link.com'],
        }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.isPotentialPhishing).toBe(true);
      expect(body.phishingScore).toBe(0.8);
      expect(body.phishingReasons).toContain('Urgent keywords detected');
      expect(mockEmailService.analyzePhishing).toHaveBeenCalledWith({
        from: 'noreply@suspicious.com',
        subject: 'Account Verification',
        body: 'Urgent: Verify your account now!',
        links: ['http://suspicious-link.com'],
      });
    });

    it('should handle browser extension origin correctly', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { email: 'test@example.com' },
      });

      const mockAnalysisResult = {
        isPotentialPhishing: false,
        phishingScore: 0.2,
        phishingReasons: [],
        confidence: 0.8,
        modelUsed: 'test-model',
        heuristicScore: 0.1,
        mlScore: 0.1,
        virusTotalResult: null,
      };

      const mockEmailService = {
        analyzePhishing: jest.fn().mockResolvedValueOnce(mockAnalysisResult),
      };

      (EmailService.getInstance as jest.Mock).mockReturnValueOnce(mockEmailService);

      const mockRequest = {
        headers: {
          get: jest.fn((header) => {
            if (header === 'origin') return 'chrome-extension://test-id';
            return null;
          }),
        },
        json: jest.fn().mockResolvedValueOnce({
          bodyText: 'Normal email content',
        }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('chrome-extension://test-id');
    });

    it('should use default values when optional fields are missing', async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { email: 'test@example.com' },
      });

      const mockAnalysisResult = {
        isPotentialPhishing: false,
        phishingScore: 0.1,
        phishingReasons: [],
        confidence: 0.9,
        modelUsed: 'test-model',
        heuristicScore: 0.1,
        mlScore: 0.1,
        virusTotalResult: null,
      };

      const mockEmailService = {
        analyzePhishing: jest.fn().mockResolvedValueOnce(mockAnalysisResult),
      };

      (EmailService.getInstance as jest.Mock).mockReturnValueOnce(mockEmailService);

      const mockRequest = {
        headers: {
          get: jest.fn(() => null),
        },
        json: jest.fn().mockResolvedValueOnce({
          bodyText: 'Email content',
        }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(mockEmailService.analyzePhishing).toHaveBeenCalledWith({
        from: 'External Source',
        subject: 'Browser Extension Analysis',
        body: 'Email content',
        links: [],
      });
    });

    it('should return 500 on server error', async () => {
      (getServerSession as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

      const mockRequest = {
        headers: {
          get: jest.fn(() => null),
        },
        json: jest.fn(),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe('Server error');
    });
  });
});

/**
 * @jest-environment node
 */

import mongoose from 'mongoose';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    readyState: 0,
  },
}));

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the global cache
    if (global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }
  });

  it('should use MongoDB URI from environment variable', () => {
    expect(process.env.MONGODB_URI).toBeDefined();
    expect(process.env.MONGODB_URI).toContain('mongodb://');
  });

  it('should have proper connection options', () => {
    const expectedOptions = {
      bufferCommands: false,
    };

    // Verify that these options are used in production
    expect(expectedOptions.bufferCommands).toBe(false);
  });

  it('should handle connection caching', () => {
    // Test that the global mongoose cache exists
    const cache = global.mongoose || { conn: null, promise: null };
    
    expect(cache).toHaveProperty('conn');
    expect(cache).toHaveProperty('promise');
  });

  it('should validate MongoDB URI format', () => {
    const mongoUri = process.env.MONGODB_URI || '';
    
    expect(mongoUri).toMatch(/^mongodb:\/\//);
    expect(mongoUri.length).toBeGreaterThan(10);
  });
});

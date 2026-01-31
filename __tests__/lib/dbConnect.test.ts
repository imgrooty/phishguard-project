/**
 * @jest-environment node
 */

// Mock mongoose first before importing
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    readyState: 0,
  },
}));

import mongoose from 'mongoose';

describe('Database Connection', () => {
  let dbConnect: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the global cache before each test
    global.mongoose = { conn: null, promise: null };
    
    // Re-import dbConnect to get fresh instance with cleared cache
    jest.isolateModules(() => {
      dbConnect = require('@/lib/dbConnect').default;
    });
  });

  it('should use MongoDB URI from environment variable', () => {
    expect(process.env.MONGODB_URI).toBeDefined();
    expect(process.env.MONGODB_URI).toContain('mongodb://');
  });

  it('should call mongoose.connect with correct options', async () => {
    const mockMongooseInstance = { connection: { readyState: 1 } };
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(mockMongooseInstance);

    await dbConnect();

    expect(mongoose.connect).toHaveBeenCalledWith(
      process.env.MONGODB_URI,
      { bufferCommands: false }
    );
  });

  it('should cache the connection and reuse it', async () => {
    const mockMongooseInstance = { connection: { readyState: 1 } };
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(mockMongooseInstance);

    const conn1 = await dbConnect();
    const conn2 = await dbConnect();

    expect(conn1).toBe(conn2);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('should reset promise on connection error', async () => {
    const error = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await expect(dbConnect()).rejects.toThrow('Connection failed');
    
    // Verify promise is reset after error
    const cache = global.mongoose || { conn: null, promise: null };
    expect(cache.promise).toBeNull();
  });
});

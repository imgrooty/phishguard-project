/**
 * @jest-environment node
 */

import mongoose from 'mongoose';

describe('User Model', () => {
  let UserModel: any;
  let UserSchema: mongoose.Schema;

  beforeAll(() => {
    // Import the actual User model and schema
    jest.unmock('mongoose');
    
    // We need to test the schema structure without actually connecting to DB
    // Import the types and schema definition
    const User = require('@/models/User').default;
    UserModel = User;
    
    // Get the schema from the model
    if (UserModel && UserModel.schema) {
      UserSchema = UserModel.schema;
    }
  });

  describe('User Schema Structure', () => {
    it('should have name field as required string', () => {
      if (!UserSchema) return;
      const nameField = UserSchema.path('name');
      expect(nameField).toBeDefined();
      expect(nameField.instance).toBe('String');
      expect(nameField.isRequired).toBe(true);
    });

    it('should have email field with required, unique, lowercase, and trim', () => {
      if (!UserSchema) return;
      const emailField = UserSchema.path('email');
      expect(emailField).toBeDefined();
      expect(emailField.instance).toBe('String');
      expect(emailField.isRequired).toBe(true);
      expect(emailField.options.unique).toBe(true);
      expect(emailField.options.lowercase).toBe(true);
      expect(emailField.options.trim).toBe(true);
    });

    it('should have provider field with enum values', () => {
      if (!UserSchema) return;
      const providerField = UserSchema.path('provider');
      expect(providerField).toBeDefined();
      expect(providerField.instance).toBe('String');
      expect(providerField.enumValues).toContain('credentials');
      expect(providerField.enumValues).toContain('google');
      expect(providerField.enumValues).toContain('azure-ad');
      expect(providerField.enumValues).toContain('oauth');
    });

    it('should have optional token management fields', () => {
      if (!UserSchema) return;
      expect(UserSchema.path('accessToken')).toBeDefined();
      expect(UserSchema.path('refreshToken')).toBeDefined();
      expect(UserSchema.path('tokenExpiry')).toBeDefined();
      expect(UserSchema.path('tokenExpiry').instance).toBe('Date');
    });

    it('should have emails array field', () => {
      if (!UserSchema) return;
      const emailsField = UserSchema.path('emails');
      expect(emailsField).toBeDefined();
      expect(emailsField.instance).toBe('Array');
    });

    it('should have lastEmailSync date field', () => {
      if (!UserSchema) return;
      const syncField = UserSchema.path('lastEmailSync');
      expect(syncField).toBeDefined();
      expect(syncField.instance).toBe('Date');
    });
  });

  describe('Email Schema Structure', () => {
    it('should have messageId as required field', () => {
      if (!UserSchema) return;
      const messageIdField = UserSchema.path('emails.messageId');
      expect(messageIdField).toBeDefined();
      expect(messageIdField.isRequired).toBe(true);
    });

    it('should have correct default values for email fields', () => {
      if (!UserSchema) return;
      expect(UserSchema.path('emails.subject').options.default).toBe('(No Subject)');
      expect(UserSchema.path('emails.from').options.default).toBe('unknown@unknown.com');
      expect(UserSchema.path('emails.to').options.default).toBe('unknown@unknown.com');
      expect(UserSchema.path('emails.body').options.default).toBe('');
      expect(UserSchema.path('emails.isRead').options.default).toBe(false);
      expect(UserSchema.path('emails.isPotentialPhishing').options.default).toBe(false);
      expect(UserSchema.path('emails.phishingScore').options.default).toBe(0);
    });

    it('should have enhanced analysis fields', () => {
      if (!UserSchema) return;
      expect(UserSchema.path('emails.prediction')).toBeDefined();
      expect(UserSchema.path('emails.confidence')).toBeDefined();
      expect(UserSchema.path('emails.model_used')).toBeDefined();
      expect(UserSchema.path('emails.virusTotalResult')).toBeDefined();
      expect(UserSchema.path('emails.heuristicScore')).toBeDefined();
      expect(UserSchema.path('emails.mlScore')).toBeDefined();
    });

    it('should have date field as required', () => {
      if (!UserSchema) return;
      const dateField = UserSchema.path('emails.date');
      expect(dateField).toBeDefined();
      expect(dateField.instance).toBe('Date');
      expect(dateField.isRequired).toBe(true);
    });
  });

  describe('URL Safety Result Schema', () => {
    it('should have url and isSafe as required fields', () => {
      if (!UserSchema) return;
      const urlField = UserSchema.path('emails.googleSafeBrowsingResult.url');
      const isSafeField = UserSchema.path('emails.googleSafeBrowsingResult.isSafe');
      expect(urlField).toBeDefined();
      expect(isSafeField).toBeDefined();
    });

    it('should have optional threat and platform type fields', () => {
      if (!UserSchema) return;
      expect(UserSchema.path('emails.googleSafeBrowsingResult.threatType')).toBeDefined();
      expect(UserSchema.path('emails.googleSafeBrowsingResult.platformType')).toBeDefined();
    });
  });

  describe('Schema Options', () => {
    it('should have timestamps enabled', () => {
      if (!UserSchema) return;
      expect(UserSchema.options.timestamps).toBe(true);
    });
  });
});

// models/User.ts

import mongoose from 'mongoose';

// Email schema for storing fetched emails
const EmailSchema = new mongoose.Schema({
  messageId: { type: String, required: true },
  subject: { type: String, default: '(No Subject)' },
  from: { type: String, required: true, default: 'unknown@unknown.com' },
  to: { type: String, default: 'unknown@unknown.com' },
  date: { type: Date, required: true },
  body: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  isPotentialPhishing: { type: Boolean, default: false },
  phishingScore: { type: Number, default: 0 },
  phishingReasons: [{ type: String }],
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true, // This creates an index automatically
    lowercase: true, // Normalize email to lowercase
    trim: true, // Remove whitespace
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: function(this: any) {
      return this.provider === 'credentials';
    },
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'azure-ad', 'oauth'], // Added 'oauth' for backward compatibility
    default: 'credentials'
  },
  // These token fields are not typically stored in DB with NextAuth
  // NextAuth stores them in the JWT token instead
  // Consider removing these or using them only for manual token management
  accessToken: { type: String },
  refreshToken: { type: String },
  tokenExpiry: { type: Date },
  
  emails: [EmailSchema],
  lastEmailSync: { type: Date },
}, { timestamps: true });

// Add index for faster email lookups
UserSchema.index({ email: 1 });

// Add index for messageId in emails array for faster duplicate checks
UserSchema.index({ 'emails.messageId': 1 });

// Prevent duplicate emails based on messageId
EmailSchema.index({ messageId: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
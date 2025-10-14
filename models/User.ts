// models/User.ts

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true, // Ensures no two users can have the same email
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.models.User || mongoose.model('User', UserSchema);
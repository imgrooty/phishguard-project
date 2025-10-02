import {z} from 'zod';

export const usernameValidation = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(20, 'Username must be at most 20 characters long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

// export const emailSchema = z
//   .string()
//   .min(5, 'Email must be at least 5 characters long')
//   .max(100, 'Email must be at most 100 characters long')
//   .email('Invalid email address');

// export const passwordSchema = z
//   .string()
//   .min(8, 'Password must be at least 8 characters long')
//   .max(100, 'Password must be at most 100 characters long')
//   .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
//   .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
//   .regex(/[0-9]/, 'Password must contain at least one number')
//   .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({message: 'Invalid email address'}),
  password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
});
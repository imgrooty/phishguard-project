// /app/api/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import { signToken } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    // 1. Connect to the database
    // It's crucial this function works correctly.
    await dbConnect();

    // 2. Parse the incoming request body
    const body = await req.json();
    const { name, email, password } = body;

    // 3. Validate that all required fields are present
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields: name, email, or password' },
        { status: 400 } // Bad Request
      );
    }

    // 4. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 } // Conflict - a more appropriate status code
      );
    }

    // 5. Hash the user's password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create the new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 7. Generate a JWT for the newly created user
    const token = signToken({ userId: (user._id as any).toString() });

    // 8. Return a success response with sanitized user data and the token
    return NextResponse.json(
      {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
      { status: 201 } // 201 Created - the standard for success
    );

  } catch (error) {
    // 9. Catch and log any errors that occur during the process
    console.error('REGISTRATION_ERROR:', error);

    // Provide a more specific error if it's a Mongoose validation issue
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: `Validation Error: ${error.message}` },
        { status: 400 }
      );
    }

    // Fallback for any other unexpected errors
    return NextResponse.json(
      { message: 'An unexpected server error occurred' },
      { status: 500 }
    );
  }
}
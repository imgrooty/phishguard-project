// app/api/login/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import { signToken } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email }).select('+password'); // Include password for comparison

    if (!user) {
      // Generic error message for security
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 } // Unauthorized
      );
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 } // Unauthorized
      );
    }

    // If credentials are correct, sign a token
    const token = signToken({ userId: user._id.toString() });

    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error('LOGIN_ERROR', error);
    return NextResponse.json(
      { message: 'An unexpected server error occurred' },
      { status: 500 }
    );
  }
}
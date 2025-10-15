import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { verifyToken, unauthorizedResponse } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // 🔹 1. Get Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse()
    }

    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return unauthorizedResponse()

    // 🔹 2. Verify token
    const payload = verifyToken(token)
    if (!payload || !payload.userId) {
      return unauthorizedResponse()
    }

    // 🔹 3. Connect to DB
    await dbConnect()

    // 🔹 4. Fetch user (exclude password)
    const user = await User.findById(payload.userId).select('-password')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 🔹 5. Success response
    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error('❌ Error in /api/auth/me:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

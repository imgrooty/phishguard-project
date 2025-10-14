import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/dbConnect'
import User from '../../../../models/User'
import { verifyToken } from '../../../../lib/auth'


export async function GET(req: Request) {
try {
const auth = req.headers.get('authorization') || ''
const token = auth.replace('Bearer ', '')
if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 })


const payload = verifyToken(token)
if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })


await dbConnect()
const user = await User.findById(payload.userId).select('-password')
if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })


return NextResponse.json({ user })
} catch (err) {
console.error(err)
return NextResponse.json({ error: 'Server error' }, { status: 500 })
}
}
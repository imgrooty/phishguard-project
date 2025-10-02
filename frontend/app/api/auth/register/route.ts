import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '../../../../lib/dbConnect'
import User from '../../../../models/User'
import { signToken } from '../../../../lib/auth'


export async function POST(req: Request) {
try {
const body = await req.json()
const { name, email, password } = body
if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })


await dbConnect()
const existing = await User.findOne({ email })
if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 })


const hashed = await bcrypt.hash(password, 10)
const user = await User.create({ name, email, password: hashed })


const token = signToken({ userId: (user._id as any).toString() })
return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email }, token })
} catch (err) {
console.error(err)
return NextResponse.json({ error: 'Server error' }, { status: 500 })
}
}
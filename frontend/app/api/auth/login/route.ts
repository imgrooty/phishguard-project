import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '../../../../lib/dbConnect'
import User from '../../../../models/User'
import { signToken } from '../../../../lib/auth'


export async function POST(req: Request) {
try {
const body = await req.json()
const { email, password } = body
if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })


await dbConnect()
const user = await User.findOne({ email })
if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })


const ok = await bcrypt.compare(password, user.password)
if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })


const token = signToken({ userId: user._id.toString() })
return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email }, token })
} catch (err) {
console.error(err)
return NextResponse.json({ error: 'Server error' }, { status: 500 })
}
}
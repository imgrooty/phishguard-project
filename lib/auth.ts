/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'


const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'


export function signToken(payload: { userId: string }) {
return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}


export function verifyToken(token: string) {
try {
return jwt.verify(token, JWT_SECRET) as { userId: string }
} catch (err) {
return null
}
}


export function unauthorizedResponse() {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

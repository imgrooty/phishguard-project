import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'


export async function POST(req: Request) {
try {
const auth = req.headers.get('authorization') || ''
const token = auth.replace('Bearer ', '')
const payload = verifyToken(token)
if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })


const body = await req.json()
const { subject, from, bodyText } = body || {}


// Dummy heuristics: look for suspicious words or links
const suspiciousWords = ['password', 'verify', 'account', 'login', 'urgent']
const found = suspiciousWords.filter((w) => (subject + ' ' + bodyText).toLowerCase().includes(w))
const isSuspicious = found.length > 0


return NextResponse.json({ isSuspicious, reasons: found })
} catch (err) {
console.error(err)
return NextResponse.json({ error: 'Server error' }, { status: 500 })
}
}
import { NextResponse } from 'next/server'


export async function POST() {
// Stateless token approach: client just deletes token. Keep endpoint for symmetry.
return NextResponse.json({ ok: true })
}
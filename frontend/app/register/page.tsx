'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function RegisterPage() {
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const router = useRouter()


async function submit(e: React.FormEvent) {
e.preventDefault()
setError('')
const res = await fetch('/api/auth/register', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name, email, password }),
})
const data = await res.json()
if (data.error) return setError(data.error)
// save token then redirect
localStorage.setItem('token', data.token)
router.push('/dashboard')
}


return (
<main className="min-h-screen flex items-center justify-center bg-gray-50">
<form onSubmit={submit} className="max-w-md w-full p-6 bg-white rounded shadow">
<h2 className="text-xl font-bold mb-4">Register</h2>
{error && <div className="text-red-600 mb-2">{error}</div>}
<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mb-2 p-2 border w-full" />
<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border w-full" />
<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="mb-4 p-2 border w-full" />
<button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Register</button>
</form>
</main>
)
}

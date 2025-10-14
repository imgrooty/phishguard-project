import Link from 'next/link'


export default function HomeSection() {
return (
<main className="min-h-screen flex items-center justify-center bg-gray-50">
<div className="max-w-md w-full p-6 bg-white rounded shadow">
<h1 className="text-2xl font-bold mb-4">PhishGuard (Simple)</h1>
<p className="mb-6">A minimal phishing-email-checker demo with auth.</p>
<div className="flex gap-2">
<Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded">Register</Link>
<Link href="/login" className="px-4 py-2 border rounded">Login</Link>
</div>
</div>
</main>
)
}
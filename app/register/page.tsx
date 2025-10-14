'use client';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Server did not return valid JSON. Check API route.');
      }

      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      if (!data.token) throw new Error('No token received from server');

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
      if (session) {
        router.push('/dashboard');
      }
    }, [session, router]);
  
    if (session) {
      return null; // nothing displayed
    }
  

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-white p-6">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 to-blue-500 items-center justify-center p-8">
          <img
            src="https://interviewexpress.vercel.app/onGoingChallenges.gif" // use your generated image here
            alt="Register Illustration"
            width={600}
            height={600}
            className="drop-shadow-2xl"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Create an Account</h2>
          <p className="text-gray-500 text-center mb-6">Join us and start your journey today 🚀</p>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => signIn('google')}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-all duration-200"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                width={22}
                height={22}
              />
              <span className="text-gray-700 font-semibold">Sign up with Google</span>
            </button>

            <button
              onClick={() => signIn('azure-ad')}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-white border border-gray-300 hover:shadow-lg transition-all duration-200"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft logo"
                width={22}
                height={22}
              />
              <span className="text-gray-700 font-semibold">Sign up with Microsoft</span>
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or register with email</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">
                Full Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

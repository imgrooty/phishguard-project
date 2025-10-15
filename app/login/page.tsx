"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

 // Handle credentials login
  const handleCredentialsLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  // Handle social logins
  const handleSocialLogin = async (provider: 'google' | 'azure-ad') => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error(err);
      setError(`Failed to login with ${provider}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left side illustration or branding */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-10 text-center">
        <img
          src="https://interviewexpress.vercel.app/onGoingChallenges.gif"
          alt="Login Illustration"
          width={450}
          height={450}
          className="mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-gray-600 mt-2">
          Sign in to continue to your dashboard and manage your account easily.
        </p>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 max-w-md p-8 bg-white rounded-2xl shadow-lg mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign In to Your Account
        </h2>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-3 px-6 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 shadow-sm transition"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              width={20}
              height={20}
            />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin('azure-ad')}
            className="flex items-center justify-center gap-3 px-6 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 shadow-sm transition"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft logo"
              width={20}
              height={20}
            />
            <span className="text-gray-700 font-medium">Continue with Microsoft</span>
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Email / Password Login */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition disabled:bg-blue-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-800">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}

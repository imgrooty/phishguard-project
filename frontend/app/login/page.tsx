'use client';

import { useState, FormEvent } from 'react';

// SVG Icon for Google
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.92C34.553 6.136 29.63 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691c-1.211 2.22-1.905 4.773-1.905 7.509s.694 5.289 1.905 7.509L.903 35.13C-.422 31.895-1 28.062-1 24s.422-7.895 1.306-11.13L6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 48c5.63 0 10.553-1.846 14.097-4.92l-5.4-5.4c-1.921 1.287-4.382 2.04-7.097 2.04c-5.223 0-9.673-3.34-11.255-7.85l-5.694 5.218C8.941 42.602 15.91 48 24 48z"></path>
    <path fill="#1976D2" d="M43.611 20.083L48 20V24c0 11.045-8.955 20-20 20c-8.086 0-15.055-4.796-18.194-11.86l5.694-5.218C14.327 34.66 18.777 38 24 38c5.223 0 9.673-3.34 11.255-7.85l5.4 5.4C38.154 41.154 43 33.38 43 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

// SVG Icon for Outlook/Microsoft
const OutlookIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.25 11.25H3.75V3.75H11.25V11.25ZM11.25 20.25H3.75V12.75H11.25V20.25ZM20.25 11.25H12.75V3.75H20.25V11.25ZM20.25 20.25H12.75V12.75H20.25V20.25Z"></path>
    </svg>
);


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Both email and password are required.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // On successful login, save the token and redirect
      // Note: Using localStorage is fine for simple apps, but consider more secure storage for production.
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard'; // Redirect to a protected dashboard page

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'outlook') => {
    // This is where you would initiate the OAuth flow.
    // For a real application, you'd use a library like NextAuth.js
    // which handles the redirects and callbacks.
    // Example: signIn(provider, { callbackUrl: '/dashboard' });
    console.log(`Login with ${provider} clicked.`);
    setError(`Login with ${provider} is not implemented yet.`);
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg space-y-6">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to continue to your account.</p>
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <a href="/register" className="font-bold text-blue-600 hover:text-blue-800">
            Register Here
          </a>
        </p>
        </div>

        <div className="space-y-4">
            <button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
                <GoogleIcon />
                Sign in with Google
            </button>
             <button
                onClick={() => handleSocialLogin('outlook')}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
                <OutlookIcon />
                Sign in with Outlook
            </button>
        </div>
        
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <button
              className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-blue-400 transition duration-150 ease-in-out"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}


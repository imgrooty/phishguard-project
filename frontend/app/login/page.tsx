"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Welcome, {session.user?.name}</h2>
          <p className="text-gray-600">{session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password, redirect: false });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full border px-4 py-2 rounded hover:bg-gray-50"
          >
            Continue with Google
          </button>

          <button
            onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/dashboard" })}
            className="w-full border px-4 py-2 rounded hover:bg-gray-50"
          >
            Continue with Microsoft
          </button>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label>Email</label>
            <div className="relative">
              <Mail className="absolute left-2 top-2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-8 w-full border rounded px-2 py-2"
              />
            </div>
          </div>

          <div>
            <label>Password</label>
            <div className="relative">
              <Lock className="absolute left-2 top-2 text-gray-400 h-5 w-5" />
              <input
              aria-label="Password"
              type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-8 pr-10 w-full border rounded px-2 py-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Mail, Eye, EyeOff, Lock, Shield, Zap, ArrowRight, Chrome } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Access Granted</h2>
          <p className="text-slate-300 mb-2">Welcome back, {session.user?.name}</p>
          <p className="text-slate-400 text-sm mb-6">{session.user?.email}</p>
          
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Access Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-lg hover:bg-red-500/30 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password, redirect: false });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 w-full max-w-md mx-4 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Secure Access</h1>
          <p className="text-slate-400">Enter your credentials to continue</p>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg hover:bg-slate-700 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/dashboard" })}
            className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg hover:bg-slate-700 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
          >
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></div>
            Continue with Microsoft
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-800 px-4 text-slate-400">Or continue with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
              <input
                type="email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
              <input
                aria-label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Secure Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Create Account
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Your connection is secured with end-to-end encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
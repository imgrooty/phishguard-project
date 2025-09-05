"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Shield, Zap, CheckCircle } from "lucide-react";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle register logic here
  };

  const passwordStrength = formData.password.length > 0 ? (
    formData.password.length < 6 ? 'weak' :
    formData.password.length < 10 ? 'medium' : 'strong'
  ) : null;

  const features = [
    "AI-powered threat detection",
    "Real-time email scanning",
    "Advanced phishing protection",
    "24/7 security monitoring"
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      <div className="relative w-full max-w-6xl mx-4 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Features */}
        <div className="hidden lg:block animate-slide-in-left">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white mb-6">
              Join the <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Security Revolution</span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Get instant access to enterprise-grade cybersecurity protection powered by advanced AI technology.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-fade-in-up"
                  style={{animationDelay: `${i * 0.1}s`}}
                >
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="animate-slide-in-right">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400">Start your secure journey today</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a strong password"
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
                
                {/* Password Strength */}
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      <div className={`h-1 flex-1 rounded ${passwordStrength === 'weak' ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                      <div className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-slate-600'}`}></div>
                      <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                    </div>
                    <p className={`text-xs mt-1 ${
                      passwordStrength === 'weak' ? 'text-red-400' :
                      passwordStrength === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      Password strength: {passwordStrength}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Create Secure Account
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Protected by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
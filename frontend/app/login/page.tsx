"use client";

import React, { useState } from "react";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="text-teal-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

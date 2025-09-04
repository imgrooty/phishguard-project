"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Shield, Menu, X, Zap, Lock } from "lucide-react";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLoggedIn = !!session?.user;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/20' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link className="flex items-center gap-2 text-cyan-400 font-bold text-xl group" href="/">
          <div className="relative">
            <Shield className="w-8 h-8 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </div>
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            PhishGuard
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 relative group"
            href="/about"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          
          {isLoggedIn && (
            <Link
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 relative group"
              href="/dashboard"
            >
              <Lock className="w-4 h-4 inline mr-1" />
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          )}

          <Link
            className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 relative group"
            href="/blog"
          >
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">{session.user?.name || session.user?.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200 hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 glow-cyan"
                href="/register"
              >
                <Zap className="w-4 h-4 inline mr-1" />
                Get Protected
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-cyan-500/20">
          <div className="px-4 py-4 space-y-3">
            <Link
              className="block text-slate-300 hover:text-cyan-400 transition-colors"
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {isLoggedIn && (
              <Link
                className="block text-slate-300 hover:text-cyan-400 transition-colors"
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Link
              className="block text-slate-300 hover:text-cyan-400 transition-colors"
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => signOut()}
                className="block w-full text-left text-red-400 hover:text-red-300 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <Link
                  className="block text-slate-300 hover:text-cyan-400 transition-colors"
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  className="block bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-lg text-center"
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Protected
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaUserPlus, FaInfoCircle, FaTachometerAlt, FaBlog } from "react-icons/fa";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link className="flex items-center text-teal-600 font-bold text-lg" href="/">
          PhishGuard
        </Link>

        {/* Navigation */}
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>  
                <Link
                  className="text-gray-500 transition hover:text-teal-600"
                  href="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 transition hover:text-teal-600"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-500 transition hover:text-teal-600"
                  href="/blog"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <Link
                className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                href="/profile"
              >
                Profile
              </Link>
            ) : (
              <div className="sm:flex sm:gap-4">
                <Link
                  className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                  href="/login"
                >
                  Login
                </Link>

                <Link
                  className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block"
                  href="/register"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden"
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
         <nav
      className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white z-50 transition-transform duration-300 ease-in-out ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
        <h2 className="text-xl font-bold text-teal-600">Menu</h2>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="text-gray-500 hover:text-teal-600 text-2xl"
        >
          ✕
        </button>
      </div>

      <ul className="flex flex-col gap-6 px-6 py-6 text-lg font-medium text-gray-700">
        <li>
          <Link
            href="/about"
            className="flex items-center gap-3 hover:text-teal-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaInfoCircle /> About
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 hover:text-teal-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            className="flex items-center gap-3 hover:text-teal-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaBlog /> Blog
          </Link>
        </li>
        {!session && (
          <li>
            <Link
              href="/register"
              className="flex items-center gap-3 hover:text-teal-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUserPlus /> Register
            </Link>
          </li>
        )}
      </ul>
    </nav>

        )}
      </div>
    </header>
  );
};

export default Header;

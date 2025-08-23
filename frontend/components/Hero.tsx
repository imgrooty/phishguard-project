"use client";

import React from "react";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-teal-100 overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4 py-24 lg:flex lg:items-center lg:gap-12 lg:px-8">
        
        {/* Left: Text Content */}
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Defend Against <span className="text-teal-600">Phishing Attacks</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            PhishGuard uses AI/ML models to analyze emails, links, and websites in real time —
            giving you instant protection and insights before you visit the dark.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/try-demo"
              className="rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-teal-700 hover:scale-105"
            >
              Try Demo
            </Link>

            <Link
              href="/learn-more"
              className="rounded-lg border border-teal-600 px-6 py-3 text-base font-semibold text-teal-600 transition hover:bg-teal-50 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right: Illustration / Graphic */}
        <div className="relative mt-12 lg:mt-0 lg:flex-1">
          <svg
            className="mx-auto w-full max-w-lg drop-shadow-lg"
            viewBox="0 0 1024 768"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Modern shield icon */}
            <path
              d="M512 64C512 64 256 128 256 384C256 640 512 768 512 768C512 768 768 640 768 384C768 128 512 64 512 64Z"
              fill="#14b8a6"
              opacity="0.85"
            />
            <path
              d="M512 200L650 340L470 520L370 420"
              stroke="white"
              strokeWidth="48"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;

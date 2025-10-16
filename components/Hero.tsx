"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-teal-100 overflow-hidden min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 py-14 lg:flex lg:items-center lg:gap-12 lg:px-8">

        {/* Left: Text Content */}
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left animate-fade-in-up">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
            <Shield className="w-8 h-8 text-teal-600" />
            <span className="text-teal-600 font-semibold text-lg">AI-Powered Protection</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-tight">
            Defend Against <span className="text-teal-600 relative">
              Phishing Attacks
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-teal-300 rounded-full"></div>
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl">
            PhishGuard uses advanced AI/ML models to analyze emails, links, and websites in real time —
            giving you instant protection and insights before you visit the dark web.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="#demo-form"
              className="group inline-flex items-center gap-2 rounded-lg bg-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-teal-700 hover:scale-105 hover:shadow-xl"
            >
              Try Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              href="#features"
              className="group inline-flex items-center gap-2 rounded-lg border-2 border-teal-600 px-8 py-4 text-lg font-semibold text-teal-600 transition-all duration-300 hover:bg-teal-50 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Learn More
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>99.9% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free to Use</span>
            </div>
          </div>
        </div>

        {/* Right: Illustration / Graphic */}
        <div className="relative mt-12 lg:mt-0 lg:flex-1 animate-fade-in-right">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src="heroimage.png"
                alt="PhishGuard Security Dashboard"
                className="w-full h-auto rounded-2xl"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                Safe ✓
              </div>
              <div className="absolute -bottom-4 -left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                Blocked ✗
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-teal-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-teal-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

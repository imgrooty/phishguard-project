"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
           {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-teal-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            About PhishGuard
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Protecting Your <span className="text-teal-600">Digital World</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make the internet safer for everyone. Learn how our AI-powered tools keep you protected from phishing and online threats.
          </p>
        </div>
      </section>
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 sm:p-10 animate-fade-in">
          {/* <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">About PhishGuard</h1> */}

          <div className="space-y-12">
            {/* Mission Section */}
            <section className="flex flex-col-reverse lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-semibold text-teal-600 mb-3">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  PhishGuard is dedicated to protecting users from phishing attacks and online threats.
                  Our mission is to provide cutting-edge security solutions that keep you safe in the digital world.
                </p>
              </div>
              <div className="lg:w-1/2">
                <img
                  src="https://cdn.dribbble.com/userupload/42107983/file/original-a215af043a6068d439c8e0092ba0a5b8.gif"
                  alt="Mission illustration"
                  width={500}
                  height={300}
                  className="w-full max-w-md mx-auto"
                />
              </div>
            </section>

            {/* What We Do */}
            <section className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <img
                  src="https://cdn.dribbble.com/userupload/21955253/file/original-cbc2133f09318197a07643d9033a3f16.gif"
                  alt="Security illustration"
                  width={500}
                  height={300}
                  className="w-full max-w-md mx-auto"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-semibold text-teal-600 mb-3">What We Do</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  We develop advanced algorithms and machine learning models to detect and prevent phishing attempts,
                  malicious websites, and other online security threats.
                </p>
              </div>
            </section>

            {/* Team Section */}
            <section className="flex flex-col-reverse lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-semibold text-teal-600 mb-3">Our Team</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Our team consists of experienced cybersecurity professionals, data scientists, and software engineers
                  who are passionate about creating a safer online environment for everyone.
                </p>
              </div>
              <div className="lg:w-1/2">
                <img
                  src="https://i.pinimg.com/originals/ad/3a/a1/ad3aa168b76a1846c56edad68c218242.gif"
                  alt="Team illustration"
                  width={500}
                  height={300}
                  className="w-full max-w-md mx-auto"
                />
              </div>
            </section>

            {/* Technology Section */}
            <section className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <img
                  src="https://assets-v2.lottiefiles.com/a/4364cddc-1189-11ee-91c1-ebf0c9fd63d3/UlLalnbCjy.gif"
                  alt="Technology illustration"
                  width={500}
                  height={300}
                  className="w-full max-w-md mx-auto"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-semibold text-teal-600 mb-3">Technology</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Built with modern technologies including Next.js, React, TypeScript, and advanced machine learning
                  frameworks, PhishGuard represents the forefront of web security innovation.
                </p>
              </div>
            </section>

            {/* Callout */}
            <div className="bg-teal-100 border-l-4 border-teal-600 p-6 rounded-md animate-fade-in-up">
              <p className="text-teal-900 text-lg text-center font-medium">
                <strong>Stay protected with PhishGuard — your trusted partner in online security.</strong>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 text-center transition duration-300"
            >
              Back to Home
            </Link>
            <Link
              href="/register"
              className="bg-white text-teal-600 border border-teal-600 px-6 py-3 rounded-md hover:bg-teal-50 text-center transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;

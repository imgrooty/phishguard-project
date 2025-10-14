"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
           {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 sm:p-10 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">About PhishGuard</h1>

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
                <Image
                  src="/images/mission.svg"
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
                <Image
                  src="/images/security.svg"
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
                <Image
                  src="/images/teamwork.svg"
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
                <Image
                  src="/images/technology.svg"
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

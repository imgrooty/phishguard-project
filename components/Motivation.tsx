import React from "react";
import { ShieldCheck, Users, TrendingUp, Heart } from "lucide-react";

export default function Motivation() {
  const stats = [
    { icon: Users, value: "500M+", label: "Users Protected" },
    { icon: TrendingUp, value: "99.9%", label: "Detection Rate" },
    { icon: ShieldCheck, value: "24/7", label: "Real-time Monitoring" },
    { icon: Heart, value: "100%", label: "Free & Open Source" }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-teal-500 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-teal-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-300 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <ShieldCheck className="w-5 h-5" />
            Our Mission
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Why We Built <span className="text-teal-600">PhishGuard</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Every day, millions of users fall victim to sophisticated phishing attacks that compromise their personal data and security.
            <span className="text-teal-600 font-semibold"> PhishGuard </span>
            was born out of a mission to fight back using cutting-edge AI and machine learning technology.
            Our goal is simple: make the web safer for everyone, everywhere.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Join the Fight Against Phishing</h3>
            <p className="text-teal-100 text-lg mb-6">
              Be part of the solution. Download PhishGuard today and help make the internet safer for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Get Started Free
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

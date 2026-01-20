"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Zap, CheckCircle } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white overflow-hidden py-12 lg:py-24">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:flex-1 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Zap className="w-3.5 h-3.5 fill-teal-500" />
            AI-Powered Email Security
          </motion.div>

          <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.1]">
            Next-Gen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Phishing Defense</span>
          </h1>

          <p className="mt-8 text-xl leading-relaxed text-gray-600 max-w-xl">
            PhishGuard leverages advanced heuristic analysis and machine learning to neutralize threats before they reach your inbox. Experience real-time protection for your digital identity.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-2xl bg-teal-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-teal-200 hover:bg-teal-700 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/about"
                className="flex items-center gap-2 rounded-2xl border-2 border-gray-100 bg-white px-8 py-4 text-lg font-bold text-gray-700 hover:border-teal-600 hover:text-teal-600 transition-all"
              >
                How it Works
              </Link>
            </motion.div>
          </div>

          <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">99.9% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Real-time Analysis</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:flex-1 relative"
        >
          <div className="relative z-10 p-4">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="heroimage.png"
                alt="PhishGuard Security Dashboard"
                className="rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-gray-100"
              />
            </motion.div>

            {/* Floating UI Elements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -right-4 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                <p className="text-sm font-bold text-gray-900">Protected</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute -left-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Analysis</p>
                <p className="text-sm font-bold text-gray-900">Real-time Active</p>
              </div>
            </motion.div>
          </div>

          {/* Decorative Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-teal-50 rounded-full -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-blue-50/50 rounded-full -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Zap, Eye, ArrowRight, Lock, Wifi, AlertTriangle } from "lucide-react";

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Advanced AI Protection";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      
      {/* Floating Security Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Shield className="absolute top-20 left-10 w-6 h-6 text-cyan-400/30 animate-float" style={{animationDelay: '0s'}} />
        <Lock className="absolute top-40 right-20 w-5 h-5 text-purple-400/30 animate-float" style={{animationDelay: '2s'}} />
        <Wifi className="absolute bottom-40 left-20 w-4 h-4 text-green-400/30 animate-float" style={{animationDelay: '4s'}} />
        <AlertTriangle className="absolute bottom-20 right-10 w-5 h-5 text-red-400/30 animate-float" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:flex lg:items-center lg:gap-16 lg:px-8">
        
        {/* Left: Text Content */}
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left lg:flex-1">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-500/20">
              <Zap className="w-4 h-4" />
              Next-Gen Security
            </span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="block">Defend Against</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse-glow">
              Cyber Threats
            </span>
          </h1>

          <div className="mt-6 text-xl leading-8 text-slate-300">
            <span className="block mb-2">{typedText}</span>
            <span className="block">Real-time threat detection • AI-powered analysis • Zero-day protection</span>
          </div>

          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/try-demo"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 glow-cyan"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Try Live Demo
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>

            <Link
              href="/about"
              className="group rounded-lg border-2 border-cyan-500/30 px-8 py-4 text-lg font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/10 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Learn More
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center lg:text-left">
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-cyan-400">99.9%</div>
              <div className="text-sm text-slate-400">Threat Detection</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-sm text-slate-400">Real-time Monitoring</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="text-3xl font-bold text-green-400">1M+</div>
              <div className="text-sm text-slate-400">Protected Users</div>
            </div>
          </div>
        </div>

        {/* Right: Cyber Visualization */}
        <div className="relative mt-16 lg:mt-0 lg:flex-1">
          <div className="relative mx-auto max-w-lg">
            {/* Central Shield */}
            <div className="relative z-10 mx-auto w-80 h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse-glow"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <Shield className="w-32 h-32 text-cyan-400 animate-float" />
            </div>

            {/* Orbiting Elements */}
            <div className="absolute inset-0 animate-spin" style={{animationDuration: '20s'}}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full glow-cyan"></div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full glow-purple"></div>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              </div>
            </div>

            {/* Scanning Lines */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent"></div>
    </section>
  );
};

export default Hero;
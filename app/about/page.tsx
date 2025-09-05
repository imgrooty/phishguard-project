"use client";

import React from "react";
import Link from "next/link";
import { Shield, Target, Zap, Users, Award, Globe, ArrowRight, Lock, Eye, Brain } from "lucide-react";

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Shield, label: "Threats Blocked", value: "50M+", color: "cyan" },
    { icon: Users, label: "Protected Users", value: "2M+", color: "purple" },
    { icon: Globe, label: "Countries Served", value: "150+", color: "green" },
    { icon: Award, label: "Security Awards", value: "25+", color: "red" }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced neural networks analyze millions of threat patterns to provide unparalleled protection against emerging cyber attacks."
    },
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "24/7 continuous surveillance of your digital footprint with instant threat detection and automated response protocols."
    },
    {
      icon: Lock,
      title: "Zero-Trust Architecture",
      description: "Military-grade security framework that verifies every connection and validates all data before granting access."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-6 py-3 text-cyan-400 border border-cyan-500/20 mb-8">
            <Shield className="w-5 h-5" />
            <span className="font-medium">About PhishGuard</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
            Redefining <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Cybersecurity</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
            We're not just another security company. We're the architects of tomorrow's digital defense, 
            using cutting-edge AI to stay ahead of cybercriminals and protect what matters most.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={i}
                  className="text-center group animate-fade-in-up"
                  style={{animationDelay: `${i * 0.1}s`}}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${
                    stat.color === 'cyan' ? 'from-cyan-500 to-blue-500' :
                    stat.color === 'purple' ? 'from-purple-500 to-pink-500' :
                    stat.color === 'green' ? 'from-green-500 to-teal-500' :
                    'from-red-500 to-orange-500'
                  } mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold text-white mb-6">
                Our <span className="text-cyan-400">Mission</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                In an era where cyber threats evolve faster than traditional defenses, PhishGuard stands as the 
                vanguard of digital protection. We harness the power of artificial intelligence to create an 
                adaptive security ecosystem that learns, evolves, and protects.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Our mission extends beyond mere protection—we're building a safer digital future where innovation 
                thrives without compromise, where trust is earned through transparency, and where security is 
                seamlessly integrated into every digital interaction.
              </p>
              
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105"
              >
                Join Our Mission
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Security Metrics</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Threat Detection Rate</span>
                      <span className="text-cyan-400 font-bold">99.97%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-[99.97%]"></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Response Time</span>
                      <span className="text-green-400 font-bold">&lt;50ms</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full w-[95%]"></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">False Positive Rate</span>
                      <span className="text-purple-400 font-bold">0.03%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-[3%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Advanced <span className="text-purple-400">Security Features</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Cutting-edge technology meets intuitive design to deliver uncompromising protection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={i}
                  className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{animationDelay: `${i * 0.2}s`}}
                >
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to <span className="text-cyan-400">Secure</span> Your Future?
            </h2>
            <p className="text-xl text-slate-300 mb-12">
              Join the cybersecurity revolution and protect what matters most with AI-powered defense systems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/register"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 glow-cyan"
              >
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="border-2 border-cyan-500/30 text-cyan-400 px-8 py-4 rounded-lg font-semibold hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-200"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
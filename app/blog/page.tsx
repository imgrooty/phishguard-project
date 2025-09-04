"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight, Shield, Lock, Brain, Target } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Evolution of AI in Cybersecurity: 2025 Threat Landscape",
    excerpt: "Explore how artificial intelligence is revolutionizing threat detection and response in the modern cybersecurity ecosystem.",
    author: "Dr. Sarah Chen",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "AI Security",
    image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Brain
  },
  {
    id: 2,
    title: "Zero-Day Exploits: How PhishGuard's Proactive Defense Works",
    excerpt: "Deep dive into our proprietary algorithms that detect and neutralize unknown threats before they can cause damage.",
    author: "Marcus Rodriguez",
    date: "2025-01-12",
    readTime: "12 min read",
    category: "Threat Detection",
    image: "https://images.pexels.com/photos/5240547/pexels-photo-5240547.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Target
  },
  {
    id: 3,
    title: "Enterprise Security: Building Fortress-Level Protection",
    excerpt: "Learn how enterprise organizations are implementing multi-layered security architectures to protect against sophisticated attacks.",
    author: "Jennifer Kim",
    date: "2025-01-10",
    readTime: "10 min read",
    category: "Enterprise",
    image: "https://images.pexels.com/photos/5380792/pexels-photo-5380792.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Lock
  },
  {
    id: 4,
    title: "Phishing 3.0: The New Generation of Social Engineering",
    excerpt: "Understanding the latest phishing techniques and how advanced AI detection can identify even the most sophisticated attempts.",
    author: "Alex Thompson",
    date: "2025-01-08",
    readTime: "6 min read",
    category: "Phishing",
    image: "https://images.pexels.com/photos/5240606/pexels-photo-5240606.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Shield
  }
];

const categories = ["All", "AI Security", "Threat Detection", "Enterprise", "Phishing"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-6 py-3 text-cyan-400 border border-cyan-500/20 mb-8">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Security Intelligence</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
            Cyber<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Security</span> Blog
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto animate-fade-in-up">
            Stay ahead of emerging threats with insights from our security experts, 
            AI research, and real-world threat intelligence.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-cyan-500/50 hover:text-cyan-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post, i) => {
              const IconComponent = post.icon;
              return (
                <article
                  key={post.id}
                  className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{animationDelay: `${i * 0.1}s`}}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <IconComponent className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 text-sm font-medium">{post.category}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-400 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>

                    {/* Read More */}
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group"
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-slate-800/50 border border-slate-700/50 text-slate-300 px-8 py-3 rounded-lg hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-200">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay <span className="text-cyan-400">Informed</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get the latest cybersecurity insights and threat intelligence delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
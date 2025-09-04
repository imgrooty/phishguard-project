import React from "react";
import Link from "next/link";
import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Shield className="w-10 h-10 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-30"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                PhishGuard
              </span>
            </div>
            
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              Protecting millions of users worldwide with AI-powered cybersecurity solutions. 
              Your digital safety is our mission.
            </p>
            
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-500 transition-colors group">
                <Github className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </button>
              <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors group">
                <Twitter className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </button>
              <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors group">
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </button>
              <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors group">
                <Mail className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Security</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/threat-detection" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Threat Detection
                </Link>
              </li>
              <li>
                <Link href="/email-protection" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Email Protection
                </Link>
              </li>
              <li>
                <Link href="/web-security" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Web Security
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Security Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} PhishGuard. All rights reserved. 
            <span className="text-cyan-400 ml-2">Secured by AI</span>
          </p>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
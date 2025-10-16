import React from "react";
import Link from "next/link";
import { Download, Chrome } from "lucide-react";

export default function DownloadExtension() {
  return (
    <section className="bg-gradient-to-r from-teal-600 to-teal-800 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Get PhishGuard Browser Extension
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Install our browser extension for seamless protection across all your browsing activities.
            Available for Chrome, Firefox, and Safari.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <Chrome className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Chrome</h3>
            <p className="text-white/80 mb-6">For Google Chrome users</p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
              Download for Chrome
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Firefox</h3>
            <p className="text-white/80 mb-6">For Mozilla Firefox users</p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
              Download for Firefox
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Safari</h3>
            <p className="text-white/80 mb-6">For Apple Safari users</p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
              Download for Safari
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/80 text-lg">
            Free to download • No registration required • Regular updates
          </p>
        </div>
      </div>
    </section>
  );
}

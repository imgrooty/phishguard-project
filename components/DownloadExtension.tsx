"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Download, Chrome, Info } from "lucide-react";

export default function DownloadExtension() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <section className="bg-gradient-to-r from-teal-600 to-teal-800 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Get PhishGuard Browser Extension
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Install our browser extension for seamless protection across all your browsing activities.
            Compatible with Chrome, Edge, Brave, and Firefox.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <Chrome className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Chrome / Edge / Brave</h3>
            <p className="text-white/80 mb-6">Chromium-based browsers</p>
            <a
              href="/phishguard-extension.zip"
              download
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
              Download Extension
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Firefox</h3>
            <p className="text-white/80 mb-6">For Mozilla Firefox users</p>
            <a
              href="/phishguard-extension.zip"
              download
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <Download className="w-5 h-5" />
              Download Extension
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <Info className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Installation Guide</h3>
            <p className="text-white/80 mb-6">Step-by-step instructions</p>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <Info className="w-5 h-5" />
              View Instructions
            </button>
          </div>
        </div>

        {showInstructions && (
          <div className="mt-12 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Installation Instructions</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-white mb-3">Chrome / Edge / Brave</h4>
                <ol className="text-white/90 space-y-2 list-decimal list-inside">
                  <li>Download and extract the extension ZIP file</li>
                  <li>Open your browser and navigate to:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Chrome: <code className="bg-white/20 px-2 py-1 rounded">chrome://extensions/</code></li>
                      <li>Edge: <code className="bg-white/20 px-2 py-1 rounded">edge://extensions/</code></li>
                      <li>Brave: <code className="bg-white/20 px-2 py-1 rounded">brave://extensions/</code></li>
                    </ul>
                  </li>
                  <li>Enable "Developer mode" (toggle in top-right corner)</li>
                  <li>Click "Load unpacked" and select the extracted extension folder</li>
                  <li>The PhishGuard extension is now installed!</li>
                </ol>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-white mb-3">Firefox</h4>
                <ol className="text-white/90 space-y-2 list-decimal list-inside">
                  <li>Download and extract the extension ZIP file</li>
                  <li>Navigate to <code className="bg-white/20 px-2 py-1 rounded">about:debugging#/runtime/this-firefox</code></li>
                  <li>Click "Load Temporary Add-on"</li>
                  <li>Select the manifest.json file from the extracted folder</li>
                  <li>The extension is now loaded (temporary installation)</li>
                </ol>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">⚠️ Important:</p>
                <ul className="text-white/90 space-y-1 list-disc list-inside">
                  <li>The PhishGuard web app must be running at <code className="bg-white/20 px-2 py-1 rounded">http://localhost:3000</code></li>
                  <li>You must be logged in to use the extension features</li>
                  <li>Full README with troubleshooting is included in the download</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-white/80 text-lg">
            Free to download • Requires web app authentication • Regular updates
          </p>
        </div>
      </div>
    </section>
  );
}

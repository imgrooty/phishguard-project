"use client";
import Hero from "@/components/Hero";
import Motivation from "@/components/Motivation";
import Team from "@/components/Team";
import { useState } from "react";
import { Terminal, Play, Shield, AlertCircle } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: Number(age) }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to connect to API" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />
      <Team />
      <Motivation />

      {/* API Demo Section */}
      <section className="relative py-24 bg-slate-900">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-6 py-3 text-cyan-400 border border-cyan-500/20 mb-6">
                <Terminal className="w-5 h-5" />
                <span className="font-medium">Live API Demo</span>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4">
                Test Our <span className="text-cyan-400">Security API</span>
              </h2>
              <p className="text-slate-300 text-lg">
                Experience real-time threat analysis with our machine learning backend
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Input Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    Security Analysis Input
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter test name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Enter test age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      />
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !name || !age}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Run Security Analysis
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-green-400" />
                    API Response
                  </h3>
                  
                  <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 min-h-[200px] font-mono text-sm">
                    {result ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-400 mb-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Response received</span>
                        </div>
                        <pre className="text-slate-300 whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500">
                        <div className="text-center">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Waiting for API request...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-6 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>FastAPI Backend Connected</span>
                </div>
                <div className="text-slate-500">
                  Endpoint: <code className="text-cyan-400">127.0.0.1:8000/predict</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
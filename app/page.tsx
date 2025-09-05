"use client";
import { useState } from "react";
import { Terminal, Play, Shield, AlertCircle } from "lucide-react";
import Hero from "@/components/Hero";
import Motivation from "@/components/Motivation";
import Team from "@/components/Team";

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
    <div className="min-h-screen bg-background">
      <Hero />
      <Team />
      <Motivation />

      {/* API Demo Section */}
      <section className="relative py-24 bg-muted/50">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyber-cyan/10 px-6 py-3 text-cyber-cyan border border-cyber-cyan/20 mb-6">
                <Terminal className="w-5 h-5" />
                <span className="font-medium">Live API Demo</span>
              </div>
              
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Test Our <span className="text-cyber-cyan">Security API</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Experience real-time threat analysis with our machine learning backend
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Input Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyber-cyan" />
                    Security Analysis Input
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter test name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-muted/50 border border-input rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Enter test age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-muted/50 border border-input rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-colors"
                      />
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !name || !age}
                      className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:from-cyber-cyan/80 hover:to-cyber-purple/80 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 glow-cyan"
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
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyber-green" />
                    API Response
                  </h3>
                  
                  <div className="bg-background/80 border border-border rounded-lg p-4 min-h-[200px] font-mono text-sm">
                    {result ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-cyber-green mb-3">
                          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                          <span>Response received</span>
                        </div>
                        <pre className="text-muted-foreground whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
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
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></div>
                  <span>FastAPI Backend Connected</span>
                </div>
                <div className="text-muted-foreground">
                  Endpoint: <code className="text-cyber-cyan">127.0.0.1:8000/predict</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
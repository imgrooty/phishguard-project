"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Shield, AlertTriangle, CheckCircle, Clock, Eye, Filter, Search } from "lucide-react";

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  provider?: string;
  threatLevel?: 'safe' | 'suspicious' | 'dangerous';
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'safe' | 'suspicious' | 'dangerous'>('all');

  useEffect(() => {
    if (session?.access_token) {
      fetch("/api/emails")
        .then((res) => res.json())
        .then((data) => {
          // Simulate threat analysis
          const allEmails: Email[] = (data.emails || []).map((email: any, index: number) => ({
            ...email,
            provider: data.provider,
            threatLevel: index % 3 === 0 ? 'dangerous' : index % 3 === 1 ? 'suspicious' : 'safe'
          }));
          setEmails(allEmails);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">Please authenticate to access the security dashboard</p>
          <Link
            href="/login"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
          >
            Secure Login
          </Link>
        </div>
      </div>
    );
  }

  const filteredEmails = emails.filter(email => 
    filter === 'all' || email.threatLevel === filter
  );

  const threatCounts = {
    safe: emails.filter(e => e.threatLevel === 'safe').length,
    suspicious: emails.filter(e => e.threatLevel === 'suspicious').length,
    dangerous: emails.filter(e => e.threatLevel === 'dangerous').length
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      <div className="relative container mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Security <span className="text-cyan-400">Dashboard</span>
              </h1>
              <p className="text-slate-400">
                Welcome back, <span className="text-cyan-400">{session.user?.name}</span> • 
                <span className="text-slate-500 ml-1">{session.user?.email}</span>
              </p>
            </div>
            
            <button
              onClick={() => signOut()}
              className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-lg hover:bg-red-500/30 transition-all duration-200 hover:scale-105"
            >
              Secure Logout
            </button>
          </div>
        </div>

        {/* Threat Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-6 h-6 text-cyan-400" />
              <span className="text-slate-300 font-medium">Total Emails</span>
            </div>
            <div className="text-3xl font-bold text-white">{emails.length}</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-slate-300 font-medium">Safe</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{threatCounts.safe}</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-400" />
              <span className="text-slate-300 font-medium">Suspicious</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{threatCounts.suspicious}</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <span className="text-slate-300 font-medium">Dangerous</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{threatCounts.dangerous}</div>
          </div>
        </div>

        {/* Email Analysis */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Eye className="w-7 h-7 text-cyan-400" />
              Email Threat Analysis
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  className="bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              >
                <option value="all">All Emails</option>
                <option value="safe">Safe</option>
                <option value="suspicious">Suspicious</option>
                <option value="dangerous">Dangerous</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Analyzing email threats...</p>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No emails found for the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`border rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] ${
                    email.threatLevel === 'dangerous' 
                      ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50' :
                    email.threatLevel === 'suspicious'
                      ? 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50' :
                      'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white text-lg">
                          {email.subject || "(No Subject)"}
                        </h3>
                        
                        {/* Threat Level Badge */}
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          email.threatLevel === 'dangerous' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          email.threatLevel === 'suspicious'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {email.threatLevel === 'dangerous' && <AlertTriangle className="w-3 h-3" />}
                          {email.threatLevel === 'suspicious' && <Clock className="w-3 h-3" />}
                          {email.threatLevel === 'safe' && <CheckCircle className="w-3 h-3" />}
                          {email.threatLevel?.toUpperCase()}
                        </div>
                      </div>
                      
                      <p className="text-slate-300 mb-1">From: {email.from}</p>
                      <p className="text-slate-500 text-sm mb-4">
                        {new Date(email.date).toLocaleString()}
                      </p>
                      
                      <div className="text-slate-400">
                        {expandedEmail === email.id
                          ? email.snippet
                          : `${email.snippet.slice(0, 200)}...`}
                      </div>
                      
                      {email.snippet.length > 200 && (
                        <button
                          className="text-cyan-400 text-sm mt-2 hover:text-cyan-300 transition-colors"
                          onClick={() =>
                            setExpandedEmail(
                              expandedEmail === email.id ? null : email.id
                            )
                          }
                        >
                          {expandedEmail === email.id ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </div>
                    
                    {/* Provider Badge */}
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      email.provider === "google"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {email.provider?.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
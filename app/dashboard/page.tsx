/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEmails } from "@/components/EmailContext";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Brain, 
  Globe, 
  BarChart3,
  Mail,
  Filter,
  RefreshCw,
  Search,
  Activity,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardSidebar from "@/components/DashboardSidebar";

interface UrlSafetyResult {
  url: string;
  isSafe: boolean;
  threatType?: string;
  platformType?: string;
  cacheDuration?: string;
  lastChecked: Date;
}

interface Email {
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  body: string;
  isRead: boolean;
  isPotentialPhishing: boolean;
  phishingScore: number;
  phishingReasons: string[];
  
  // Enhanced analysis fields
  prediction?: string;
  confidence?: number;
  model_used?: string;
  virusTotalResult?: {
    malicious: number;
    total: number;
  };
  googleSafeBrowsingResult?: UrlSafetyResult[];
  heuristicScore?: number;
  mlScore?: number;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "overview";
  const { emails, setEmails, lastSync, setLastSync, addNewEmails } = useEmails();
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<'all' | 'safe' | 'phishing'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');
  const [showEmailList, setShowEmailList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper functions
  const sanitizeHTML = (html: string): string => {
    if (!html) return "";
    let sanitized = html;
    sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
    sanitized = sanitized.replace(/javascript:/gi, "");
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
    sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
    sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");
    sanitized = sanitized.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "");
    sanitized = sanitized.replace(/<meta[^>]*>/gi, "");
    sanitized = sanitized.replace(/<link[^>]*>/gi, "");
    sanitized = sanitized.replace(/<base[^>]*>/gi, "");
    return sanitized;
  };

  // Calculate statistics
  const stats = {
    total: emails.length,
    phishing: emails.filter(e => e.isPotentialPhishing).length,
    safe: emails.filter(e => !e.isPotentialPhishing).length,
    avgConfidence: emails.reduce((sum, e) => sum + (e.confidence || 0), 0) / emails.length || 0,
    highRisk: emails.filter(e => e.phishingScore > 0.8).length,
    withVirusTotal: emails.filter(e => e.virusTotalResult).length,
    withGoogleSafeBrowsing: emails.filter(e => (e as Email).googleSafeBrowsingResult && (e as Email).googleSafeBrowsingResult!.length > 0).length,
    unsafeUrls: emails.reduce((sum, e) => sum + ((e as Email).googleSafeBrowsingResult?.filter((url: UrlSafetyResult) => !url.isSafe).length || 0), 0),
    // ML Model statistics
    mlPredictions: {
      safe: emails.filter(e => e.prediction?.toLowerCase().includes('safe')).length,
      phishing: emails.filter(e => e.prediction?.toLowerCase().includes('phish')).length,
      highConfidence: emails.filter(e => (e.confidence || 0) > 0.9).length,
      avgConfidence: emails.filter(e => e.confidence).reduce((sum, e) => sum + (e.confidence || 0), 0) / emails.filter(e => e.confidence).length || 0
    }
  };

  // Filter and sort emails
  const filteredEmails = emails
    .filter(email => {
      // Filter by safety
      if (filter === 'phishing') {
        if (!email.isPotentialPhishing) return false;
      }
      if (filter === 'safe') {
        if (email.isPotentialPhishing) return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          email.subject.toLowerCase().includes(query) ||
          email.from.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'risk') return b.phishingScore - a.phishingScore;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const getRiskColor = (score: number) => {
    if (score >= 0.8) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 0.5) return "text-orange-600 bg-orange-50 border-orange-200";
    if (score >= 0.2) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getRiskIcon = (email: Email) => {
    if (email.isPotentialPhishing) {
      if (email.phishingScore > 0.8) return <XCircle className="w-5 h-5 text-red-500" />;
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const RiskGauge = ({ score }: { score: number }) => {
    const percentage = score * 100;
    const color = score > 0.8 ? "#ef4444" : score > 0.5 ? "#f97316" : score > 0.2 ? "#eab308" : "#22c55e";
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold leading-none" style={{ color }}>{percentage.toFixed(0)}%</span>
          <span className="text-[10px] uppercase font-bold text-gray-400 mt-1">Risk</span>
        </div>
      </div>
    );
  };

  const StatCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl" />
        <div className="space-y-2">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="h-5 w-8 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );

  const EmailListItemSkeleton = () => (
    <div className="p-4 border-b border-gray-50 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 w-3/4 bg-gray-50 rounded" />
        <div className="h-3 w-12 bg-gray-50 rounded" />
      </div>
      <div className="h-3 w-1/2 bg-gray-50 rounded mb-4" />
      <div className="flex justify-between">
        <div className="h-5 w-16 bg-gray-50 rounded-full" />
        <div className="h-3 w-10 bg-gray-50 rounded" />
      </div>
    </div>
  );

  const fetchEmails = async (isInitialLoad = false) => {
    if (status !== "authenticated") return;
    try {
      setLoading(true);
      const url =
        lastSync && !isInitialLoad
          ? `/api/emails/fetch?since=${lastSync.toISOString()}`
          : "/api/emails/fetch";
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (isInitialLoad || !lastSync) {
          setEmails(data.emails);
        } else {
          addNewEmails(data.emails);
        }
        setLastSync(new Date(data.lastSync));
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/save-user", { method: "POST" });
      if (emails.length === 0) fetchEmails(true);
      const intervalId = setInterval(() => fetchEmails(false), 5 * 60 * 1000);
      return () => clearInterval(intervalId);

    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p className="text-center mt-10">Checking authentication...</p>;


  // Once authenticated, show dashboard content
  const formatDate = (date: Date) => new Date(date).toLocaleString();

  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans selection:bg-blue-100">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {currentView === 'overview' ? `Hello, ${session?.user?.name?.split(' ')[0]} 👋` :
                     currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                  </h1>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Email Security Intelligence</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fetchEmails(false)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm group"
                  >
                    <RefreshCw className={`w-4 h-4 text-blue-600 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-semibold">{loading ? "Syncing..." : "Sync"}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const response = await fetch('/api/reanalyze-emails', { method: 'POST' });
                        const result = await response.json();
                        if (result.success) {
                          alert(`Re-analysis complete: ${result.updatedCount} emails updated`);
                          window.location.reload();
                        } else {
                          alert(`Re-analysis failed: ${result.error}`);
                        }
                      } catch (error) {
                        alert(`Re-analysis failed: ${error}`);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm group"
                  >
                    <Brain className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Re-analyze</span>
                  </motion.button>
                  {lastSync && (
                    <div className="hidden md:flex flex-col items-end text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      <span>Last sync</span>
                      <span className="text-gray-600 font-black">
                        {new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(lastSync))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Mobile View Switcher */}
          <div className="lg:hidden border-b border-gray-200/50 bg-white/50 backdrop-blur-md px-4 py-3 overflow-x-auto flex gap-2 no-scrollbar sticky top-[73px] z-20">
            {[
              { id: 'overview', label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
              { id: 'inbox', label: 'Inbox', icon: <Mail className="w-3.5 h-3.5" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: 'security', label: 'Security', icon: <Shield className="w-3.5 h-3.5" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => router.push(`/dashboard?view=${view.id}`)}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-4 py-2 rounded-xl transition-all ${
                  currentView === view.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {view.icon}
                {view.label}
              </button>
            ))}
          </div>
        <motion.div initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 flex-1"
        >
          {currentView === 'overview' && (
            <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {loading && emails.length === 0 ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Mail className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                    <p className="text-2xl font-black text-gray-900 leading-tight">{stats.total}</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Safe</p>
                    <p className="text-2xl font-black text-green-600 leading-tight">{stats.safe}</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className="p-3 bg-red-50 rounded-xl text-red-600"><AlertTriangle className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phishing</p>
                    <p className="text-2xl font-black text-red-600 leading-tight">{stats.phishing}</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Brain className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ML Prediction</p>
                    <p className="text-lg font-black text-purple-600 leading-tight">{stats.mlPredictions.safe}/{stats.mlPredictions.phishing}</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                  <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600"><Activity className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unsafe URLs</p>
                    <p className="text-2xl font-black text-yellow-600 leading-tight">{stats.unsafeUrls}</p>
                  </div>
                </motion.div>
              </>
            )}
          </div>

            </>
          )}

          {(currentView === 'overview' || currentView === 'inbox') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden flex justify-between items-center mb-4">
              <button
                onClick={() => setShowEmailList(!showEmailList)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {showEmailList ? 'Hide Email List' : 'Show Email List'}
              </button>
              {selectedEmail && (
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close Email
                </button>
              )}
            </div>

            {/* Email List */}
            <div className={`lg:col-span-1 ${showEmailList ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-gray-50 bg-white sticky top-0 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Inbox</h2>
                    <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded-lg text-gray-500 uppercase tracking-tight">
                      {filteredEmails.length} Messages
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search by sender or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500/50 transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <BarChart3 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-full pl-8 pr-2 py-1.5 bg-gray-50 border border-transparent rounded-lg text-xs font-semibold text-gray-600 appearance-none focus:outline-none hover:bg-gray-100 transition-colors"
                        >
                          <option value="date">Newest</option>
                          <option value="risk">High Risk</option>
                        </select>
                      </div>
                      <div className="relative flex-1">
                        <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value as any)}
                          className="w-full pl-8 pr-2 py-1.5 bg-gray-50 border border-transparent rounded-lg text-xs font-semibold text-gray-600 appearance-none focus:outline-none hover:bg-gray-100 transition-colors"
                        >
                          <option value="all">All</option>
                          <option value="safe">Safe</option>
                          <option value="phishing">Phishing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ML Model Summary */}
                  {stats.mlPredictions.avgConfidence > 0 && (
                    <div className="bg-purple-50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                        <span className="text-xs sm:text-sm font-medium text-purple-900">ML Model Summary</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-purple-700">Avg Confidence:</span>
                          <span className="font-medium text-purple-900">
                            {(stats.mlPredictions.avgConfidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">High Confidence:</span>
                          <span className="font-medium text-purple-900">
                            {stats.mlPredictions.highConfidence}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                  {filteredEmails.length === 0 ? (
                    <div className="p-8 text-center h-full flex flex-col items-center justify-center">
                      {loading ? (
                        <div className="w-full space-y-1">
                          <EmailListItemSkeleton />
                          <EmailListItemSkeleton />
                          <EmailListItemSkeleton />
                          <EmailListItemSkeleton />
                        </div>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Mail className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No messages found</p>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100/50">
                      <AnimatePresence mode="popLayout">
                        {filteredEmails.map((email) => (
                          <motion.div
                            key={email.messageId}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            onClick={() => {
                              setSelectedEmail(email);
                              if (window.innerWidth < 1024) setShowEmailList(false);
                            }}
                            className={`p-4 cursor-pointer transition-all relative group ${
                              selectedEmail?.messageId === email.messageId
                                ? "bg-white shadow-inner"
                                : "hover:bg-white"
                            }`}
                          >
                            {selectedEmail?.messageId === email.messageId && (
                              <motion.div
                                layoutId="active-pill"
                                className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                              />
                            )}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {getRiskIcon(email)}
                              <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                {email.subject}
                              </h3>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2 flex-shrink-0">
                              {new Date(email.date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-xs sm:text-sm text-gray-600 truncate mb-2">
                            {email.from}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(email.phishingScore)}`}>
                              {email.isPotentialPhishing ? "High Risk" : "Safe"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(email.phishingScore * 100).toFixed(0)}% risk
                            </div>
                          </div>

                          {/* ML Preview */}
                          {email.prediction && (
                            <div className="mt-3 flex items-center justify-between bg-purple-50/50 p-1.5 rounded-lg border border-purple-100/50">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Brain className="w-3 h-3 text-purple-500" />
                                <span className="text-[10px] font-bold text-purple-700 truncate uppercase tracking-tighter">{email.prediction}</span>
                              </div>
                              {email.confidence && (
                                <span className="text-[9px] font-black text-purple-400 bg-white px-1 rounded-md border border-purple-50">
                                  {(email.confidence * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                      </AnimatePresence>
                    </div>
            )}
                </div>
              </div>
          </div>

            {/* Email Content */}
            <div className={`lg:col-span-2 ${!showEmailList ? 'col-span-1' : ''}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                  {selectedEmail ? (
                    <motion.div
                      key={selectedEmail.messageId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 overflow-y-auto"
                    >
                    <div className="p-6">
                    {/* Email Header */}
                    <div className="border-b border-gray-100 pb-6 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-2">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                          {selectedEmail.subject}
                        </h2>
                        <div className="flex items-center gap-2">
                          {getRiskIcon(selectedEmail)}
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getRiskColor(selectedEmail.phishingScore)}`}>
                            {selectedEmail.isPotentialPhishing ? "High Risk" : "Safe"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs sm:text-sm">From:</span>
                          <p className="font-medium text-sm sm:text-base">{selectedEmail.from}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs sm:text-sm">Date:</span>
                          <p className="font-medium text-sm sm:text-base">{formatDate(selectedEmail.date)}</p>
                        </div>
                      </div>
                  </div>

                    {/* Comprehensive Analysis Section */}
                    <div className="mb-8">
                      <div className="flex flex-col md:flex-row gap-8 items-center bg-blue-50/30 p-6 rounded-3xl border border-blue-100/50 mb-8">
                        <RiskGauge score={selectedEmail.phishingScore} />
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Security Analysis</h3>
                          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                            Our AI models have analyzed this email for phishing attempts, malicious links, and suspicious metadata.
                          </p>
                          <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRiskColor(selectedEmail.phishingScore)}`}>
                              {selectedEmail.isPotentialPhishing ? 'Threat Detected' : 'Safe Content'}
                            </span>
                            {selectedEmail.confidence && (
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-100 text-purple-700 border border-purple-200">
                                AI Confidence: {(selectedEmail.confidence * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Analysis Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        {/* ML Model Assessment */}
                        {selectedEmail.confidence && (
                          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                              <h4 className="font-semibold text-purple-900 text-sm sm:text-base">ML Model Assessment</h4>
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-purple-700">Prediction:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  selectedEmail.prediction?.toLowerCase().includes('safe') 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {selectedEmail.prediction || "Unknown"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-purple-700">Confidence:</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-12 sm:w-16 bg-purple-200 rounded-full h-2">
                                    <div 
                                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${(selectedEmail.confidence * 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-medium text-purple-900 text-xs sm:text-sm">
                                    {(selectedEmail.confidence * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              {selectedEmail.model_used && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs sm:text-sm text-purple-700">Model Used:</span>
                                  <span className="font-medium text-purple-900 text-xs sm:text-sm">
                                    {selectedEmail.model_used}
                                  </span>
                                </div>
                              )}
                              <div className="pt-2 border-t border-purple-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-purple-600">Reliability:</span>
                                  <span className={`text-xs font-medium ${
                                    selectedEmail.confidence > 0.9 ? 'text-green-600' :
                                    selectedEmail.confidence > 0.7 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {selectedEmail.confidence > 0.9 ? 'Very High' :
                                     selectedEmail.confidence > 0.7 ? 'High' : 'Medium'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Heuristic Analysis */}
                        {selectedEmail.heuristicScore !== undefined && (
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                              <h4 className="font-semibold text-blue-900 text-sm sm:text-base">Heuristic Analysis</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-blue-700">Score:</span>
                                <span className="font-medium text-blue-900 text-xs sm:text-sm">
                                  {(selectedEmail.heuristicScore * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-blue-700">Risk Level:</span>
                                <span className="font-medium text-blue-900 text-xs sm:text-sm">
                                  {selectedEmail.heuristicScore > 0.6 ? "High" : selectedEmail.heuristicScore > 0.3 ? "Medium" : "Low"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VirusTotal Assessment */}
                        {selectedEmail.virusTotalResult && (
                          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 border border-orange-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                              <h4 className="font-semibold text-orange-900 text-sm sm:text-base">VirusTotal Scan</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-orange-700">Malicious URLs:</span>
                                <span className="font-medium text-orange-900 text-xs sm:text-sm">
                                  {selectedEmail.virusTotalResult.malicious}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-orange-700">Total Scanned:</span>
                                <span className="font-medium text-orange-900 text-xs sm:text-sm">
                                  {selectedEmail.virusTotalResult.total}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-orange-700">Status:</span>
                                <span className={`font-medium text-xs sm:text-sm ${selectedEmail.virusTotalResult.malicious > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {selectedEmail.virusTotalResult.malicious > 0 ? "Threats Found" : "Clean"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Google Safe Browsing Assessment */}
                        {selectedEmail.googleSafeBrowsingResult && selectedEmail.googleSafeBrowsingResult.length > 0 && (
                          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 sm:p-4 border border-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                              <h4 className="font-semibold text-yellow-900 text-sm sm:text-base">Google Safe Browsing</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-yellow-700">URLs Checked:</span>
                                <span className="font-medium text-yellow-900 text-xs sm:text-sm">
                                  {selectedEmail.googleSafeBrowsingResult.length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-yellow-700">Unsafe URLs:</span>
                                <span className="font-medium text-yellow-900 text-xs sm:text-sm">
                                  {selectedEmail.googleSafeBrowsingResult.filter(url => !url.isSafe).length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs sm:text-sm text-yellow-700">Status:</span>
                                <span className={`font-medium text-xs sm:text-sm ${
                                  selectedEmail.googleSafeBrowsingResult.some(url => !url.isSafe) ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {selectedEmail.googleSafeBrowsingResult.some(url => !url.isSafe) ? "Threats Found" : "All Safe"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Overall Assessment */}
                        <div className={`rounded-lg p-3 sm:p-4 border ${
                          selectedEmail.isPotentialPhishing 
                            ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' 
                            : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedEmail.isPotentialPhishing ? 'text-red-600' : 'text-green-600'}`} />
                            <h4 className={`font-semibold text-sm sm:text-base ${selectedEmail.isPotentialPhishing ? 'text-red-900' : 'text-green-900'}`}>
                              Overall Assessment
                            </h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className={`text-xs sm:text-sm ${selectedEmail.isPotentialPhishing ? 'text-red-700' : 'text-green-700'}`}>
                                Risk Level:
                              </span>
                              <span className={`font-medium text-xs sm:text-sm ${selectedEmail.isPotentialPhishing ? 'text-red-900' : 'text-green-900'}`}>
                                {selectedEmail.isPotentialPhishing ? "HIGH RISK" : "LOW RISK"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`text-xs sm:text-sm ${selectedEmail.isPotentialPhishing ? 'text-red-700' : 'text-green-700'}`}>
                                Phishing Score:
                              </span>
                              <span className={`font-medium text-xs sm:text-sm ${selectedEmail.isPotentialPhishing ? 'text-red-900' : 'text-green-900'}`}>
                                {(selectedEmail.phishingScore * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Reasons */}
                      {selectedEmail.isPotentialPhishing && selectedEmail.phishingReasons?.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                          <h4 className="font-semibold text-red-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                            Suspicious Elements Detected
                          </h4>
                          <ul className="space-y-2">
                            {selectedEmail.phishingReasons.map((reason, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-red-800">
                                <span className="w-2 h-2 bg-red-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* URL Safety Analysis */}
                      {selectedEmail.googleSafeBrowsingResult && selectedEmail.googleSafeBrowsingResult.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                          <h4 className="font-semibold text-yellow-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                            URL Safety Analysis
                          </h4>
                          <div className="space-y-3">
                            {selectedEmail.googleSafeBrowsingResult.map((urlResult, index) => (
                              <div key={index} className={`p-2 sm:p-3 rounded-lg border ${
                                urlResult.isSafe 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-red-50 border-red-200'
                              }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {urlResult.isSafe ? (
                                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                                    ) : (
                                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                                    )}
                                    <span className={`text-xs sm:text-sm font-medium ${
                                      urlResult.isSafe ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                      {urlResult.isSafe ? 'Safe URL' : 'Unsafe URL'}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {new Date(urlResult.lastChecked).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-700 break-all mb-2">
                                  {urlResult.url}
                                </div>
                                {!urlResult.isSafe && (
                                  <div className="space-y-1">
                                    {urlResult.threatType && (
                                      <div className="flex justify-between text-xs">
                                        <span className="text-red-600">Threat Type:</span>
                                        <span className="text-red-800 font-medium">{urlResult.threatType}</span>
                                      </div>
                                    )}
                                    {urlResult.platformType && (
                                      <div className="flex justify-between text-xs">
                                        <span className="text-red-600">Platform:</span>
                                        <span className="text-red-800 font-medium">{urlResult.platformType}</span>
                                      </div>
                                    )}
                                    {urlResult.cacheDuration && (
                                      <div className="flex justify-between text-xs">
                                        <span className="text-red-600">Cache Duration:</span>
                                        <span className="text-red-800 font-medium">{urlResult.cacheDuration}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                </div>

                    {/* Email Content */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Email Content</h3>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border">
                        {selectedEmail.body ? (
                          <div
                            className="prose max-w-none text-xs sm:text-sm"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHTML(selectedEmail.body),
                            }}
                          />
                        ) : (
                          <p className="text-gray-500 italic text-sm">No content available</p>
                        )}
                      </div>
                    </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                      <Mail className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select an email</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                      Choose any email from your inbox to see a complete AI security breakdown and content preview.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

          {(currentView !== 'overview' && currentView !== 'inbox') && (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Activity className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Coming Soon</h3>
              <p className="text-gray-500 text-sm">The {currentView} view is under development.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
    );
  }

  return null;
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

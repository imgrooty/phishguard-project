"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEmails } from "@/components/EmailContext";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Brain, 
  Globe, 
  BarChart3,
  Clock,
  Mail,
  Filter,
  RefreshCw
} from "lucide-react";

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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { emails, setEmails, lastSync, setLastSync, addNewEmails } = useEmails();
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<'all' | 'safe' | 'phishing'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');
  const [showEmailList, setShowEmailList] = useState(true);

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
      if (filter === 'phishing') return email.isPotentialPhishing;
      if (filter === 'safe') return !email.isPotentialPhishing;
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

  const formatDate = (date: Date) => new Date(date).toLocaleString();

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {session.user?.name} 👋
          </h1>
                <p className="text-gray-600 mt-1">Email Security Dashboard</p>
              </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchEmails(false)}
              disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? "Syncing..." : "Sync Emails"}
                </button>
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const response = await fetch('/api/reanalyze-emails', { method: 'POST' });
                      const result = await response.json();
                      if (result.success) {
                        alert(`Re-analysis complete: ${result.updatedCount} emails updated`);
                        // Refresh the page to show updated data
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
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                >
                  <Brain className="w-4 h-4" />
                  Re-analyze ML
            </button>
            {lastSync && (
                  <div className="text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Last sync: {formatDate(lastSync)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg mb-2 sm:mb-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <div className="sm:ml-3 lg:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Emails</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg mb-2 sm:mb-0">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
                <div className="sm:ml-3 lg:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Safe Emails</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.safe}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="p-2 sm:p-3 bg-red-100 rounded-lg mb-2 sm:mb-0">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
                </div>
                <div className="sm:ml-3 lg:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Phishing</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{stats.phishing}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg mb-2 sm:mb-0">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
                <div className="sm:ml-3 lg:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">ML Predictions</p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-purple-600">
                    {stats.mlPredictions.safe}/{stats.mlPredictions.phishing}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg mb-2 sm:mb-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
                </div>
                <div className="sm:ml-3 lg:ml-4 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Unsafe URLs</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{stats.unsafeUrls}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
                <div className="p-3 sm:p-4 lg:p-6 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Email Inbox</h2>
                    <div className="flex items-center gap-2">
                      <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="text-xs sm:text-sm border rounded-lg px-2 sm:px-3 py-1"
                      >
                        <option value="all">All</option>
                        <option value="safe">Safe</option>
                        <option value="phishing">Phishing</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs sm:text-sm border rounded-lg px-2 sm:px-3 py-1"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="risk">Sort by Risk</option>
                    </select>
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

                <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
                  {filteredEmails.length === 0 ? (
                    <div className="p-4 sm:p-6 text-center">
                      <Mail className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-4" />
                      <p className="text-sm sm:text-base text-gray-500">
                        {loading ? "Loading emails..." : "No emails found"}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredEmails.map((email) => (
                        <div
                          key={email.messageId}
                          onClick={() => {
                            setSelectedEmail(email);
                            // On mobile, hide the email list when an email is selected
                            if (window.innerWidth < 1024) {
                              setShowEmailList(false);
                            }
                          }}
                          className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 ${
                            selectedEmail?.messageId === email.messageId
                              ? "bg-blue-50 border-r-2 sm:border-r-4 border-blue-500"
                              : ""
                          }`}
                        >
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

                          {/* ML Model Prediction Display */}
                          {email.prediction && (
                            <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1">
                                  <Brain className="w-3 h-3 text-purple-600" />
                                  <span className="text-purple-700 font-medium">ML:</span>
                                </div>
                                <span className="text-purple-900 font-semibold truncate ml-2">
                                  {email.prediction}
                                </span>
                              </div>
                              {email.confidence && (
                                <div className="flex items-center justify-between text-xs mt-1">
                                  <span className="text-purple-600">Confidence:</span>
                                  <span className="text-purple-800 font-medium">
                                    {(email.confidence * 100).toFixed(1)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
            )}
                </div>
              </div>
          </div>

            {/* Email Content */}
            <div className={`lg:col-span-2 ${!showEmailList ? 'col-span-1' : ''}`}>
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border h-[400px] sm:h-[500px] lg:h-[600px] overflow-y-auto">
            {selectedEmail ? (
                  <div className="p-3 sm:p-4 lg:p-6">
                    {/* Email Header */}
                    <div className="border-b pb-4 sm:pb-6 mb-4 sm:mb-6">
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
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                        Security Analysis
                      </h3>

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
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                      <p className="text-gray-500 text-sm sm:text-lg">Select an email to view analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

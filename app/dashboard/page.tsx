"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEmails } from "@/components/EmailContext";

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
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { emails, setEmails, lastSync, setLastSync, addNewEmails } = useEmails();
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Sanitize HTML content to prevent XSS attacks and style pollution
  const sanitizeHTML = (html: string): string => {
    if (!html) return '';
    
    let sanitized = html;
    
    // Remove style tags and their content (IMPORTANT: prevents CSS pollution)
    sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Remove script tags and their content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers (onclick, onerror, onload, etc.)
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    
    // Remove javascript: protocol from href and src
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    // Remove iframe tags
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    // Remove object and embed tags
    sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
    
    // Remove form tags (to prevent form hijacking)
    sanitized = sanitized.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
    
    // Remove meta tags that could redirect
    sanitized = sanitized.replace(/<meta[^>]*>/gi, '');
    
    // Remove link tags to prevent external stylesheet injection
    sanitized = sanitized.replace(/<link[^>]*>/gi, '');
    
    // Remove base tags that could hijack relative URLs
    sanitized = sanitized.replace(/<base[^>]*>/gi, '');
    
    return sanitized;
  };

  // Fetch emails function - now only fetches new emails
  const fetchEmails = async (isInitialLoad = false) => {
    if (status !== "authenticated") return;
    
    try {
      setLoading(true);
      
      // Pass lastSync to API to only fetch new emails
      const url = lastSync && !isInitialLoad
        ? `/api/emails/fetch?since=${lastSync.toISOString()}`
        : '/api/emails/fetch';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        if (isInitialLoad || !lastSync) {
          // First load: set all emails
          setEmails(data.emails);
        } else {
          // Subsequent loads: add only new emails
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
      // Save user info to your database only when logged in
      fetch("/api/save-user", { method: "POST" });
      
      // Only fetch if we don't have emails cached
      if (emails.length === 0) {
        fetchEmails(true);
      }
      
      // Set up interval to refresh emails every 5 minutes
      const intervalId = setInterval(() => fetchEmails(false), 5 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    } else if (status === "unauthenticated") {
      // Redirect to custom login page
      router.push("/login");
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  // Once authenticated, show dashboard content
  if (status === "authenticated") {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {session.user?.name} 👋</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchEmails(false)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Checking for new emails..." : "Check New Emails"}
            </button>
            {lastSync && (
              <p className="text-sm text-gray-500">
                Last synced: {formatDate(lastSync)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email List */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4 h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Your Emails ({emails.length})</h2>
            
            {emails.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {loading ? "Loading emails..." : "No emails found"}
              </p>
            ) : (
              <ul className="space-y-2">
                {emails.map((email) => (
                  <li 
                    key={email.messageId}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-3 rounded-md cursor-pointer ${
                      selectedEmail?.messageId === email.messageId
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    } ${
                      email.isPotentialPhishing ? "border-l-4 border-red-500" : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium truncate">{email.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(email.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{email.from}</p>
                    {email.isPotentialPhishing && (
                      <div className="mt-1 flex items-center">
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          Potential Phishing
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Email Content */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4 h-[calc(100vh-200px)] overflow-y-auto">
            {selectedEmail ? (
              <div>
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm">
                      <span className="text-gray-500">From:</span> {selectedEmail.from}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedEmail.date)}
                    </p>
                  </div>
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">To:</span> {selectedEmail.to}
                  </p>
                  
                  {selectedEmail.isPotentialPhishing && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700 font-medium">⚠️ Potential Phishing Detected</p>
                      <p className="text-sm text-red-600 mt-1">
                        Risk Score: {selectedEmail.phishingScore}/6
                      </p>
                      {selectedEmail.phishingReasons.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-red-600">Suspicious elements:</p>
                          <ul className="list-disc list-inside text-sm text-red-600 ml-2">
                            {selectedEmail.phishingReasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="email-body">
                  {selectedEmail.body ? (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: sanitizeHTML(selectedEmail.body) 
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">No content</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Select an email to view its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
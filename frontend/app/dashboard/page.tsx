"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"

const DashboardPage: React.FC = () => {
  const [emailContent, setEmailContent] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEmail = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate API call for email analysis
      setTimeout(() => {
        const isPhishing = Math.random() > 0.5;
        setAnalysisResult({
          isPhishing,
          confidence: (Math.random() * 100).toFixed(2),
          threats: isPhishing ? [
            "Suspicious sender domain",
            "Urgent action language detected",
            "Contains suspicious links"
          ] : ["No significant threats detected"],
          recommendations: isPhishing ? [
            "Do not click any links",
            "Verify sender identity",
            "Report to your IT department"
          ] : ["Email appears safe to interact with"]
        });
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setEmailContent("");
    setAnalysisResult(null);
  };



  //backend
  //
  //
  //
   useEffect(() => {
    const sendEmail = async () => {
      // Get current Supabase session
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        console.log("No session, user not logged in")
        return
      }

      const accessToken = session.access_token

      // Call your FastAPI backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: session.user.id,
          subject: "Hello",
          body: "This is a test email",
        }),
      })

      const data = await res.json()
      console.log("Response from backend:", data)
    }

    sendEmail()
  }, [])

//
//
//
//
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Phishing Email Detection</h1>
          <p className="text-gray-600">Analyze suspicious emails for phishing attempts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analyze Email</h2>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste the suspicious email content here..."
              className="w-full h-64 border border-gray-300 rounded-md p-4 resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={isAnalyzing}
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={analyzeEmail}
                disabled={!emailContent.trim() || isAnalyzing}
                className="flex-1 bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Email"}
              </button>
              <button
                onClick={clearAnalysis}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
            
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                {/* Result Card */}
                <div className={`p-4 rounded-lg ${
                  analysisResult.isPhishing 
                    ? "bg-red-100 border-l-4 border-red-500" 
                    : "bg-green-100 border-l-4 border-green-500"
                }`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      analysisResult.isPhishing ? "bg-red-500" : "bg-green-500"
                    }`}>
                      {analysisResult.isPhishing ? (
                        <span className="text-white text-lg">⚠️</span>
                      ) : (
                        <span className="text-white text-lg">✓</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`font-semibold ${
                        analysisResult.isPhishing ? "text-red-800" : "text-green-800"
                      }`}>
                        {analysisResult.isPhishing ? "Phishing Detected" : "Safe Email"}
                      </h3>
                      <p className={`text-sm ${
                        analysisResult.isPhishing ? "text-red-600" : "text-green-600"
                      }`}>
                        Confidence: {analysisResult.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Threats */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Detected Threats:</h4>
                  <ul className="space-y-1">
                    {analysisResult.threats.map((threat: string, index: number) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <p>Enter email content to begin analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">98%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">1.2M+</div>
            <div className="text-gray-600">Emails Analyzed</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

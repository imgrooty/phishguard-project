import https from "https";
import { config } from "./config";

// Global HTTPS agent for better performance
const agent = new https.Agent({ 
  keepAlive: true,
  maxSockets: 10,
  timeout: config.REQUEST_TIMEOUT
});

// Override global fetch with our agent
globalThis.fetch = ((origFetch) => (url: any, options: any = {}) =>
  origFetch(url, { ...options, agent }))(fetch);

export interface TokenRefreshResult {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export interface UrlSafetyResult {
  url: string;
  isSafe: boolean;
  threatType?: string;
  platformType?: string;
  cacheDuration?: string;
  lastChecked: Date;
}

export interface EmailAnalysisResult {
  isPotentialPhishing: boolean;
  phishingScore: number;
  phishingReasons: string[];
  confidence: number;
  modelUsed: string;
  virusTotalResult?: any;
  googleSafeBrowsingResult?: UrlSafetyResult[];
  heuristicScore: number;
  mlScore: number;
  mlPrediction: string;
}

export class EmailService {
  private static instance: EmailService;
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Google OAuth token refresh
  async refreshGoogleToken(refreshToken: string): Promise<TokenRefreshResult | null> {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: config.GOOGLE_ID,
          client_secret: config.GOOGLE_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
        signal: AbortSignal.timeout(config.TOKEN_REFRESH_TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_token: data.refresh_token || refreshToken
      };
    } catch (error) {
      console.error("❌ Google token refresh error:", error);
      return null;
    }
  }

  // Microsoft OAuth token refresh
  async refreshMicrosoftToken(refreshToken: string): Promise<TokenRefreshResult | null> {
    try {
      const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: config.AZURE_AD_CLIENT_ID,
          client_secret: config.AZURE_AD_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
          scope: "openid profile email offline_access Mail.Read",
        }),
        signal: AbortSignal.timeout(config.TOKEN_REFRESH_TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_token: data.refresh_token || refreshToken
      };
    } catch (error) {
      console.error("❌ Microsoft token refresh error:", error);
      return null;
    }
  }

  // Validate token with provider
  async validateToken(accessToken: string, provider: 'google' | 'microsoft'): Promise<boolean> {
    try {
      const url = provider === 'google' 
        ? "https://gmail.googleapis.com/gmail/v1/users/me/profile"
        : "https://graph.microsoft.com/v1.0/me";
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(5000)
      });
      
      return response.ok;
    } catch (error) {
      console.error(`❌ Token validation error for ${provider}:`, error);
      return false;
    }
  }

  // Enhanced phishing analysis with multiple sources
  async analyzePhishing(email: {
    from: string;
    subject: string;
    body: string;
    links?: string[];
  }): Promise<EmailAnalysisResult> {

    const reasons: string[] = [];
    let heuristicScore = 0;
    let mlScore = 0;
    let confidence = 0;
    let modelUsed = "heuristic";

    // 1. Heuristic Analysis
    const heuristicResult = this.performHeuristicAnalysis(email);
    heuristicScore = heuristicResult.score;
    reasons.push(...heuristicResult.reasons);

    // 2. ML Model Analysis
    let mlResult;
    try {
      mlResult = await this.performMLAnalysis(email.body);
      if (mlResult) {
        mlScore = mlResult.confidence;
        modelUsed = mlResult.model_used;
        confidence = mlResult.confidence;
        
        if (mlResult.prediction.toLowerCase().includes('phish') || 
            mlResult.prediction.toLowerCase().includes('malicious')) {
          reasons.push(`ML model flagged as ${mlResult.prediction} (confidence: ${(mlResult.confidence * 100).toFixed(1)}%)`);
        }
      }
    } catch (error) {
      console.warn("⚠️ ML analysis failed:", error);
      reasons.push("ML analysis unavailable");
    }

    // 3. VirusTotal Analysis (for URLs)
    let virusTotalResult;
    if (email.links && email.links.length > 0) {
      try {
        virusTotalResult = await this.performVirusTotalAnalysis(email.links);
        if (virusTotalResult && virusTotalResult.malicious > 0) {
          reasons.push(`VirusTotal detected ${virusTotalResult.malicious} malicious URLs`);
        }
      } catch (error) {
        console.warn("⚠️ VirusTotal analysis failed:", error);
      }
    }

    // 4. Google Safe Browsing Analysis (for URLs)
    let googleSafeBrowsingResult: UrlSafetyResult[] = [];
    if (email.links && email.links.length > 0) {
      try {
        googleSafeBrowsingResult = await this.performGoogleSafeBrowsingAnalysis(email.links);
        const unsafeUrls = googleSafeBrowsingResult.filter(result => !result.isSafe);
        if (unsafeUrls.length > 0) {
          const threatTypes = [...new Set(unsafeUrls.map(u => u.threatType))].join(', ');
          reasons.push(`Google Safe Browsing detected ${unsafeUrls.length} unsafe URL(s): ${threatTypes}`);
        }
      } catch (error) {
        console.warn("⚠️ Google Safe Browsing analysis failed:", error);
      }
    }

    // Calculate final score (weighted combination)
    const unsafeUrlCount = googleSafeBrowsingResult.filter(r => !r.isSafe).length;
    const finalScore = (heuristicScore * 0.3) + (mlScore * 0.4) + (virusTotalResult?.malicious || 0) * 0.1 + (unsafeUrlCount * 0.2);
    const isPotentialPhishing = finalScore >= config.PHISHING_THRESHOLD;

    return {
      isPotentialPhishing,
      phishingScore: Math.min(finalScore, 1.0),
      phishingReasons: reasons,
      confidence,
      modelUsed,
      virusTotalResult,
      googleSafeBrowsingResult,
      heuristicScore,
      mlScore,
      mlPrediction: mlResult?.prediction || "Unknown"
    };
  }

  private performHeuristicAnalysis(email: { from: string; subject: string; body: string }): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;

    const from = email.from.toLowerCase();
    const subject = email.subject.toLowerCase();
    const body = email.body.toLowerCase();

    // Sender analysis
    if (from.includes("noreply") || from.includes("no-reply")) {
      reasons.push("Sender uses 'noreply' address");
      score += 0.2;
    }

    // Domain analysis
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co'];
    if (suspiciousDomains.some(domain => from.includes(domain))) {
      reasons.push("Sender uses URL shortener domain");
      score += 0.3;
    }

    // Urgency keywords
    const urgentKeywords = [
      'urgent', 'immediate', 'action required', 'verify', 'suspend', 
      'expire', 'password', 'login', 'security', 'account', 'confirm'
    ];
    const urgentCount = urgentKeywords.filter(keyword => 
      subject.includes(keyword) || body.includes(keyword)
    ).length;
    
    if (urgentCount > 0) {
      reasons.push(`Contains ${urgentCount} urgency/sensitive keywords`);
      score += urgentCount * 0.1;
    }

    // Link analysis
    const linkCount = (email.body.match(/https?:\/\/[^\s/$.?#].[^\s]*/gi) || []).length;
    if (linkCount > 5) {
      reasons.push("Contains many external links");
      score += 0.3;
    } else if (linkCount > 0) {
      reasons.push(`Contains ${linkCount} external link(s)`);
      score += linkCount * 0.05;
    }

    // Grammar and spelling
    const grammarIssues = this.detectGrammarIssues(email.body);
    if (grammarIssues > 0) {
      reasons.push(`Poor grammar/spelling detected (${grammarIssues} issues)`);
      score += grammarIssues * 0.05;
    }

    return { score: Math.min(score, 1.0), reasons };
  }

  private async performMLAnalysis(text: string): Promise<any> {
    const apiUrl = config.PHISHING_API_URL;
    const apiKey = config.PHISHING_API_KEY;
    const hfToken = config.HF_API_TOKEN;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (hfToken) {
        headers["Authorization"] = `Bearer ${hfToken}`;
      } else if (apiKey) {
        headers["x_api_key"] = apiKey;
      }

      const requestBody = {
        text,
        model: "emb",
        use_threshold: true,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(config.ML_TIMEOUT || config.REQUEST_TIMEOUT)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ML API error response:", errorText);
        throw new Error(`ML API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("❌ ML analysis error:", error);
      return null;
    }
  }

  private async performVirusTotalAnalysis(urls: string[]): Promise<any> {
    const apiKey = config.VIRUSTOTAL_API_KEY;
    if (!apiKey) return null;

    try {
      const results = await Promise.all(
        urls.slice(0, 4).map(async (url) => { // Limit to 4 URLs per request
          const response = await fetch(`${process.env.VIRUSTOTAL_API_URL}/urls`, {
            method: "POST",
            headers: {
              "X-Apikey": apiKey,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ url }),
            signal: AbortSignal.timeout(config.REQUEST_TIMEOUT)
          });

          if (!response.ok) return null;
          return await response.json();
        })
      );

      const validResults = results.filter(r => r !== null);
      const malicious = validResults.reduce((sum, result) => 
        sum + (result.data?.attributes?.last_analysis_stats?.malicious || 0), 0
      );

      return { malicious, total: validResults.length };
    } catch (error) {
      console.error("VirusTotal analysis error:", error);
      return null;
    }
  }

  private async performGoogleSafeBrowsingAnalysis(urls: string[]): Promise<UrlSafetyResult[]> {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Google Safe Browsing API key not configured");
      return [];
    }

    try {
      // Limit to 10 URLs per request (Google's limit)
      const urlsToCheck = urls.slice(0, 10);
      
      const requestBody = {
        client: {
          clientId: "phishguard-app",
          clientVersion: "1.0"
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: urlsToCheck.map(url => ({ url }))
        }
      };

      const response = await fetch(`${config.GOOGLE_SAFE_BROWSING_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(config.REQUEST_TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`Google Safe Browsing API error: ${response.status}`);
      }

      const result = await response.json();
      const matches = result.matches || [];

      // Create results for all checked URLs
      const results: UrlSafetyResult[] = urlsToCheck.map(url => {
        const match = matches.find((m: any) => m.threat?.url === url);
        return {
          url,
          isSafe: !match,
          threatType: match?.threatType,
          platformType: match?.platformType,
          cacheDuration: match?.cacheDuration,
          lastChecked: new Date()
        };
      });

      return results;
    } catch (error) {
      console.error("❌ Google Safe Browsing analysis error:", error);
      return [];
    }
  }

  private detectGrammarIssues(text: string): number {
    const commonIssues = [
      /\b(ur|u)\b/g, // "ur" instead of "your"
      /\b(plz|pls)\b/g, // "plz" instead of "please"
      /\b(2day|2morrow)\b/g, // "2day" instead of "today"
      /\b(freind|freinds)\b/g, // misspelled "friend"
      /\b(recieve|recieved)\b/g, // misspelled "receive"
    ];

    return commonIssues.reduce((count, pattern) => {
      const matches = text.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
  }
}

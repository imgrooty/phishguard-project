export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { EmailService } from "@/lib/emailService";

/* =========================
   🔹 Gmail Fetch Helpers
   ========================= */
async function fetchEmailDetails(messageId: string, accessToken: string) {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;

  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { 
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) throw new Error(`Gmail fetch error ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn(`⚠️ Gmail fetch attempt ${i + 1} failed:`, err.message);
      if (i === 2) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

function parseEmailBody(payload: any): string {
  if (payload.body?.data) return Buffer.from(payload.body.data, "base64").toString("utf-8");
  if (payload.parts)
    for (const part of payload.parts) {
      const text = parseEmailBody(part);
      if (text) return text;
    }
  return "";
}

function getHeader(headers: any[], name: string): string {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";
}

function extractLinks(text: string): string[] {
  const linkRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  return text.match(linkRegex) || [];
}

/* =========================
   🔹 Enhanced Email Processing
   ========================= */
  
 

/* =========================
   🔹 GET Handler (Main)
   ========================= */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await dbConnect();
  const emailService = EmailService.getInstance();
  
  let accessToken = (session as any).access_token;
  const refreshToken = (session as any).refresh_token;

  try {
    // Validate and refresh token if needed
    const isValid = await emailService.validateToken(accessToken, 'google');
    if (!isValid && refreshToken) {
      console.log("🔄 Refreshing expired token...");
      const refreshed = await emailService.refreshGoogleToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.access_token;
        // Update session with new token
        (session as any).access_token = accessToken;
      }
    }

    // Gmail Query
    const { searchParams } = new URL(req.url);
    const sinceParam = searchParams.get("since");
    const query = sinceParam
      ? `in:inbox after:${Math.floor(new Date(sinceParam).getTime() / 1000)}`
      : "in:inbox";

    // Fetch message list with timeout
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=50`,
      { 
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(15000)
      }
    );

    if (!listRes.ok) throw new Error(`Gmail list fetch failed: ${listRes.status}`);
    const { messages = [] } = await listRes.json();

    // Fetch full emails in optimized batches
    const BATCH_SIZE = 3; // From config
    const fullEmails: any[] = [];
    
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((msg: any) => fetchEmailDetails(msg.id, accessToken))
      );
      
      const successful = results
        .filter((r) => r.status === "fulfilled")
        .map((r: any) => r.value);
      
      fullEmails.push(...successful);
      
      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < messages.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Parse and analyze emails with enhanced detection
    const formattedEmails = await Promise.all(
      fullEmails.map(async (email: any) => {
        const headers = email.payload.headers;
        const body = parseEmailBody(email.payload);
        const links = extractLinks(body);
        
        const emailData = {
          messageId: email.id,
          subject: getHeader(headers, "Subject"),
          from: getHeader(headers, "From"),
          to: getHeader(headers, "To"),
          date: new Date(parseInt(email.internalDate)),
          body,
          isRead: !email.labelIds?.includes("UNREAD"),
        };

        // Enhanced phishing analysis
        const analysis = await emailService.analyzePhishing({
          from: emailData.from,
          subject: emailData.subject,
          body: emailData.body,
          links
        });

        return {
          ...emailData,
          ...analysis,
          // Additional fields for dashboard - preserve ML model prediction
          prediction: analysis.mlPrediction || (analysis.isPotentialPhishing ? "Potential Phishing" : "Safe Email"),
          confidence: analysis.confidence,
          model_used: analysis.modelUsed,
          virusTotalResult: analysis.virusTotalResult,
          googleSafeBrowsingResult: analysis.googleSafeBrowsingResult
        };
      })
    );

    // Save to database
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      const existingIds = new Set(user.emails.map((e: any) => e.messageId));
      const newEmails = formattedEmails.filter((e) => !existingIds.has(e.messageId));
      
      if (newEmails.length) {
        user.emails.push(...newEmails);
        user.lastEmailSync = new Date();
        await user.save();
        console.log(`✅ Added ${newEmails.length} new emails for ${session.user.email}`);
      }
    }

    return NextResponse.json({
      success: true,
      totalFetched: formattedEmails.length,
      newEmailsAdded: formattedEmails.length,
      phishingDetected: formattedEmails.filter(e => e.isPotentialPhishing).length
    });
  } catch (err) {
    console.error("❌ Gmail fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch Gmail emails" }, { status: 500 });
  }
}

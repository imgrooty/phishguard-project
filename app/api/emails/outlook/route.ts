import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User, { IUser, IEmail } from "@/models/User";
import { EmailService } from "@/lib/emailService";

interface OutlookEmail {
  id: string;
  subject: string;
  from?: { emailAddress?: { address?: string } };
  toRecipients?: { emailAddress?: { address?: string } }[];
  receivedDateTime: string;
  body?: { content?: string };
  isRead: boolean;
}

function extractLinks(text: string): string[] {
  const linkRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  return text.match(linkRegex) || [];
}

/* =========================
   🔹 Enhanced Outlook Processing
   ========================= */

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await dbConnect();
  const emailService = EmailService.getInstance();
  
  let accessToken = (session as any).access_token as string | undefined;
  const refreshToken = (session as any).refresh_token as string | undefined;

  try {
    // Validate and refresh token if needed
    const isValid = await emailService.validateToken(accessToken!, 'microsoft');
    if (!isValid && refreshToken) {
      console.log("🔄 Refreshing expired token...");
      const refreshed = await emailService.refreshMicrosoftToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.access_token;
        (session as any).access_token = accessToken;
      }
    }

    const { searchParams } = new URL(req.url);
    const sinceParam = searchParams.get("since");
    const filter = sinceParam
      ? `&$filter=receivedDateTime gt ${new Date(sinceParam).toISOString()}`
      : "";

    // Fetch from Microsoft Graph with timeout
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages?$top=50${filter}&$orderby=receivedDateTime DESC`,
      { 
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(15000)
      }
    );

    if (!response.ok) throw new Error(`Outlook API error: ${response.status}`);

    const data = await response.json();
    const messages: OutlookEmail[] = data.value || [];

    // Parse and analyze emails with enhanced detection
    const formattedEmails: IEmail[] = await Promise.all(
      messages.map(async (msg) => {
        const body = msg.body?.content || "";
        const links = extractLinks(body);
        
        const email: IEmail = {
          messageId: msg.id,
          subject: msg.subject || "(No subject)",
          from: msg.from?.emailAddress?.address || "Unknown",
          to: msg.toRecipients?.[0]?.emailAddress?.address || session.user.email!,
          date: new Date(msg.receivedDateTime),
          body,
          isRead: msg.isRead,
          isPotentialPhishing: false,
          phishingScore: 0,
          phishingReasons: [],
        };

        // Enhanced phishing analysis
        const analysis = await emailService.analyzePhishing({
          from: email.from,
          subject: email.subject,
          body: email.body,
          links
        });

        // Update email with analysis results
        email.isPotentialPhishing = analysis.isPotentialPhishing;
        email.phishingScore = analysis.phishingScore;
        email.phishingReasons = analysis.phishingReasons;
        email.prediction = analysis.mlPrediction || (analysis.isPotentialPhishing ? "Potential Phishing" : "Safe Email");
        email.confidence = analysis.confidence;
        email.model_used = analysis.modelUsed;
        email.virusTotalResult = analysis.virusTotalResult;
        email.googleSafeBrowsingResult = analysis.googleSafeBrowsingResult;
        email.heuristicScore = analysis.heuristicScore;
        email.mlScore = analysis.mlScore;

        return email;
      })
    );

    // Update user's stored emails
    const user = await User.findOne({ email: session.user.email }) as IUser | null;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingIds = new Set(user.emails.map((e) => e.messageId));
    const newEmails = formattedEmails.filter((e) => !existingIds.has(e.messageId));

    if (newEmails.length > 0) {
      user.emails.push(...newEmails);
      user.lastEmailSync = new Date();
      await user.save();
      console.log(`✅ Added ${newEmails.length} new Outlook emails for ${session.user.email}`);
    } else {
      console.log(`ℹ️ No new emails to add for ${session.user.email}`);
    }

    return NextResponse.json({
      success: true,
      totalFetched: formattedEmails.length,
      newEmailsAdded: newEmails.length,
      phishingDetected: formattedEmails.filter(e => e.isPotentialPhishing).length
    });
  } catch (error) {
    console.error("❌ Outlook fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch Outlook emails" }, { status: 500 });
  }
}

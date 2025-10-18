import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const MICROSOFT_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

async function refreshAccessToken(refresh_token: string) {
  try {
    const response = await fetch(MICROSOFT_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        refresh_token,
        grant_type: "refresh_token",
        scope: "openid profile email offline_access Mail.Read",
      }),
    });

    const data = await response.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error("❌ Error refreshing Outlook access token:", error);
    return null;
  }
}

async function analyzePhishing(email: any) {
  const reasons: string[] = [];
  let score = 0;

  // Check for suspicious sender
  if (email.from.includes("noreply") || email.from.includes("no-reply")) {
    reasons.push("Sender uses 'noreply' address");
    score++;
  }

  // Check for urgency keywords
  const urgentKeywords = ["urgent", "immediate", "action required", "verify", "suspend", "expire"];
  if (urgentKeywords.some((keyword) => email.subject.toLowerCase().includes(keyword))) {
    reasons.push("Subject contains urgency keywords");
    score++;
  }

  // Check for suspicious links
  if (email.body.includes("http://") || email.body.includes("https://")) {
    const linkCount = (email.body.match(/https?:\/\//g) || []).length;
    if (linkCount > 5) {
      reasons.push("Contains many external links");
      score++;
    }
  }

  return {
    isPotentialPhishing: score >= 2,
    phishingScore: score,
    phishingReasons: reasons,
  };
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let accessToken = (session as any).access_token;
  const refreshToken = (session as any).refresh_token;

  try {
    await dbConnect();

    // Get 'since' parameter for incremental fetch
    const { searchParams } = new URL(req.url);
    const sinceParam = searchParams.get("since");

    // Build Outlook filter
    let filter = "";
    if (sinceParam) {
      const sinceDate = new Date(sinceParam).toISOString();
      filter = `&$filter=receivedDateTime gt ${sinceDate}`;
    }

    // Fetch emails from Outlook
    let response = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages?$top=50${filter}&$orderby=receivedDateTime DESC`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Refresh token if expired
    if (response.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.access_token;
        response = await fetch(
          `https://graph.microsoft.com/v1.0/me/messages?$top=50${filter}&$orderby=receivedDateTime DESC`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    }

    if (!response.ok) {
      throw new Error(`Outlook API error: ${response.status}`);
    }

    const data = await response.json();
    const messages = data.value || [];

    // Parse and format emails
    const formattedEmails = await Promise.all(
      messages.map(async (email: any) => {
        const emailData = {
          messageId: email.id,
          subject: email.subject || "(No subject)",
          from: email.from?.emailAddress?.address || "Unknown",
          to: email.toRecipients?.[0]?.emailAddress?.address || session.user?.email,
          date: new Date(email.receivedDateTime),
          body: email.body?.content || "",
          isRead: email.isRead,
        };

        const phishingAnalysis = await analyzePhishing(emailData);

        return {
          ...emailData,
          ...phishingAnalysis,
        };
      })
    );

    // Update user's emails in database
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      // Get existing message IDs
      const existingIds = new Set(user.emails.map((e: any) => e.messageId));

      // Filter out duplicates
      const newEmails = formattedEmails.filter(
        (email) => !existingIds.has(email.messageId)
      );

      if (newEmails.length > 0) {
        user.emails.push(...newEmails);
        user.lastEmailSync = new Date();
        await user.save();
        console.log(`✅ Added ${newEmails.length} new Outlook emails for ${session.user.email}`);
      } else {
        console.log(`ℹ️ No new emails to add for ${session.user.email}`);
      }
    }

    return NextResponse.json({
      success: true,
      count: formattedEmails.length,
      newEmailsAdded: formattedEmails.length,
    });
  } catch (error) {
    console.error("❌ Outlook fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Outlook emails" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

async function refreshAccessToken(refresh_token: string) {
  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_ID,
        client_secret: process.env.GOOGLE_SECRET,
        refresh_token,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    console.error("❌ Error refreshing access token:", error);
    return null;
  }
}

async function fetchEmailDetails(messageId: string, accessToken: string) {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch email details: ${response.status}`);
  }

  return response.json();
}

function parseEmailBody(payload: any): string {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      if (part.parts) {
        const nestedBody = parseEmailBody(part);
        if (nestedBody) return nestedBody;
      }
    }
  }

  return "";
}

function getHeader(headers: any[], name: string): string {
  const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header?.value || "";
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

  // Check for suspicious links (basic check)
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

    // Build Gmail query
    let query = "in:inbox";
    if (sinceParam) {
      const sinceDate = new Date(sinceParam);
      const gmailDateFormat = Math.floor(sinceDate.getTime() / 1000);
      query += ` after:${gmailDateFormat}`;
    }

    // Fetch message list
    let response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=50`,
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
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=50`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    }

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status}`);
    }

    const data = await response.json();
    const messages = data.messages || [];

    // Fetch full details for each message
    const emailPromises = messages.map((msg: any) =>
      fetchEmailDetails(msg.id, accessToken)
    );
    const fullEmails = await Promise.all(emailPromises);

    // Parse and format emails
    const formattedEmails = await Promise.all(
      fullEmails.map(async (email: any) => {
        const headers = email.payload.headers;
        const body = parseEmailBody(email.payload);

        const emailData = {
          messageId: email.id,
          subject: getHeader(headers, "Subject"),
          from: getHeader(headers, "From"),
          to: getHeader(headers, "To"),
          date: new Date(parseInt(email.internalDate)),
          body,
          isRead: !email.labelIds?.includes("UNREAD"),
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
        console.log(`✅ Added ${newEmails.length} new Gmail emails for ${session.user.email}`);
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
    console.error("❌ Gmail fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Gmail emails" },
      { status: 500 }
    );
  }
}
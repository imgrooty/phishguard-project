import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { EmailService } from "@/lib/emailService";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sinceParam = searchParams.get("since");
    const since = sinceParam ? new Date(sinceParam) : null;

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user has no access token, we can't fetch anything
    if (!user.accessToken || !user.provider || user.provider === "credentials") {
      return NextResponse.json({
        success: true,
        emails: user.emails || [],
        lastSync: user.lastEmailSync || new Date()
      });
    }

    const emailService = EmailService.getInstance();

    // Check if token needs refresh
    let accessToken = user.accessToken;
    const now = new Date();

    // Refresh 5 minutes before actual expiry to be safe
    const expiryThreshold = new Date(now.getTime() + 5 * 60 * 1000);

    if (user.refreshToken && (!user.tokenExpiry || user.tokenExpiry <= expiryThreshold)) {
      console.log(`🔄 Refreshing ${user.provider} token for ${user.email}`);
      let refreshResult = null;

      if (user.provider === "google") {
        refreshResult = await emailService.refreshGoogleToken(user.refreshToken);
      } else if (user.provider === "azure-ad" || user.provider === "microsoft") {
        refreshResult = await emailService.refreshMicrosoftToken(user.refreshToken);
      }

      if (refreshResult) {
        accessToken = refreshResult.access_token;
        user.accessToken = accessToken;
        if (refreshResult.refresh_token) {
          user.refreshToken = refreshResult.refresh_token;
        }
        user.tokenExpiry = new Date(Date.now() + refreshResult.expires_in * 1000);
        await user.save();
        console.log(`✅ Token refreshed successfully for ${user.email}`);
      } else {
        console.warn(`⚠️ Failed to refresh token for ${user.email}`);
      }
    }

    const fetchedEmails: any[] = [];
    const limit = 10; // Fetch latest 10 emails

    try {
      if (user.provider === "google") {
        let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${limit}`;
        if (since) {
          const seconds = Math.floor(since.getTime() / 1000);
          url += `&q=after:${seconds}`;
        }

        const listResponse = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (listResponse.ok) {
          const listData = await listResponse.json();
          const messages = listData.messages || [];

          for (const msg of messages) {
            if (user.emails.some((e: any) => e.messageId === msg.id)) continue;

            const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (msgResponse.ok) {
              const msgData = await msgResponse.json();
              fetchedEmails.push(parseGmailMessage(msgData));
            }
          }
        }
      } else if (user.provider === "azure-ad" || user.provider === "microsoft") {
        let url = `https://graph.microsoft.com/v1.0/me/messages?$top=${limit}&$select=id,subject,from,toRecipients,receivedDateTime,body,isRead`;
        if (since) {
          url += `&$filter=receivedDateTime ge ${since.toISOString()}`;
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.ok) {
          const data = await response.json();
          const messages = data.value || [];

          for (const msg of messages) {
            if (user.emails.some((e: any) => e.messageId === msg.id)) continue;
            fetchedEmails.push(parseMicrosoftMessage(msg));
          }
        }
      }
    } catch (fetchError) {
      console.error("⚠️ Error fetching from provider API:", fetchError);
    }

    // Analyze new emails
    const analyzedEmails = [];
    for (const email of fetchedEmails) {
      try {
        const linkRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
        const links = email.body.match(linkRegex) || [];

        const analysis = await emailService.analyzePhishing({
          from: email.from,
          subject: email.subject,
          body: email.body,
          links
        });

        analyzedEmails.push({
          ...email,
          isPotentialPhishing: analysis.isPotentialPhishing,
          phishingScore: analysis.phishingScore,
          phishingReasons: analysis.phishingReasons,
          prediction: analysis.mlPrediction,
          confidence: analysis.confidence,
          model_used: analysis.modelUsed,
          virusTotalResult: analysis.virusTotalResult,
          googleSafeBrowsingResult: analysis.googleSafeBrowsingResult,
          heuristicScore: analysis.heuristicScore,
          mlScore: analysis.mlScore
        });
      } catch (analysisError) {
        console.error(`⚠️ Error analyzing email ${email.messageId}:`, analysisError);
        analyzedEmails.push(email);
      }
    }

    // Persistence
    if (analyzedEmails.length > 0) {
      // Add new emails to the beginning of the array
      user.emails.unshift(...analyzedEmails);
      user.lastEmailSync = new Date();
      await user.save();
      console.log(`💾 Saved ${analyzedEmails.length} new analyzed emails for ${user.email}`);
    } else {
      // Update last sync time even if no new emails
      user.lastEmailSync = new Date();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      emails: user.emails || [],
      lastSync: user.lastEmailSync
    });

  } catch (error: any) {
    console.error("❌ Fetch API Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}

function parseGmailMessage(msg: any) {
  const headers = msg.payload.headers;
  const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
  const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "unknown@unknown.com";
  const to = headers.find((h: any) => h.name.toLowerCase() === "to")?.value || "";
  const date = new Date(parseInt(msg.internalDate));

  let body = "";
  if (msg.payload.parts) {
    // Try to find HTML part first, then plain text
    const parts = msg.payload.parts;
    const findBody = (pts: any[]): string => {
      for (const part of pts) {
        if (part.mimeType === "text/html" && part.body.data) {
          return Buffer.from(part.body.data, 'base64url').toString();
        }
        if (part.parts) {
          const result = findBody(part.parts);
          if (result) return result;
        }
      }
      for (const part of pts) {
        if (part.mimeType === "text/plain" && part.body.data) {
          return Buffer.from(part.body.data, 'base64url').toString();
        }
      }
      return "";
    };
    body = findBody(parts);
  } else if (msg.payload.body.data) {
    body = Buffer.from(msg.payload.body.data, 'base64url').toString();
  }

  return {
    messageId: msg.id,
    subject,
    from,
    to,
    date,
    body,
    isRead: !msg.labelIds?.includes("UNREAD")
  };
}

function parseMicrosoftMessage(msg: any) {
  return {
    messageId: msg.id,
    subject: msg.subject || "(No Subject)",
    from: msg.from?.emailAddress?.address || "unknown@unknown.com",
    to: msg.toRecipients?.[0]?.emailAddress?.address || "",
    date: new Date(msg.receivedDateTime),
    body: msg.body?.content || "",
    isRead: msg.isRead
  };
}

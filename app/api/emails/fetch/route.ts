import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

/* -----------------------------------------
   🔹 Interfaces
------------------------------------------ */
interface SessionUser {
  id: string;
  email: string;
  name: string;
  provider?: string;
}

interface Email {
  messageId: string;
  subject: string;
  from: string;
  date: string | Date;
  body?: string;
  isRead?: boolean;
  isPotentialPhishing?: boolean;
  phishingScore?: number;
  phishingReasons?: string[];
}

/* -----------------------------------------
   🔹 Main GET Handler
------------------------------------------ */
export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as
      | {
          user?: SessionUser;
          access_token?: string;
          refresh_token?: string;
          provider?: string;
        }
      | null;

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No valid session found" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // 🔹 Determine provider
    const provider = (session as any).provider || session.user.provider;
    const { searchParams } = new URL(req.url);
    const sinceParam = searchParams.get("since");

    // 🔹 Build fetch endpoint
    let fetchEndpoint: string | null = null;
    switch (provider) {
      case "google":
        fetchEndpoint = "/api/emails/gmail";
        break;
      case "azure-ad":
        fetchEndpoint = "/api/emails/outlook";
        break;
      default:
        return NextResponse.json({
          success: false,
          message: "Email fetching not supported for credentials login",
          emails: [],
          provider,
        });
    }

    // 🔹 Construct background fetch URL
    const fetchUrl = sinceParam
      ? `${fetchEndpoint}?since=${encodeURIComponent(sinceParam)}`
      : fetchEndpoint;

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://your-production-domain.com"
        : "http://localhost:3000");

    // 🔹 Background fetch trigger with timeout
    fetch(`${baseUrl}${fetchUrl}`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
      signal: AbortSignal.timeout(30000)
    }).catch((err) => console.warn("⚠️ Background email fetch error:", err.message));

    // 🔹 Filter and sort emails
    let emailsToReturn: Email[] = (user.emails || []) as Email[];

    if (sinceParam) {
      const sinceDate = new Date(sinceParam);
      emailsToReturn = emailsToReturn.filter((email) => new Date(email.date) > sinceDate);
      console.log(`📩 Returning ${emailsToReturn.length} new emails since ${sinceDate.toISOString()}`);
    }

    // 🔹 Sort by date descending
    emailsToReturn.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 🔹 Include phishing summary info
    const phishingSummary = {
      total: emailsToReturn.length,
    };

    return NextResponse.json({
      success: true,
      provider,
      isIncremental: !!sinceParam,
      lastSync: new Date().toISOString(),
      totalEmailsInDb: user.emails?.length || 0,
      phishingSummary,
      emails: emailsToReturn,
    });
  } catch (error: any) {
    console.error("❌ Error in /api/emails:", error.message);
    return NextResponse.json({ success: false, error: "Failed to fetch emails" }, { status: 500 });
  }
}

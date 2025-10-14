// app/api/emails/route.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

function decodeBase64Url(encoded: string) {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf-8");
}

export async function GET() {
  const session = await auth();

  if (!session?.access_token || !session?.user.provider) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    if (session.user.provider === "google") {
      // Fetch Gmail messages
      const listRes = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5",
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      const listData = await listRes.json();

      if (!listData.messages) return NextResponse.json({ emails: [] });

      // Fetch full message details
      const emails: Email[] = await Promise.all(
        listData.messages.map(async (msg: { id: string }) => {
          const msgRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
            { headers: { Authorization: `Bearer ${session.access_token}` } }
          );
          const emailData = await msgRes.json();

          const headers = emailData.payload.headers;
          const subject = headers.find((h: any) => h.name === "Subject")?.value || "";
          const from = headers.find((h: any) => h.name === "From")?.value || "";
          const date = headers.find((h: any) => h.name === "Date")?.value || "";

          let snippet = emailData.snippet || "";

          // Optional: decode text/plain body if you want more content
          if (emailData.payload.parts) {
            const part = emailData.payload.parts.find((p: any) => p.mimeType === "text/plain");
            if (part?.body?.data) snippet = decodeBase64Url(part.body.data);
          }

          return { id: emailData.id, subject, from, date, snippet };
        })
      );

      return NextResponse.json({ provider: "google", emails });
    } 
    
    else if (session.user.provider === "microsoft-entra-id") {
      // Fetch Outlook messages
      const res = await fetch(
        "https://graph.microsoft.com/v1.0/me/messages?$top=5&$select=subject,from,receivedDateTime,bodyPreview",
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );
      const data = await res.json();

      const emails: Email[] = data.value.map((msg: any) => ({
        id: msg.id,
        subject: msg.subject,
        from: msg.from?.emailAddress?.name || msg.from?.emailAddress?.address || "",
        date: msg.receivedDateTime,
        snippet: msg.bodyPreview,
      }));

      return NextResponse.json({ provider: "microsoft", emails });
    }

    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

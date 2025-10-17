import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
async function refreshAccessToken(refresh_token: string) {
  try {
    const response = await axios.post(GOOGLE_TOKEN_URL, {
      client_id: process.env.GOOGLE_ID,
      client_secret: process.env.GOOGLE_SECRET,
      refresh_token,
      grant_type: "refresh_token",
    });

    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    };
  } catch (error) {
    console.error("❌ Error refreshing access token:", (error as any).response?.data || error);
    return null;
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const accessToken = (session as any).access_token;
  const refreshToken = (session as any).refresh_token;
  
  try {
    // Try fetching Gmail messages with current token
    const res = await axios.get("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (err: any) {
    console.warn("⚠️ Gmail API error:", err.response?.status, err.response?.data);

    // If token expired → refresh it
    if (err.response?.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken);
      if (refreshed) {
        const newAccessToken = refreshed.access_token;
        // Try again with new token
        const res = await axios.get("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5", {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });
        return new Response(JSON.stringify(res.data), { status: 200 });
      }
    }

    return new Response(JSON.stringify({ error: "Failed to fetch emails" }), { status: 500 });
  }
}

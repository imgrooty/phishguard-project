import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

// Define a TypeScript type for your session.user
type SessionUser = {
  id?: string;
  email?: string;
  name?: string;
  provider?: string;
};

export async function POST(req: Request) {
  try {
    // 1️⃣ Get session from NextAuth handler
    const session = (await getServerSession(authOptions)) as {  
      user?: SessionUser;
      provider?: string;
    } | null;

    // Debug logging
    console.log("📋 Full session:", JSON.stringify(session, null, 2));

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized: no user session found" },
        { status: 401 }
      );
    }

    const { email, name } = session.user;

    // Check if email exists
    if (!email) {
      console.error("❌ No email in session:", session);
      return NextResponse.json(
        { message: "Unauthorized: no email in session" },
        { status: 401 }
      );
    }

    await dbConnect();

    // 2️⃣ Check if user exists
    let user = await User.findOne({ email });

    const provider = session.user.provider || session.provider || "oauth";

    if (!user) {
      // 3️⃣ Create new user if not exists
      console.log("🆕 Creating new user:", { name, email, provider });
      
      user = await User.create({
        name: name || email.split('@')[0], // Fallback to email username if no name
        email,
        password: "oauth-user", // Set a default password for OAuth users
        provider, // Store the actual provider (google, azure-ad, etc.)
      });

      console.log("✅ User created:", user._id);
    } else {
      console.log("✅ User already exists:", user._id);
    }

    return NextResponse.json({
      message: "User saved successfully",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        provider: user.provider 
      },
    });
  } catch (err) {
    console.error("❌ SAVE_USER_ERROR:", err);
    return NextResponse.json(
      { message: "Failed to save user", error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
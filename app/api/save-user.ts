import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { handler as nextAuthHandler } from "./auth/[...nextauth]/route"; // import your NextAuth handler

export async function POST(req: Request) {
  try {
    // 1️⃣ Get session from NextAuth handler
    const session = await getServerSession(nextAuthHandler);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized: no user session found" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { email, name } = session.user;

    // 2️⃣ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // 3️⃣ Create new user if not exists
      user = await User.create({
        name,
        email,
        password: "", // leave empty for OAuth users
      });
    }

    return NextResponse.json({
      message: "User saved successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("SAVE_USER_ERROR:", err);
    return NextResponse.json(
      { message: "Failed to save user" },
      { status: 500 }
    );
  }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

// Handle GET request to export user profile and stats as JSON
export async function GET() {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    // Fetch user profile from DB
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare export data (customize as needed)
    const exportData = {
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      platforms: user.platforms,
      socials: user.socials,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };
    const json = JSON.stringify(exportData, null, 2);
    const filename = `codecracker-profile-${user.username || "user"}.json`;

    // Return as downloadable file
    return new Response(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
      },
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json({ error: "Failed to export profile" }, { status: 500 });
  }
}
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongoose";
import { getLeetcodeStats } from "@/lib/platforms/leetcode";
import { getCodechefStats } from "@/lib/platforms/codechef";
import { getCodeforcesStats } from "@/lib/platforms/codeforces";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    
    let leetcodeStats = null;
    if (user.platforms?.leetcode) {
      try {
        leetcodeStats = await getLeetcodeStats(user.platforms.leetcode);
        if (!leetcodeStats) {
          throw new Error("Failed to fetch leetcodes stats");
        }
      } catch (error) {
        console.error("LeetCode stats error:", error);
        leetcodeStats = { error: "Failed to fetch LeetCode stats" };
      }
    } else {
      console.log("No LeetCode username found in user data");
    }

    let codeforcesStats = null;
    if (user.platforms?.codeforces) {
      try {
        codeforcesStats = await getCodeforcesStats(user.platforms.codeforces);
        if (!codeforcesStats) {
          throw new Error("Failed to fetch Codeforces stats");
        }
      } catch (error) {
        console.error("Codeforces stats error:", error);
        codeforcesStats = { error: "Failed to fetch Codeforces stats" };
      }
    } else {
      console.log("No Codeforces username found in user data");
    }

    let codechefStats = null;
    if (user.platforms?.codechef) {
      try {
        codechefStats = await getCodechefStats(user.platforms.codechef);
        if (!codechefStats) {
          throw new Error("Failed to fetch CodeChef stats");
        }
      } catch (error) {
        console.error("CodeChef stats error:", error);
        codechefStats = { error: "Failed to fetch CodeChef stats" };
      }
    } else {
      console.log("No CodeChef username found in user data");
    }

    return NextResponse.json({
      leetcode: leetcodeStats,
      codeforces: codeforcesStats,
      codechef: codechefStats,
      platforms: user.platforms,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

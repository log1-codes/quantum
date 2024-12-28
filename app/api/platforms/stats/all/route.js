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

    console.log("User found:", {
      email: user.email,
      platforms: user.platforms,
    });

    
    let leetcodeStats = null;
    if (user.platforms?.leetcode) {
      try {
        leetcodeStats = await getLeetcodeStats(user.platforms.leetcode);
        console.log("Leetcode  stats result:", leetcodeStats);
        if (!leetcodeStats) {
          throw new Error("Failed to fetch leetcodes stats");
        }

        // leetcodeStats = {
        //   totalSolved: leetcodeStats?.solvedQuestions?.total || 0,
        //   easySolved: leetcodeStats?.solvedQuestions?.easy || 0,
        //   mediumSolved: leetcodeStats?.solvedQuestions?.medium || 0,
        //   hardSolved: leetcodeStats?.solvedQuestions?.hard || 0,
        //   totalQuestions: leetcodeStats?.totalQuestions || 0,
        //   acceptanceRate: leetcodeStats?.acceptanceRate || 0,
        //   ranking: leetcodeStats?.ranking || 'N/A',
        //   easySolvedBeatsPercentage: leetcodeStats?.solvedQuestions?.easyBeatsPercentage || 0,
        //   mediumSolvedBeatsPercentage: leetcodeStats?.solvedQuestions?.mediumBeatsPercentage || 0,
        //   hardSolvedBeatsPercentage: leetcodeStats?.solvedQuestions?.hardBeatsPercentage || 0,
        //   contestRating: leetcodeStats?.contestDetails?.rating || 0,
        //   contestGlobalRanking: leetcodeStats?.contestDetails?.globalRanking || 0,
        //   contestsAttended: leetcodeStats?.contestDetails?.contestsAttended || 0,
        //   contestTopPercentage: leetcodeStats?.contestDetails?.topPercentage || 0,
        //   badges: leetcodeStats?.badges || [], // Use 'badges' here
        //   recentContests: leetcodeStats?.contestDetails?.recentContests || [],
        //   currentStreak: leetcodeStats?.streaks?.current || 0,
        //   totalActiveDays: leetcodeStats?.streaks?.activeDays || 0,
        //   submissionCalendar: leetcodeStats?.submissionCalendar || {},
        //   dccBadges: leetcodeStats?.dccBadges || [],
        //   lastUpdated: leetcodeStats?.lastUpdated || new Date().toISOString(),
        // };
      } catch (error) {
        console.error("LeetCode stats error:", error);
        leetcodeStats = { error: "Failed to fetch LeetCode stats" };
      }
    } else {
      console.log("No LeetCode username found in user data");
    }

    // Fetch GeeksforGeeks stats
    // let geeksForGeeksStats = null;
    // if (user.platforms?.geeksforgeeks) {
    //   try {
    //     geeksForGeeksStats = await getGeeksforgeeksStats(user.platforms.geeksforgeeks);
    //     if (!geeksForGeeksStats) {
    //       throw new Error("Failed to fetch GeeksforGeeks stats");
    //     }
    //     geeksForGeeksStats = {
    //       username: geeksForGeeksStats.username || "N/A",
    //       instituteName: geeksForGeeksStats.instituteName || "N/A",
    //       codingScore: geeksForGeeksStats.codingScore || 0,
    //       problemsSolved: geeksForGeeksStats.problemsSolved || 0,
    //       monthlyCodingScore: geeksForGeeksStats.monthlyCodingScore || 0,
    //       overallCodingPercentile: geeksForGeeksStats.overallCodingPercentile || 0,
    //       currentStreak: geeksForGeeksStats.currentStreak || 0,
    //       maxStreak: geeksForGeeksStats.maxStreak || 0,
    //       contestRating: geeksForGeeksStats.contestRating || 0,
    //       globalRank: geeksForGeeksStats.globalRank || 0,
    //       instituteRank: geeksForGeeksStats.instituteRank || 0,
    //       totalGeekBits: geeksForGeeksStats.totalGeekBits || 0,
    //       articleCount: geeksForGeeksStats.articleCount || 0,
    //       discussCount: geeksForGeeksStats.discussCount || 0,
    //       languageStats: geeksForGeeksStats.languageStats || [],
    //       lastUpdated: geeksForGeeksStats.lastUpdated || new Date().toISOString(),
    //     };
    //   } catch (error) {
    //     console.error("GeeksforGeeks stats error:", error);
    //     geeksForGeeksStats = { error: "Failed to fetch GeeksforGeeks stats" };
    //   }
    // } else {
    //   console.log("No GeeksforGeeks username found in user data");
    // }

    // Fetch Codeforces stats
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

    // Fetch CodeChef stats
    let codechefStats = null;
    if (user.platforms?.codechef) {
      try {
        codechefStats = await getCodechefStats(user.platforms.codechef);
        if (!codechefStats) {
          throw new Error("Failed to fetch CodeChef stats");
        }
        console.log("CodeChef stats result:", codechefStats);
      } catch (error) {
        console.error("CodeChef stats error:", error);
        codechefStats = { error: "Failed to fetch CodeChef stats" };
      }
    } else {
      console.log("No CodeChef username found in user data");
    }

    return NextResponse.json({
      leetcode: leetcodeStats,
      // geeksforgeeks: geeksForGeeksStats,
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

"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LeetCodeStats from "@/components/platforms/LeetCodeStats";
import CodeforcesStats from "@/components/platforms/CodeforcesStats";
import CodechefStats from "@/components/platforms/CodechefStats";
import GeeksForGeeksStats from "@/components/platforms/GeeksForGeeksStats";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/platforms/stats/all");
        const data = await response.json();
        console.log("API Response:", data); // Debugging API response
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [session]);

  const renderLoginPrompt = () => (
    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-lg p-6 text-center border border-orange-800/30">
      <h2 className="text-2xl font-bold text-white">Welcome!</h2>
      <p className="text-zinc-400 mt-4">
        Please log in or sign up to view your coding stats.
      </p>
      <a
        href="/api/auth/signin"
        className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
      >
        Log In / Sign Up
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(234,179,8,0.05),transparent_70%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Your <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">Coding Profiles</span>
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-zinc-400 mt-4">Loading your coding stats...</p>
            </div>
          ) : session ? (
            <>
              {console.log("LeetCode Stats:", stats?.leetcode)}
              <LeetCodeStats stats={stats?.leetcode} />
              {console.log("Codeforces Stats:", stats?.codeforces)}
              <CodeforcesStats stats={stats?.codeforces} />
              {console.log("CodeChef Stats:", stats?.codechef)}
              <CodechefStats stats={stats?.codechef} />
              {console.log("GeeksForGeeks Stats:", stats?.geeksforgeeks)}
              <GeeksForGeeksStats stats={stats?.geeksforgeeks} />
            </>
          ) : (
            renderLoginPrompt()
          )}
        </div>
      </div>
    </div>
  );
}
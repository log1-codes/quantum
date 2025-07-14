"use client";
import { useState } from "react";
import { SiCodeforces } from "react-icons/si";
import { FaTrophy, FaMedal } from "react-icons/fa";
import { BarChart3 } from "lucide-react";

export default function CodeforcesStats({ stats }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!stats) {
    return (
      <div className="relative bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl rounded-3xl border border-orange-500/20 p-8 shadow-2xl overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 animate-pulse"></div>
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] backdrop-blur-sm rounded-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA116] to-[#FF8C00] flex items-center justify-center shadow-lg shadow-orange-500/25 animate-pulse">
              <SiCodeforces className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFA116] to-yellow-500 bg-clip-text text-transparent">
              Codeforces
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 flex items-center justify-center backdrop-blur-sm shadow-inner animate-bounce">
              <SiCodeforces className="text-[#FFA116]/60 text-4xl" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-orange-100 font-semibold text-xl">Codeforces username not set</p>
              <p className="text-zinc-400 text-sm max-w-md">
                Connect your Codeforces profile to unlock detailed statistics, contest history, and performance insights
              </p>
            </div>
            <button className="mt-6 bg-gradient-to-r from-[#FFA116] to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/25">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTabs = () => (
    <div className="flex mb-6 bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-1 backdrop-blur-md shadow-inner">
      <button
        onClick={() => setActiveTab("overview")}
        className={`flex-1 px-4 py-3 font-medium flex items-center justify-center gap-2 rounded-lg transition-all duration-500 transform ${
          activeTab === "overview"
            ? "bg-gradient-to-r from-[#FFA116]/30 to-orange-500/20 text-[#FFA116] border border-[#FFA116]/40 shadow-lg shadow-orange-500/20 scale-105 backdrop-blur-sm"
            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20 hover:scale-102 backdrop-blur-sm"
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        Overview
      </button>
      <button
        onClick={() => setActiveTab("contests")}
        className={`flex-1 px-4 py-3 font-medium flex items-center justify-center gap-2 rounded-lg transition-all duration-500 transform ${
          activeTab === "contests"
            ? "bg-gradient-to-r from-[#FFA116]/30 to-orange-500/20 text-[#FFA116] border border-[#FFA116]/40 shadow-lg shadow-orange-500/20 scale-105 backdrop-blur-sm"
            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20 hover:scale-102 backdrop-blur-sm"
        }`}
      >
        <FaTrophy className="w-4 h-4" />
        Contests
      </button>
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Profile Photo and Handle */}
      <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 rounded-xl p-5 flex items-center gap-4 backdrop-blur-sm shadow-lg">
        <div className="w-24 h-24 overflow-hidden rounded-full bg-zinc-700 border-2 border-[#FFA116]">
          <img
            src={stats.titlePhoto}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-white text-lg font-bold">{stats.handle}</h3>
          <p className="text-zinc-400 text-sm">Codeforces User</p>
        </div>
      </div>
      {/* Ranking & Stats */}
      <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 rounded-xl p-5 backdrop-blur-sm shadow-lg">
        <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <FaMedal className="text-[#FFA116]" />
          Ranking & Stats
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-all duration-300">
            <span className="text-gray-300">Current Rating</span>
            <span className="text-[#FFA116] font-bold text-lg">{stats.rating}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-all duration-300">
            <span className="text-gray-300">Max Rating</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.maxRating}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-all duration-300">
            <span className="text-gray-300">Rank</span>
            <span className="text-orange-400 font-bold text-lg">{stats.rank}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-all duration-300">
            <span className="text-gray-300">Max Rank</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.maxRank}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContests = () => (
    <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 rounded-xl p-5 backdrop-blur-sm shadow-lg">
      <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <FaTrophy className="text-[#FFA116]" />
        Recent Contests
      </h4>
      {stats.recentContests && stats.recentContests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-zinc-400 text-sm border-b border-zinc-700/50">
              <tr>
                <th className="text-left py-3 px-4">Contest</th>
                <th className="text-center py-3">Rank</th>
                <th className="text-center py-3">Old Rating</th>
                <th className="text-right py-3 px-4">New Rating</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentContests.map((contest, idx) => (
                <tr
                  key={idx}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-300 font-medium">{contest.contestName}</td>
                  <td className="py-4 text-center text-[#FFA116] font-medium">#{contest.rank}</td>
                  <td className="py-4 text-center text-yellow-400 font-medium">{contest.oldRating}</td>
                  <td className="py-4 text-right px-4 text-[#FFA116] font-medium">{contest.newRating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-400 text-sm">No recent contests available.</p>
      )}
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl rounded-3xl border border-orange-500/20 p-6 shadow-2xl overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] backdrop-blur-sm rounded-3xl"></div>
      {/* Floating orbs for ambient effect */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFA116] to-[#FF8C00] flex items-center justify-center shadow-lg shadow-orange-500/25 animate-pulse">
              <SiCodeforces className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Codeforces</h3>
              <p className="text-zinc-400 text-sm">Competitive Programming Platform</p>
            </div>
          </div>
        </div>
        {renderTabs()}
        <div className="relative">
          <div className={`transition-all duration-300 ${
            activeTab === "overview" 
              ? "opacity-100 visible" 
              : "opacity-0 invisible absolute inset-0"
          }`}>
            {renderOverview()}
          </div>
          <div className={`transition-all duration-300 ${
            activeTab === "contests" 
              ? "opacity-100 visible" 
              : "opacity-0 invisible absolute inset-0"
          }`}>
            {renderContests()}
          </div>
        </div>
      </div>
    </div>
  );
}
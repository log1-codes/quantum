"use client";
import { useState } from "react";
import { SiCodeforces } from "react-icons/si";
import { FaChartLine, FaTrophy, FaMedal, FaUserFriends } from "react-icons/fa";

export default function CodeforcesStats({ stats }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!stats) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-orange-800/30 p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <SiCodeforces className="text-orange-500 text-3xl" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent">Codeforces</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
            <SiCodeforces className="text-orange-500/50 text-3xl" />
          </div>
          <p className="text-orange-100 font-medium text-lg">Codeforces username not set</p>
          <p className="text-zinc-400 text-sm max-w-sm text-center">
            Please update your profile with your Codeforces username to see your statistics
          </p>
          <button className="mt-4 px-6 py-2 bg-orange-600 hover:bg-orange-500 transition-colors rounded-full text-white font-medium">
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  const renderTabs = () => (
    <div className="flex mb-6 border-b border-zinc-800">
      <button
        onClick={() => setActiveTab("overview")}
        className={`px-4 py-3 font-medium flex items-center gap-2 ${
          activeTab === "overview"
            ? "text-orange-400 border-b-2 border-orange-500"
            : "text-zinc-400 hover:text-zinc-300"
        }`}
      >
        <FaChartLine className="text-sm" />
        Overview
      </button>
      <button
        onClick={() => setActiveTab("contests")}
        className={`px-4 py-3 font-medium flex items-center gap-2 ${
          activeTab === "contests"
            ? "text-orange-400 border-b-2 border-orange-500"
            : "text-zinc-400 hover:text-zinc-300"
        }`}
      >
        <FaTrophy className="text-sm" />
        Contests
      </button>
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Profile Photo and Handle */}
      <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50 flex items-center gap-4">
        <div className="w-24 h-24 overflow-hidden rounded-full bg-zinc-700 border-2 border-orange-500">
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
      <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
        <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <FaMedal className="text-orange-500" />
          Ranking & Stats
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Current Rating</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.rating}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Max Rating</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.maxRating}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Rank</span>
            <span className="text-orange-400 font-bold text-lg">{stats.rank}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Max Rank</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.maxRank}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContests = () => (
    <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
      <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <FaTrophy className="text-orange-500" />
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
                  <td className="py-4 text-center text-yellow-400 font-medium">#{contest.rank}</td>
                  <td className="py-4 text-center text-orange-400 font-medium">{contest.oldRating}</td>
                  <td className="py-4 text-right px-4 text-yellow-400 font-medium">{contest.newRating}</td>
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
    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-orange-800/30 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg shadow-lg">
            <SiCodeforces className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white">Codeforces</h3>
        </div>
      </div>
      {renderTabs()}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "contests" && renderContests()}
    </div>
  );
}
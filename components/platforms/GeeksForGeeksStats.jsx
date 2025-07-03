"use client";
import { useState } from "react";
import { SiGeeksforgeeks } from "react-icons/si";
import { FaChartLine, FaMedal, FaTrophy, FaCalendarAlt } from "react-icons/fa";

export default function GeeksForGeeksStats({ stats }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!stats) {
    return (
      <div className="relative bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl rounded-3xl border border-orange-500/20 p-8 shadow-2xl overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 animate-pulse"></div>
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] backdrop-blur-sm rounded-3xl"></div>
        {/* Floating orbs for ambient effect */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA116] to-[#FF8C00] flex items-center justify-center shadow-lg shadow-orange-500/25 animate-pulse">
              <SiGeeksforgeeks className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFA116] to-yellow-500 bg-clip-text text-transparent">GeeksForGeeks</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 flex items-center justify-center backdrop-blur-sm shadow-inner animate-bounce">
              <SiGeeksforgeeks className="text-[#FFA116]/60 text-4xl" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-orange-100 font-semibold text-xl">GeeksForGeeks username not set</p>
              <p className="text-zinc-400 text-sm max-w-md">
                Please update your profile with your GeeksForGeeks username to see your statistics
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
        <FaChartLine className="w-4 h-4" />
        Overview
      </button>
      <button
        onClick={() => setActiveTab("activity")}
        className={`flex-1 px-4 py-3 font-medium flex items-center justify-center gap-2 rounded-lg transition-all duration-500 transform ${
          activeTab === "activity"
            ? "bg-gradient-to-r from-[#FFA116]/30 to-orange-500/20 text-[#FFA116] border border-[#FFA116]/40 shadow-lg shadow-orange-500/20 scale-105 backdrop-blur-sm"
            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20 hover:scale-102 backdrop-blur-sm"
        }`}
      >
        <FaCalendarAlt className="w-4 h-4" />
        Activity
      </button>
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Profile Info */}
      <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50 flex items-center gap-4">
        <div className="w-24 h-24 overflow-hidden rounded-full bg-zinc-700 border-2 border-orange-500">
          <img
            src={stats.userInfo.profilePicture || "/placeholder.svg"}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-white text-lg font-bold">{stats.userInfo.fullName}</h3>
          <p className="text-zinc-400 text-sm">@{stats.userInfo.userName}</p>
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
            <span className="text-gray-300">Coding Score</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.userInfo.codingScore}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Monthly Score</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.userInfo.monthlyScore}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Current Streak</span>
            <span className="text-orange-400 font-bold text-lg">{stats.userInfo.currentStreak} days</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Max Streak</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.userInfo.maxStreak} days</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
      <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-orange-500" />
        Problem Solving Stats
      </h4>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Basic", value: stats.solvedStats.basic, color: "#FF9800" },
          { label: "Easy", value: stats.solvedStats.easy, color: "#FFC107" },
          { label: "Medium", value: stats.solvedStats.medium, color: "#FFEB3B" },
          { label: "Hard", value: stats.solvedStats.hard, color: "#F44336" },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="relative flex items-center justify-center w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="10"
                  strokeDasharray={`${(item.value / 100) * 283} ${283 - (item.value / 100) * 283}`}
                  strokeDashoffset="70.75"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-white">{item.value}</p>
              </div>
            </div>
            <h5 className="text-gray-400 mt-2">{item.label}</h5>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total Problems Solved</span>
          <span className="text-2xl font-bold text-white">{stats.userInfo.totalProblemsSolved}</span>
        </div>
      </div>
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
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#FFA116] to-[#FF8C00] rounded-lg shadow-lg shadow-orange-500/25 animate-pulse">
              <SiGeeksforgeeks className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white">GeeksForGeeks</h3>
          </div>
        </div>
        {renderTabs()}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "activity" && renderActivity()}
      </div>
    </div>
  );
}
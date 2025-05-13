"use client";
import { useState } from "react";
import { SiGeeksforgeeks } from "react-icons/si";
import { FaChartLine, FaMedal, FaTrophy, FaCalendarAlt } from "react-icons/fa";

export default function GeeksForGeeksStats({ stats }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!stats) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-orange-800/30 p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <SiGeeksforgeeks className="text-orange-500 text-3xl" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent">GeeksForGeeks</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
            <SiGeeksforgeeks className="text-orange-500/50 text-3xl" />
          </div>
          <p className="text-orange-100 font-medium text-lg">GeeksForGeeks username not set</p>
          <p className="text-zinc-400 text-sm max-w-sm text-center">
            Please update your profile with your GeeksForGeeks username to see your statistics
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
        onClick={() => setActiveTab("activity")}
        className={`px-4 py-3 font-medium flex items-center gap-2 ${
          activeTab === "activity"
            ? "text-orange-400 border-b-2 border-orange-500"
            : "text-zinc-400 hover:text-zinc-300"
        }`}
      >
        <FaCalendarAlt className="text-sm" />
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
    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-orange-800/30 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg shadow-lg">
            <SiGeeksforgeeks className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white">GeeksForGeeks</h3>
        </div>
      </div>
      {renderTabs()}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "activity" && renderActivity()}
    </div>
  );
}
"use client";
import { useState } from "react";
import { SiLeetcode } from "react-icons/si";
import { FaChartLine, FaCalendarAlt, FaMedal, FaQuestion, Fa500Px } from "react-icons/fa";

export default function LeetCodeStats({ stats }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!stats) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-orange-800/30 p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
            <SiLeetcode className="text-[#FFA116] text-3xl" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent">LeetCode</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
            <SiLeetcode className="text-orange-500/50 text-3xl" />
          </div>
          <p className="text-orange-100 font-medium text-lg">LeetCode username not set</p>
          <p className="text-zinc-400 text-sm max-w-sm text-center">
            Please update your profile with your LeetCode username to see your statistics
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

  const renderHeatMap = () => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    // Generate all dates in the past six months
    const allDates = [];
    const currentDate = new Date(sixMonthsAgo);
    while (currentDate <= today) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Map activity data to the dates
    const activityMap = {};
    Object.entries(stats.submissionCalendar).forEach(([timestamp, count]) => {
      const date = new Date(Number.parseInt(timestamp) * 1000);
      const dateStr = date.toISOString().split("T")[0];
      activityMap[dateStr] = count;
    });

    const getIntensityColor = (value) => {
      if (!value) return "bg-zinc-800"; // No activity
      if (value < 5) return "bg-orange-900";
      if (value < 10) return "bg-orange-700";
      if (value < 20) return "bg-orange-500";
      return "bg-orange-400";
    };

    // Group dates by month
    const months = {};
    allDates.forEach((date) => {
      const monthYear = date.toLocaleString("default", { month: "short", year: "numeric" });
      if (!months[monthYear]) {
        months[monthYear] = [];
      }
      months[monthYear].push(date);
    });

    const monthEntries = Object.entries(months);

    return (
      <div className="grid grid-cols-2 gap-5">
        {monthEntries.map(([month, dates]) => (
          <div key={month} className="flex flex-col items-center">
            <h5 className="text-orange-300/70 text-xs mb-2">{month}</h5>
            <div className="grid grid-cols-7 gap-1">
              {dates.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                const value = activityMap[dateStr] || 0;
                return (
                  <div
                    key={dateStr}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(value)} relative group`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 border border-orange-600/30 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                      <div className="font-medium">{date.toLocaleDateString()}</div>
                      <div className="text-orange-300">{value} submissions</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderActivity = () => (
    <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
      <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-orange-500" />
        Activity Calendar (Last 6 Months)
      </h4>
      <div className="p-4">{renderHeatMap()}</div>
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
        <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <FaMedal className="text-orange-500" />
          Ranking & Stats
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Acceptance Rate</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.acceptanceRate}%</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Ranking</span>
            <span className="text-green-400 font-bold text-lg">#{stats.ranking}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Contribution Points</span>
            <span className="text-blue-400 font-bold text-lg">{stats.contributionPoints}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Reputation</span>
            <span className="text-purple-400 font-bold text-lg">{stats.reputation}</span>
          </div>
        </div>
      </div>
      <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
        <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Fa500Px className="text-orange-500" />
          Problem Stats
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Total Solved</span>
            <span className="text-yellow-400 font-bold text-lg">{stats.totalSolved}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Ranking</span>
            <span className="text-green-400 font-bold text-lg">{stats.easySolved}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Contribution Points</span>
            <span className="text-blue-400 font-bold text-lg">{stats.mediumSolved}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
            <span className="text-gray-300">Reputation</span>
            <span className="text-purple-400 font-bold text-lg">{stats.hardSolved}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-orange-800/30 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg shadow-lg">
            <SiLeetcode className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white">LeetCode</h3>
        </div>
      </div>
      {renderTabs()}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "activity" && renderActivity()}
    </div>
  );
}
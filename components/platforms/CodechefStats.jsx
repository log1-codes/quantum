"use client";
import { useState } from 'react';
import { SiCodechef } from "react-icons/si";
import { FaStar, FaTrophy, FaGlobeAmericas, FaChartLine, FaCalendarAlt, FaMedal } from "react-icons/fa";

export default function CodeChefStats({ stats }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!stats) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-orange-800/30 p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <SiCodechef className="text-orange-500 text-3xl" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent">CodeChef</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
            <SiCodechef className="text-orange-500/50 text-3xl" />
          </div>
          <p className="text-orange-100 font-medium text-lg">CodeChef username not set</p>
          <p className="text-zinc-400 text-sm max-w-sm text-center">
            Please update your profile with your CodeChef username to see your statistics
          </p>
          <button className="mt-4 px-6 py-2 bg-orange-600 hover:bg-orange-500 transition-colors rounded-full text-white font-medium">
            Update Profile
          </button>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating) => {
    if (rating >= 2500) return "text-red-500";
    if (rating >= 2200) return "text-orange-500";
    if (rating >= 2000) return "text-yellow-500";
    if (rating >= 1800) return "text-purple-500";
    if (rating >= 1600) return "text-blue-500";
    if (rating >= 1400) return "text-green-500";
    return "text-gray-500";
  };

  const renderHeatMap = () => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const allDates = [];
    const currentDate = new Date(sixMonthsAgo);
    while (currentDate <= today) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const activityMap = {};
    stats.heatMap.forEach((day) => {
      activityMap[day.date] = day.value;
    });

    const getIntensityColor = (value) => {
      if (!value) return "bg-zinc-800";
      if (value < 5) return "bg-orange-900";
      if (value < 10) return "bg-orange-700";
      if (value < 20) return "bg-orange-500";
      return "bg-orange-400";
    };

    const months = {};
    allDates.forEach((date) => {
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!months[monthYear]) {
        months[monthYear] = [];
      }
      months[monthYear].push(date);
    });

    const monthEntries = Object.entries(months);

    return (
      <div className="flex flex-wrap gap-5 justify-between">
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

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl border border-orange-800/30 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg shadow-lg">
            <SiCodechef className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-white">CodeChef</h3>
        </div>
        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-700 to-orange-900 text-white shadow-md">
          <div className="flex items-center gap-2">
            <div className={`${getRatingColor(stats.currentRating)} font-bold`}>{stats.currentRating}</div>
            <div className="text-orange-300 text-sm">Rating</div>
          </div>
        </div>
      </div>

      {renderTabs()}
      
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <FaMedal className="text-orange-500" />
              Ranking & Stats
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <FaChartLine className="text-yellow-400" />
                  </div>
                  <span className="text-gray-300">Current Rating</span>
                </div>
                <span className="text-yellow-400 font-bold text-lg">
                  {stats.currentRating}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <FaTrophy className="text-green-400" />
                  </div>
                  <span className="text-gray-300">Highest Rating</span>
                </div>
                <span className="text-green-400 font-bold text-lg">
                  {stats.highestRating}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <FaGlobeAmericas className="text-blue-400" />
                  </div>
                  <span className="text-gray-300">Global Rank</span>
                </div>
                <span className="text-blue-400 font-bold text-lg">
                  #{stats.globalRank}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <FaGlobeAmericas className="text-purple-400" />
                  </div>
                  <span className="text-gray-300">Country Rank</span>
                </div>
                <span className="text-purple-400 font-bold text-lg">
                  #{stats.countryRank}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center">
                  <FaStar className="text-white" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Stars</div>
                  <div className="text-yellow-400 font-bold text-2xl">
                    {stats.stars}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
              <div className="flex-shrink-0">
                {stats.countryFlag ? (
                  <img 
                    src={stats.countryFlag} 
                    alt="Country flag" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-zinc-700" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                    <FaGlobeAmericas className="text-zinc-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-orange-500" />
              Activity Calendar (Last 6 Months)
            </h4>
            <div className="p-4">{renderHeatMap()}</div>
          </div>
          
          <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
            <h4 className="text-lg font-medium text-white mb-4">Submission Stats</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Problems Solved", value: stats.problemsSolved || 156, color: "bg-green-500" },
                { label: "Submissions", value: stats.submissions || 235, color: "bg-blue-500" },
                { label: "Acceptance Rate", value: `${stats.acceptanceRate || 68}%`, color: "bg-purple-500" },
                { label: "Contest Attended", value: stats.contestsAttended || 12, color: "bg-orange-500" }
              ].map((item, idx) => (
                <div key={idx} className="bg-zinc-800/50 rounded-lg p-4 text-center">
                  <div className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-2`}></div>
                  <div className="text-white text-xl font-bold">{item.value}</div>
                  <div className="text-zinc-400 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contests' && stats.ratingData && stats.ratingData.length > 0 && (
        <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-700/50">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <FaTrophy className="text-orange-500" />
            Recent Contests
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-zinc-400 text-sm border-b border-zinc-700/50">
                <tr>
                  <th className="text-left py-3 px-4">Contest</th>
                  <th className="text-center py-3">Rating</th>
                  <th className="text-center py-3">Rank</th>
                  <th className="text-right py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.ratingData.map((contest, idx) => (
                  <tr
                    key={contest.code || idx}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-300 font-medium">{contest.name}</td>
                    <td className="py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-zinc-800" style={{ color: contest.color || "#f59e0b" }}>
                        {contest.rating}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-blue-400 font-medium">#{contest.rank}</span>
                    </td>
                    <td className="py-4 text-right px-4 text-gray-400">
                      {new Date(contest.end_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
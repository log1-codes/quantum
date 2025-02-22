"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/platforms/stats/all");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
    else{
        setLoading(false);
    }
  }, [session]);

  const renderLoginPrompt = ()=>(
    <div className="bg-[#0a0a0a] rounded-lg p-6 text-center">
    <h2 className="text-2xl font-bold text-white">Welcome!</h2>
    <p className="text-gray-400 mt-4">Please log in or sign up to view your coding stats.</p>
    <a href="/api/auth/signin" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
      Log In / Sign Up
    </a>
  </div>
  )

  const renderLeetCodeStats = () => {
    if (!stats?.leetcode) {
      return (
        <div className="bg-[#0a0a0a] rounded-lg p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 relative z-10">
            <SiLeetcode className="text-[#FFA116] text-3xl" />
            <h2 className="text-2xl font-bold text-white">LeetCode</h2>
          </div>
          <p className="text-gray-400 mt-4 relative z-10">
            No LeetCode stats available
          </p>
        </div>
      );
    }

    const {
      totalSolved,
      totalQuestions,
      easySolved,
      totalEasy,
      mediumSolved,
      totalMedium,
      hardSolved,
      totalHard,
      acceptanceRate,
      ranking,
      contributionPoints,
      reputation,
      submissionCalendar,
    } = stats.leetcode;

    const renderProgressCircle = (solved, total, color) => {
      const percentage = total > 0 ? (solved / total) * 100 : 0;
      return (
        <div className="relative flex items-center justify-center w-32 h-32">
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
              stroke={color}
              strokeWidth="10"
              strokeDasharray={`${percentage * 2.83} ${
                283 - percentage * 2.83
              }`}
              strokeDashoffset="70.75"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-white">{solved}</p>
            <p className="text-sm text-gray-400">/ {total}</p>
          </div>
        </div>
      );
    };

    const renderSubmissionCalendar = () => {
      const submissionCalendar = stats?.leetcode?.submissionCalendar || {};
      const today = new Date();
      const endDate = new Date(today);
      const startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      const getContributionStyle = (count) => {
        if (!count) return "bg-[#1a1a1a]";
        if (count <= 3) return "bg-[#0e4429]";
        if (count <= 6) return "bg-[#006d32]";
        if (count <= 9) return "bg-[#26a641]";
        return "bg-[#39d353]";
      };

      const submissionMap = {};
      Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
        const date = new Date(Number.parseInt(timestamp) * 1000);
        const dateStr = date.toISOString().split("T")[0];
        submissionMap[dateStr] = count;
      });

      const weeks = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const week = [];
        for (let i = 0; i < 7; i++) {
          const dateStr = currentDate.toISOString().split("T")[0];
          const count = submissionMap[dateStr] || 0;
          week.push({
            date: new Date(currentDate),
            count: count,
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
      }

      const totalSubmissions = Object.values(submissionCalendar).reduce(
        (a, b) => a + b,
        0
      );

      return (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-200 text-lg">
              {totalSubmissions} submissions in the last year
            </span>
          </div>
          <div className="w-full overflow-x-auto pb-4">
            <div className="inline-flex gap-2 min-w-full">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div key={dayIndex} className="relative group">
                      <div
                        className={`
                          w-3 h-3 
                          ${getContributionStyle(day.count)} 
                          rounded-sm 
                          cursor-pointer 
                          hover:ring-2 hover:ring-white hover:ring-opacity-50
                          transition-all duration-150
                        `}
                      >
                        {/* Tooltip */}
                        <div
                          className={`
                            absolute 
                            bottom-full 
                            left-1/2 
                            transform 
                            -translate-x-1/2 
                            mb-2
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            duration-200
                            pointer-events-none
                            z-[9999]
                            whitespace-nowrap
                          `}
                          style={{
                            filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                          }}
                        >
                          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2">
                            <div>
                              {day.date.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="font-bold">
                              {day.count} submissions
                            </div>
                            <div
                              className="absolute left-1/2 bottom-0 
                              transform -translate-x-1/2 translate-y-full"
                              style={{
                                borderLeft: "6px solid transparent",
                                borderRight: "6px solid transparent",
                                borderTop: "6px solid rgb(17, 24, 39)", // matches bg-gray-900
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-lg p-8 relative overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <SiLeetcode className="text-[#FFA116] text-4xl" />
            <h2 className="text-3xl font-bold text-white">LeetCode</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <p className="text-gray-400">Acceptance Rate</p>
                <p className="text-2xl font-bold text-white">
                  {acceptanceRate}%
                </p>
              </div>
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <p className="text-gray-400">Ranking</p>
                <p className="text-2xl font-bold text-white">{ranking}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <p className="text-gray-400">Contribution Points</p>
                <p className="text-2xl font-bold text-white">
                  {contributionPoints}
                </p>
              </div>
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <p className="text-gray-400">Reputation</p>
                <p className="text-2xl font-bold text-white">{reputation}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-medium text-white mb-4">Easy</h3>
              {renderProgressCircle(easySolved, totalEasy, "#00b8a3")}
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-medium text-white mb-4">Medium</h3>
              {renderProgressCircle(mediumSolved, totalMedium, "#ffc01e")}
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-medium text-white mb-4">Hard</h3>
              {renderProgressCircle(hardSolved, totalHard, "#ff375f")}
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-medium text-white mb-4">Total </h3>
              {renderProgressCircle(totalSolved, totalQuestions, "#2516d3")}
            </div>
          </div>
          {renderSubmissionCalendar()}
        </div>
      </div>
    );
  };

  // const renderGitHubStats = () => {
  //   if (!stats?.github) {
  //     return (
  //       <div className="bg-[#0a0a0a] rounded-lg p-6 relative overflow-hidden">
  //         <div className="flex items-center gap-2 relative z-10">
  //           <SiGithub className="text-white text-3xl" />
  //           <h2 className="text-2xl font-bold text-white">GitHub</h2>
  //         </div>
  //         <p className="text-gray-400 mt-4 relative z-10">
  //           No GitHub stats available
  //         </p>
  //       </div>
  //     );
  //   }

  //   const {
  //     user = {},
  //     repos = [],
  //     followers = [],
  //     following = [],
  //     starred = [],
  //     gists = [],
  //     events = [],
  //     orgs = [],
  //     receivedEvents = [],
  //     keys = [],
  //     blocked = [],
  //     subscriptions = [],
  //   } = stats.github;

  //   return (
  //     <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-lg p-8 relative overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl">
  //       <div className="relative z-10">
  //         {/* Header */}
  //         <div className="flex items-center gap-4 mb-6">
  //           <div className="flex items-center gap-4">
  //             <img
  //               src={user.avatar_url}
  //               alt={user.login}
  //               className="w-16 h-16 rounded-full border-2 border-gray-700"
  //             />
  //             <div>
  //               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
  //                 <SiGithub className="text-white" />
  //                 {user.name || user.login}
  //               </h2>
  //               <p className="text-gray-400">@{user.login}</p>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Quick Stats */}
  //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  //           <div className="bg-black bg-opacity-30 rounded-lg p-4">
  //             <div className="flex items-center gap-2 text-gray-400 mb-1">
  //               <FaUser />
  //               <span>Followers</span>
  //             </div>
  //             <p className="text-2xl font-bold text-white">
  //               {followers.length}
  //             </p>
  //           </div>
  //           <div className="bg-black bg-opacity-30 rounded-lg p-4">
  //             <div className="flex items-center gap-2 text-gray-400 mb-1">
  //               <FaUser  />
  //               <span>Following</span>
  //             </div>
  //             <p className="text-2xl font-bold text-white">
  //               {following.length}
  //             </p>
  //           </div>
  //           <div className="bg-black bg-opacity-30 rounded-lg p-4">
  //             <div className="flex items-center gap-2 text-gray-400 mb-1">
  //               <FaBook />
  //               <span>Repositories</span>
  //             </div>
  //             <p className="text-2xl font-bold text-white">{repos.length}</p>
  //           </div>
  //           <div className="bg-black bg-opacity-30 rounded-lg p-4">
  //             <div className="flex items-center gap-2 text-gray-400 mb-1">
  //               <FaStar />
  //               <span>Starred</span>
  //             </div>
  //             <p className="text-2xl font-bold text-white">{starred.length}</p>
  //           </div>
  //         </div>

  //         {/* Detailed Stats */}
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           {/* Recent Activity */}
  //           <div className="bg-black bg-opacity-30 rounded-lg p-6">
  //             <h3 className="text-lg font-medium text-white mb-4">
  //               Recent Activity
  //             </h3>
  //             <div className="space-y-4">
  //               {Array.isArray(events) &&
  //                 events.slice(0, 5).map((event, index) => (
  //                   <div
  //                     key={index}
  //                     className="flex items-center gap-3 text-sm"
  //                   >
  //                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
  //                     <span className="text-gray-400">
  //                       {event.type.replace("Event", "")}
  //                     </span>
  //                     <span className="text-white">{event.repo?.name}</span>
  //                   </div>
  //                 ))}
  //             </div>
  //           </div>

  //           {/* Organizations */}
  //           <div className="bg-black bg-opacity-30 rounded-lg p-6">
  //             <h3 className="text-lg font-medium text-white mb-4">
  //               Organizations ({orgs.length})
  //             </h3>
  //             <div className="flex flex-wrap gap-3">
  //               {Array.isArray(orgs) &&
  //                 orgs.map((org, index) => (
  //                   <div
  //                     key={index}
  //                     className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1"
  //                   >
  //                     <img
  //                       src={org.avatar_url}
  //                       alt={org.login}
  //                       className="w-4 h-4 rounded-full"
  //                     />
  //                     <span className="text-white text-sm">{org.login}</span>
  //                   </div>
  //                 ))}
  //             </div>
  //           </div>

  //           {/* Top Repositories */}
  //           <div className="bg-black bg-opacity-30 rounded-lg p-6">
  //             <h3 className="text-lg font-medium text-white mb-4">
  //               Top Repositories
  //             </h3>
  //             <div className="space-y-4">
  //               {Array.isArray(repos) &&
  //                 repos
  //                   .sort((a, b) => b.stargazers_count - a.stargazers_count)
  //                   .slice(0, 5)
  //                   .map((repo, index) => (
  //                     <div
  //                       key={index}
  //                       className="flex items-center justify-between"
  //                     >
  //                       <div className="flex items-center gap-2">
  //                         <BiGitRepoForked className="text-gray-400" />
  //                         <span className="text-white">{repo.name}</span>
  //                       </div>
  //                       <div className="flex items-center gap-4">
  //                         <span className="text-gray-400 text-sm flex items-center gap-1">
  //                           <FaStar className="text-yellow-500" />
  //                           {repo.stargazers_count}
  //                         </span>
  //                         <span className="text-gray-400 text-sm flex items-center gap-1">
  //                           <BiGitRepoForked className="text-blue-500" />
  //                           {repo.forks_count}
  //                         </span>
  //                       </div>
  //                     </div>
  //                   ))}
  //             </div>
  //           </div>

  //           {/* Additional Stats */}
  //           <div className="bg-black bg-opacity-30 rounded-lg p-6">
  //             <h3 className="text-lg font-medium text-white mb-4">
  //               Additional Stats
  //             </h3>
  //             <div className="space-y-3">
  //               <div className="flex justify-between items-center">
  //                 <span className="text-gray-400">Public Gists</span>
  //                 <span className="text-white">{gists.length}</span>
  //               </div>
  //               <div className="flex justify-between items-center">
  //                 <span className="text-gray-400">Received Events</span>
  //                 <span className="text-white">{receivedEvents.length}</span>
  //               </div>
  //               <div className="flex justify-between items-center">
  //                 <span className="text-gray-400">Account Created</span>
  //                 <span className="text-white">
  //                   {new Date(user.created_at).toLocaleDateString("en-US", {
  //                     month: "short",
  //                     day: "numeric",
  //                     year: "numeric",
  //                   })}
  //                 </span>
  //               </div>
  //               <div className="flex justify-between items-center">
  //                 <span className="text-gray-400">Location</span>
  //                 <span className="text-white">
  //                   {user.location || "Not specified"}
  //                 </span>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  const renderCodeforcesStats = () => {
    if (!stats?.codeforces) {
      return (
        <div className="bg-[#111111] rounded-xl border border-zinc-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SiCodeforces className="text-blue-500 text-2xl" />
              <h3 className="text-xl font-medium text-white">Codeforces</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-zinc-800/50 text-sm">
              <span className="text-gray-400">Rating </span>
              <span className="text-white">N/A</span>
            </div>
          </div>
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-400">Codeforces username not set</p>
            <p className="text-sm text-gray-600 mt-2">
              Please update your profile with your Codeforces username
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#111111] rounded-xl border border-zinc-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SiCodeforces className="text-blue-500 text-2xl" />
            <h3 className="text-xl font-medium text-white">Codeforces</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-zinc-800/50 text-sm">
            <span className="text-gray-400">Rating </span>
            <span className="text-white font-medium">
              {stats.codeforces.rating}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Handle</span>
              <span className="text-white font-medium">
                {stats.codeforces.handle}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Rank</span>
              <span className="text-green-400 font-medium">
                {stats.codeforces.rank}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Max Rating</span>
              <span className="text-blue-400 font-medium">
                {stats.codeforces.maxRating}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Max Rank</span>
              <span className="text-purple-400 font-medium">
                {stats.codeforces.maxRank}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Contests</span>
              <span className="text-yellow-400 font-medium">
                {stats.codeforces.contests}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Contributions</span>
              <span className="text-red-400 font-medium">
                {stats.codeforces.contributions}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Friend of Count</span>
              <span className="text-orange-400 font-medium">
                {stats.codeforces.friendOfCount}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Last Online</span>
              <span className="text-blue-400 font-medium">
                {new Date(
                  stats.codeforces.lastOnlineTimeSeconds * 1000
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        {stats.codeforces.recentContests &&
          stats.codeforces.recentContests.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-medium mb-4">Recent Contests</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-gray-400 text-sm">
                    <tr>
                      <th className="text-left py-2">Contest</th>
                      <th className="text-center py-2">Rank</th>
                      <th className="text-center py-2">Old Rating</th>
                      <th className="text-right py-2">New Rating</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {stats.codeforces.recentContests.map((contest, index) => (
                      <tr key={index} className="border-t border-zinc-800/50">
                        <td className="py-3 text-gray-300">
                          {contest.contestName}
                        </td>
                        <td className="py-3 text-center text-yellow-400">
                          #{contest.rank}
                        </td>
                        <td className="py-3 text-center text-blue-400">
                          {contest.oldRating}
                        </td>
                        <td className="py-3 text-right text-green-400">
                          {contest.newRating}
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
  };

  const renderCodeChefStats = () => {
    if (!stats?.codechef) {
      return (
        <div className="bg-[#111111] rounded-xl border border-zinc-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SiCodechef className="text-[#5B4638] text-2xl" />
              <h3 className="text-xl font-medium text-white">CodeChef</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-zinc-800/50 text-sm">
              <span className="text-gray-400">Rating </span>
              <span className="text-white">N/A</span>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">CodeChef username not set</p>
            <p className="text-sm text-gray-600 mt-2">
              Please update your profile with your CodeChef username
            </p>
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

    return (
      <div className="bg-[#111111] rounded-xl border border-zinc-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <SiCodechef className="text-[#5B4638] text-2xl" />
              <img
                src={stats.codechef.countryFlag || "/placeholder.svg"}
                alt={stats.codechef.countryName}
                className="w-4 h-4 absolute -bottom-1 -right-1"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-medium text-white">
                  {stats.codechef.name}
                </h3>
                <span className="text-yellow-400">{stats.codechef.stars}</span>
              </div>
              <p className="text-sm text-gray-400">
                {stats.codechef.countryName} • Global Rank #
                {stats.codechef.globalRank}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="px-3 py-1 rounded-full bg-zinc-800/50 text-sm">
              <span className="text-gray-400">Rating </span>
              <span className={getRatingColor(stats.codechef.currentRating)}>
                {stats.codechef.currentRating}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Current Rating</span>
              <span className="text-yellow-400 font-medium">
                {stats.codechef.currentRating}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Highest Rating</span>
              <span className="text-green-400 font-medium">
                {stats.codechef.highestRating}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Global Rank</span>
              <span className="text-blue-400 font-medium">
                #{stats.codechef.globalRank}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Country Rank</span>
              <span className="text-purple-400 font-medium">
                #{stats.codechef.countryRank}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-medium">Activity Calendar</h4>
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1">
                  {stats.codechef.heatMap.map((day) => {
                    const intensity =
                      day.value /
                      Math.max(...stats.codechef.heatMap.map((d) => d.value));
                    let bgColor = "bg-zinc-800";
                    let intensityLabel = "No activity";

                    if (intensity > 0) {
                      if (intensity < 0.25) {
                        bgColor = "bg-green-900";
                        intensityLabel = "Light activity";
                      } else if (intensity < 0.5) {
                        bgColor = "bg-green-700";
                        intensityLabel = "Medium activity";
                      } else if (intensity < 0.75) {
                        bgColor = "bg-green-500";
                        intensityLabel = "High activity";
                      } else {
                        bgColor = "bg-green-400";
                        intensityLabel = "Very high activity";
                      }
                    }

                    return (
                      <div
                        key={day.date}
                        className={`w-4 h-4 rounded-sm ${bgColor} relative group`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div>{new Date(day.date).toLocaleDateString()}</div>
                          <div>{day.value} points</div>
                          <div>{intensityLabel}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="text-gray-400">Activity Level:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-zinc-800"></div>
                    <span className="text-gray-400">None</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-green-900"></div>
                    <span className="text-gray-400">Light</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-green-700"></div>
                    <span className="text-gray-400">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                    <span className="text-gray-400">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                    <span className="text-gray-400">Very High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {stats.codechef.ratingData && stats.codechef.ratingData.length > 0 && (
          <div className="mt-8">
            <h4 className="text-white font-medium mb-4">Recent Contests</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-gray-400 text-sm">
                  <tr>
                    <th className="text-left py-2">Contest</th>
                    <th className="text-center py-2">Rating</th>{" "}
                    <th className="text-center py-2">Rank</th>
                    <th className="text-right py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats.codechef.ratingData.map((contest) => (
                    <tr
                      key={contest.code}
                      className="border-t border-zinc-800/50"
                    >
                      <td className="py-3 text-gray-300">{contest.name}</td>
                      <td className="py-3 text-center">
                        <span style={{ color: contest.color }}>
                          {contest.rating}
                        </span>
                      </td>
                      <td className="py-3 text-center text-blue-400">
                        #{contest.rank}
                      </td>
                      <td className="py-3 text-right text-gray-400">
                        {new Date(contest.end_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
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
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-2xl font-bold text-white mb-8">Coding Profiles</h1>
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your coding stats...</p>
            </div>
          ) : session ? (
            <>
              {renderLeetCodeStats()}
              {/* {renderGitHubStats()} */}
              {renderCodeforcesStats()}
              {renderCodeChefStats()}
            </>
          ) : (
            renderLoginPrompt()
          )}
        </div>
      </div>
    </div>
  )
}

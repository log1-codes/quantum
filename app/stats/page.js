"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { SiLeetcode , SiCodeforces , SiCodechef} from "react-icons/si";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  }, [session]);

  const renderLeetCodeStats = () => {
    if (!stats?.leetcode) {
      return (
        <div className="bg-[#111111] rounded-lg border border-zinc-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SiLeetcode className="text-[#FFA116] text-2xl" />
              <h2 className="text-xl font-medium text-white">LeetCode</h2>
            </div>
            <div className="bg-zinc-800/50 px-3 py-1 rounded-full">
              <span className="text-gray-400">Rating: N/A</span>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">LeetCode username not set</p>
            <p className="text-sm text-gray-600 mt-2">
              Please update your profile with your LeetCode username
            </p>
          </div>
        </div>
      );
    }

    const {
      username,
      name,
      avatar,
      ranking,
      reputation,
      gitHub,
      twitter,
      linkedIN,
      website,
      country,
      solvedProblems,
      badgesData,
      contestData,
    } = stats.leetcode;

    const totalSolved = solvedProblems.solvedProblem || 0;
    const easySolved = solvedProblems.easySolved || 0;
    const mediumSolved = solvedProblems.mediumSolved || 0;
    const hardSolved = solvedProblems.hardSolved || 0;

    // Sort contest data by date
    const sortedContests = [...contestData.contestParticipation].sort((a, b) => 
      a.contest.startTime - b.contest.startTime
    );

    const chartData = {
      labels: sortedContests.map(contest => contest.contest.title),
      datasets: [
        {
          label: 'Contest Rating',
          data: sortedContests.map(contest => contest.rating),
          borderColor: '#FFA116',
          backgroundColor: 'rgba(255, 161, 22, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: sortedContests.map(contest => 
            contest.trendDirection === 'UP' ? '#22c55e' : '#ef4444'
          ),
          pointBorderColor: '#FFF',
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(17, 17, 17, 0.9)',
          titleColor: '#FFF',
          bodyColor: '#FFA116',
          borderColor: '#333',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const contest = sortedContests[context.dataIndex];
              return [
                `Rating: ${contest.rating.toFixed(2)}`,
                `Rank: ${contest.ranking}`,
                `Solved: ${contest.problemsSolved}/${contest.totalProblems}`,
              ];
            },
          },
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#888',
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#888',
            maxRotation: 45,
            minRotation: 45,
          }
        }
      },
    };

    return (
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#111111] rounded-lg border border-zinc-800/50 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img src={avatar} alt={name} className="w-24 h-24 rounded-full border-2 border-[#FFA116]" />
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-medium text-white">{name}</h2>
                <p className="text-gray-400">@{username}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-zinc-800/30 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Contest Rating</p>
                    <p className="text-[#FFA116] font-medium">{contestData.contestRating.toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-800/30 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Global Ranking</p>
                    <p className="text-white font-medium">#{contestData.contestGlobalRanking}</p>
                  </div>
                  <div className="bg-zinc-800/30 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Top Percentage</p>
                    <p className="text-green-400 font-medium">{contestData.contestTopPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-800/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Country</p>
                  <p className="text-white font-medium">{country}</p>
                </div>
                <div className="bg-zinc-800/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Ranking</p>
                  <p className="text-white font-medium">#{ranking}</p>
                </div>
                <div className="bg-zinc-800/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Reputation</p>
                  <p className="text-white font-medium">{reputation}</p>
                </div>
                <div className="bg-zinc-800/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Total Solved</p>
                  <p className="text-white font-medium">{totalSolved}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {gitHub && (
                  <a href={gitHub} className="text-gray-400 hover:text-white transition-colors">
                    GitHub
                  </a>
                )}
                {twitter && (
                  <a href={twitter} className="text-gray-400 hover:text-white transition-colors">
                    Twitter
                  </a>
                )}
                {linkedIN && (
                  <a href={linkedIN} className="text-gray-400 hover:text-white transition-colors">
                    LinkedIn
                  </a>
                )}
                {website?.length > 0 && (
                  <a href={website[0]} className="text-gray-400 hover:text-white transition-colors">
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Problem Solving Stats */}
          <div className="bg-[#111111] rounded-lg border border-zinc-800/50 p-6">
            <h3 className="text-xl font-medium text-white mb-4">Problem Solving Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
                <span className="text-gray-400">Easy</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(easySolved / totalSolved) * 100}%` }}
                    />
                  </div>
                  <span className="text-green-500 font-medium">{easySolved}</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
                <span className="text-gray-400">Medium</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${(mediumSolved / totalSolved) * 100}%` }}
                    />
                  </div>
                  <span className="text-yellow-500 font-medium">{mediumSolved}</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
                <span className="text-gray-400">Hard</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(hardSolved / totalSolved) * 100}%` }}
                    />
                  </div>
                  <span className="text-red-500 font-medium">{hardSolved}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-[#111111] rounded-lg border border-zinc-800/50 p-6">
            <h3 className="text-xl font-medium text-white mb-4">Badges</h3>
            <div className="grid grid-cols-3 gap-4">
              {badgesData.badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center justify-center bg-zinc-800/30 p-4 rounded-lg">
                  <img src={badge.icon} alt={badge.displayName} className="w-16 h-16 mb-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contest Rating Chart */}
        <div className="bg-[#111111] rounded-lg border border-zinc-800/50 p-6">
          <h3 className="text-xl font-medium text-white mb-4">Contest Rating Progression</h3>
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-[200px] w-full bg-zinc-900 animate-pulse rounded-lg" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-[300px] bg-zinc-900 animate-pulse rounded-lg" />
          <div className="h-[300px] bg-zinc-900 animate-pulse rounded-lg" />
        </div>
        <div className="h-[400px] bg-zinc-900 animate-pulse rounded-lg" />
      </div>
    );
  }

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
            <span className="text-white font-medium">{stats.codeforces.rating}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Handle</span>
              <span className="text-white font-medium">{stats.codeforces.handle}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Rank</span>
              <span className="text-green-400 font-medium">{stats.codeforces.rank}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Max Rating</span>
              <span className="text-blue-400 font-medium">{stats.codeforces.maxRating}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Max Rank</span>
              <span className="text-purple-400 font-medium">{stats.codeforces.maxRank}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Contests</span>
              <span className="text-yellow-400 font-medium">{stats.codeforces.contests}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Contributions</span>
              <span className="text-red-400 font-medium">{stats.codeforces.contributions}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Friend of Count</span>
              <span className="text-orange-400 font-medium">{stats.codeforces.friendOfCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/30">
              <span className="text-gray-400">Last Online</span>
              <span className="text-blue-400 font-medium">
                {new Date(stats.codeforces.lastOnlineTimeSeconds * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        {stats.codeforces.recentContests && stats.codeforces.recentContests.length > 0 && (
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
                      <td className="py-3 text-gray-300">{contest.contestName}</td>
                      <td className="py-3 text-center text-yellow-400">#{contest.rank}</td>
                      <td className="py-3 text-center text-blue-400">{contest.oldRating}</td>
                      <td className="py-3 text-right text-green-400">{contest.newRating}</td>
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
              <span className="text-gray-400 ">Rating </span>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <SiCodechef className="text-[#5B4638] text-2xl" />
              <img
                src={stats.codechef.countryFlag}
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

        {/* Stats Grid */}
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

          {/* Activity Heat Map */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Activity Calendar</h4>
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <div className="space-y-4">
                {/* Activity Grid */}
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

                {/* Legend */}
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

        {/* Recent Contests */}
        {stats.codechef.ratingData && stats.codechef.ratingData.length > 0 && (
          <div className="mt-8">
            <h4 className="text-white font-medium mb-4">Recent Contests</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-gray-400 text-sm">
                  <tr>
                    <th className="text-left py-2">Contest</th>
                    <th className="text-center py-2">Rating</th>
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
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white mb-8">Coding Profiles</h1>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your coding stats...</p>
            </div>
          ) : (
            <>
              {renderLeetCodeStats()}
              {renderCodeforcesStats()}
              {renderCodeChefStats()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
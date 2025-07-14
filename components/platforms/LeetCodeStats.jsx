import { useState } from "react"
import {
  TrendingUp,
  Calendar,
  Medal,
  Target,
  Award,
  Activity,
  BarChart3,
  Hash,
  Code,
  Trophy,
  CheckCircle,
} from "lucide-react"

export default function LeetCodeStats({ stats }) {
  const [activeTab, setActiveTab] = useState("overview")

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
              <Code className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFA116] to-yellow-500 bg-clip-text text-transparent">
              LeetCode
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 flex items-center justify-center backdrop-blur-sm shadow-inner animate-bounce">
              <Code className="text-[#FFA116]/60 text-4xl" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-orange-100 font-semibold text-xl">LeetCode username not set</p>
              <p className="text-zinc-400 text-sm max-w-md">
                Connect your LeetCode profile to unlock detailed statistics, problem solving history, and performance
                insights
              </p>
            </div>
            <button className="mt-6 bg-gradient-to-r from-[#FFA116] to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/25">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "hard":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "from-green-500 to-emerald-500"
      case "medium":
        return "from-yellow-500 to-orange-500"
      case "hard":
        return "from-red-500 to-pink-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const renderHeatMap = () => {
    const today = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(today.getMonth() - 6)

    const allDates = []
    const currentDate = new Date(sixMonthsAgo)
    while (currentDate <= today) {
      allDates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const activityMap = {}
    if (stats.submissionCalendar) {
      Object.entries(stats.submissionCalendar).forEach(([timestamp, count]) => {
        const date = new Date(Number.parseInt(timestamp) * 1000)
        const dateStr = date.toISOString().split("T")[0]
        activityMap[dateStr] = count
      })
    }

    const getIntensityColor = (value) => {
      if (!value) return "bg-zinc-800/20 border-zinc-700/10 backdrop-blur-sm"
      if (value < 5) return "bg-[#FFA116]/20 border-[#FFA116]/40 backdrop-blur-sm shadow-orange-500/10"
      if (value < 10) return "bg-[#FFA116]/50 border-[#FFA116]/70 backdrop-blur-sm shadow-orange-500/20"
      if (value < 20) return "bg-[#FFA116]/80 border-[#FFA116]/90 backdrop-blur-sm shadow-orange-500/30"
      return "bg-[#FFA116] border-[#FFA116] backdrop-blur-sm shadow-orange-500/40"
    }

    const months = {}
    allDates.forEach((date) => {
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
      if (!months[monthYear]) {
        months[monthYear] = []
      }
      months[monthYear].push(date)
    })

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="text-[#FFA116] animate-pulse" />
            Submission Calendar
          </h4>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 5, 10, 15, 20].map((val) => (
                <div key={val} className={`w-3 h-3 rounded-sm border ${getIntensityColor(val)} transition-all duration-300`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {Object.entries(months).map(([month, dates]) => (
            <div key={month} className="flex flex-col items-center space-y-3">
              <h5 className="text-[#FFA116]/80 text-xs font-medium">{month}</h5>
              <div className="grid grid-cols-7 gap-1">
                {dates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0]
                  const value = activityMap[dateStr] || 0
                  return (
                    <div
                      key={dateStr}
                      className={`w-3 h-3 rounded-sm border transition-all duration-300 hover:scale-125 cursor-pointer ${getIntensityColor(value)} relative group shadow-sm`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900/95 border border-[#FFA116]/30 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-xl backdrop-blur-md">
                        <div className="font-medium text-[#FFA116]">{date.toLocaleDateString()}</div>
                        <div className="text-zinc-300">{value} submissions</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
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
        onClick={() => setActiveTab("activity")}
        className={`flex-1 px-4 py-3 font-medium flex items-center justify-center gap-2 rounded-lg transition-all duration-500 transform ${
          activeTab === "activity"
            ? "bg-gradient-to-r from-[#FFA116]/30 to-orange-500/20 text-[#FFA116] border border-[#FFA116]/40 shadow-lg shadow-orange-500/20 scale-105 backdrop-blur-sm"
            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20 hover:scale-102 backdrop-blur-sm"
        }`}
      >
        <Calendar className="w-4 h-4" />
        Activity
      </button>
    </div>
  )

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
              <Hash className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">LeetCode</h3>
              <p className="text-zinc-400 text-sm">Problem Solving Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#FFA116]/20 to-orange-500/10 border border-[#FFA116]/30 text-[#FFA116] font-semibold px-4 py-2 rounded-full text-sm backdrop-blur-sm shadow-lg shadow-orange-500/10 animate-pulse">
              {stats.acceptanceRate}% Accepted
            </div>
          </div>
        </div>

        {renderTabs()}

        {/* Content with smooth transitions */}
        <div className="relative">
          {activeTab === "overview" && (
            <div className="transition-all duration-300 opacity-100 visible">
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Solved", value: stats.totalSolved, color: "from-[#FFA116] to-orange-500", icon: Target },
                    { label: "Acceptance Rate", value: `${stats.acceptanceRate}%`, color: "from-green-500 to-emerald-500", icon: CheckCircle },
                    { label: "Ranking", value: `#${stats.ranking}`, color: "from-blue-500 to-cyan-500", icon: Trophy },
                    { label: "Reputation", value: stats.reputation, color: "from-purple-500 to-pink-500", icon: Award }
                  ].map((stat, index) => {
                    const IconComponent = stat.icon
                    return (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 hover:border-[#FFA116]/40 transition-all duration-500 group rounded-xl p-4 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-orange-500/10 transform hover:scale-105"
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <IconComponent className="text-white w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm">{stat.label}</p>
                            <p className="text-white font-bold text-xl">{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Performance and Breakdown Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 rounded-xl backdrop-blur-sm shadow-lg">
                    <div className="p-6 border-b border-zinc-700/30">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Medal className="text-[#FFA116] w-5 h-5 animate-pulse" />
                        Performance Stats
                      </h4>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        { label: "Acceptance Rate", value: `${stats.acceptanceRate}%`, icon: TrendingUp, color: "text-[#FFA116]" },
                        { label: "Global Ranking", value: `#${stats.ranking}`, icon: Trophy, color: "text-blue-400" },
                        { label: "Contribution Points", value: stats.contributionPoints, icon: Hash, color: "text-green-400" },
                        { label: "Reputation", value: stats.reputation, icon: Award, color: "text-purple-400" }
                      ].map((item, index) => {
                        const IconComponent = item.icon
                        return (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/20 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/50 hover:border-zinc-700/40 transform hover:scale-102"
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className={`${item.color} w-4 h-4`} />
                              <span className="text-zinc-300">{item.label}</span>
                            </div>
                            <span className={`${item.color} font-bold`}>{item.value}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 rounded-xl backdrop-blur-sm shadow-lg">
                    <div className="p-6 border-b border-zinc-700/30">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Target className="text-[#FFA116] w-5 h-5 animate-pulse" />
                        Problem Breakdown
                      </h4>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        { label: "Easy Problems", value: stats.easySolved, color: "from-green-500 to-emerald-500", textColor: "text-green-400" },
                        { label: "Medium Problems", value: stats.mediumSolved, color: "from-yellow-500 to-orange-500", textColor: "text-yellow-400" },
                        { label: "Hard Problems", value: stats.hardSolved, color: "from-red-500 to-pink-500", textColor: "text-red-400" },
                        { label: "Total Solved", value: stats.totalSolved, color: "from-[#FFA116] to-orange-500", textColor: "text-[#FFA116]", icon: Target }
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/20 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/50 hover:border-zinc-700/40 transform hover:scale-102"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon ? (
                              <Target className={`${item.textColor} w-4 h-4`} />
                            ) : (
                              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color} shadow-sm`} />
                            )}
                            <span className="text-zinc-300">{item.label}</span>
                          </div>
                          <span className={`${item.textColor} font-bold`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Visualization */}
                <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 rounded-xl p-6 backdrop-blur-sm shadow-lg">
                  <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="text-[#FFA116] w-5 h-5 animate-pulse" />
                    Problem Solving Progress
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Easy", solved: stats.easySolved, total: 800, color: "green", bg: "from-green-500 to-emerald-500" },
                      { label: "Medium", solved: stats.mediumSolved, total: 1600, color: "yellow", bg: "from-yellow-500 to-orange-500" },
                      { label: "Hard", solved: stats.hardSolved, total: 700, color: "red", bg: "from-red-500 to-pink-500" }
                    ].map((item, index) => {
                      const percentage = Math.min((item.solved / item.total) * 100, 100)
                      return (
                        <div key={item.label} className="text-center space-y-3 transform hover:scale-105 transition-all duration-300">
                          <div className="relative w-24 h-24 mx-auto">
                            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-zinc-700"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={`${percentage * 2.51} 251`}
                                className={`${getDifficultyColor(item.label.toLowerCase())} transition-all duration-1000`}
                                strokeLinecap="round"
                                style={{
                                  strokeDasharray: `${percentage * 2.51} 251`,
                                  animation: `drawCircle 2s ease-out ${index * 0.3}s both`
                                }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-lg font-bold ${getDifficultyColor(item.label.toLowerCase())}`}>
                                {item.solved}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className={`font-semibold ${getDifficultyColor(item.label.toLowerCase())}`}>{item.label}</p>
                            <p className="text-zinc-400 text-sm">{item.solved} / {item.total}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="transition-all duration-300 opacity-100 visible">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 rounded-xl p-6 backdrop-blur-sm shadow-lg">
                  {renderHeatMap()}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Submissions",
                      value: Object.values(stats.submissionCalendar || {}).reduce((a, b) => a + b, 0),
                      color: "from-[#FFA116] to-orange-500",
                      icon: TrendingUp,
                    },
                    {
                      label: "Problems Solved",
                      value: stats.totalSolved,
                      color: "from-green-500 to-emerald-500",
                      icon: CheckCircle,
                    },
                    {
                      label: "Acceptance Rate",
                      value: `${stats.acceptanceRate}%`,
                      color: "from-blue-500 to-cyan-500",
                      icon: BarChart3,
                    },
                    {
                      label: "Global Ranking",
                      value: `#${stats.ranking}`,
                      color: "from-purple-500 to-pink-500",
                      icon: Trophy,
                    },
                  ].map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/30 hover:border-[#FFA116]/40 transition-all duration-500 group rounded-xl p-4 text-center backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-orange-500/10 transform hover:scale-105"
                        style={{animationDelay: `${idx * 100}ms`}}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <IconComponent className="text-white w-5 h-5" />
                        </div>
                        <div className="text-white text-xl font-bold mb-1">{item.value}</div>
                        <div className="text-zinc-400 text-sm">{item.label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
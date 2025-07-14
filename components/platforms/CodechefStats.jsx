import { useState } from "react"
import {
  Trophy,
  Star,
  Globe,
  TrendingUp,
  Calendar,
  Medal,
  Target,
  Award,
  Activity,
  BarChart3,
  User,
  MapPin,
  School,
  Hash,
} from "lucide-react"

export default function CodeChefStats({ stats }) {
  const [activeTab, setActiveTab] = useState("Overview")

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Trophy className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              CodeChef
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center backdrop-blur-sm">
              <Trophy className="text-orange-500/60 text-4xl" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-orange-100 font-semibold text-xl">CodeChef username not set</p>
              <p className="text-zinc-400 text-sm max-w-md">
                Connect your CodeChef profile to unlock detailed statistics, contest history, and performance insights
              </p>
            </div>
            <button className="mt-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getRatingColor = (rating) => {
    if (rating >= 2500) return "text-red-400"
    if (rating >= 2200) return "text-orange-400"
    if (rating >= 2000) return "text-yellow-400"
    if (rating >= 1800) return "text-purple-400"
    if (rating >= 1600) return "text-blue-400"
    if (rating >= 1400) return "text-green-400"
    return "text-gray-400"
  }

  const getRatingBadge = (rating) => {
    if (rating >= 2500) return { label: "7★", color: "bg-red-500/20 text-red-400 border-red-500/30" }
    if (rating >= 2200) return { label: "6★", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" }
    if (rating >= 2000) return { label: "5★", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
    if (rating >= 1800) return { label: "4★", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" }
    if (rating >= 1600) return { label: "3★", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" }
    if (rating >= 1400) return { label: "2★", color: "bg-green-500/20 text-green-400 border-green-500/30" }
    return { label: "1★", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" }
  }

  const renderTabs = () => (
    <div className="flex mb-6 bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-1 backdrop-blur-md shadow-inner">
      <button
        onClick={() => setActiveTab("Overview")}
        className={`flex-1 px-4 py-3 font-medium flex items-center justify-center gap-2 rounded-lg transition-all duration-500 transform ${
          activeTab === "Overview"
            ? "bg-gradient-to-r from-[#FFA116]/30 to-orange-500/20 text-[#FFA116] border border-[#FFA116]/40 shadow-lg shadow-orange-500/20 scale-105 backdrop-blur-sm"
            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20 hover:scale-102 backdrop-blur-sm"
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        Overview
      </button>
      <button
        onClick={() => setActiveTab("Contests")}
        className={`flex-1 px-4 py-3 font-medium flex items-center justify-center gap-2 rounded-lg transition-all duration-500 transform ${
          activeTab === "Contests"
            ? "bg-gradient-to-r from-[#FFA116]/30 to-orange-500/20 text-[#FFA116] border border-[#FFA116]/40 shadow-lg shadow-orange-500/20 scale-105 backdrop-blur-sm"
            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20 hover:scale-102 backdrop-blur-sm"
        }`}
      >
        <Trophy className="w-4 h-4" />
        Contests
      </button>
    </div>
  )

  const ratingBadge = getRatingBadge(stats.rating)

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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Trophy className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">CodeChef</h3>
              <p className="text-zinc-400 text-sm">Competitive Programming</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`${ratingBadge.color} border font-semibold px-3 py-1 rounded-full text-sm`}>
              {ratingBadge.label}
            </span>
            <div className="text-right">
              <div className={`${getRatingColor(stats.rating)} font-bold text-2xl`}>{stats.rating}</div>
              <div className="text-zinc-400 text-xs">Current Rating</div>
            </div>
          </div>
        </div>

        {renderTabs()}

        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border border-zinc-700/50 hover:border-orange-500/30 transition-all duration-300 group rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Star className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">Total Stars</p>
                    <p className="text-yellow-400 font-bold text-xl">{stats.totalStars ?? '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border border-zinc-700/50 hover:border-green-500/30 transition-all duration-300 group rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">Problems Solved</p>
                    <p className="text-green-400 font-bold text-xl">{stats.problemsSolved ?? '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-300 group rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Globe className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">Global Rank</p>
                    <p className="text-blue-400 font-bold text-xl">#{stats.globalRank ?? '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border border-zinc-700/50 hover:border-purple-500/30 transition-all duration-300 group rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">Division</p>
                    <p className="text-purple-400 font-bold text-xl">{stats.division ?? '-'}</p>
                  </div>
                </div>
              </div>
              {/* Country Rank */}
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-300 group rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Globe className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">Country Rank</p>
                    <p className="text-blue-400 font-bold text-xl">#{stats.countryRank ?? '-'}</p>
                  </div>
                </div>
              </div>
              {/* Contests Attended */}
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border border-zinc-700/50 hover:border-orange-500/30 transition-all duration-300 group rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">Contests Attended</p>
                    <p className="text-orange-400 font-bold text-xl">{stats.contests ?? '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/50 rounded-xl">
                <div className="p-6 border-b border-zinc-700/50">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User className="text-orange-400 w-5 h-5" />
                    Profile Information
                  </h4>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-blue-400 w-4 h-4" />
                      <span className="text-zinc-300">Country</span>
                    </div>
                    <span className="text-blue-400 font-medium">{stats.country}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                    <div className="flex items-center gap-3">
                      <School className="text-green-400 w-4 h-4" />
                      <span className="text-zinc-300">Institution</span>
                    </div>
                    <span className="text-green-400 font-medium">{stats.institution}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                    <div className="flex items-center gap-3">
                      <Hash className="text-purple-400 w-4 h-4" />
                      <span className="text-zinc-300">Current Rating</span>
                    </div>
                    <span className={`${getRatingColor(stats.rating)} font-bold`}>{stats.rating}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/50 rounded-xl">
                <div className="p-6 border-b border-zinc-700/50">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Award className="text-orange-400 w-5 h-5" />
                    Achievements
                  </h4>
                </div>
                <div className="p-6">
                  {stats.badges && Object.keys(stats.badges).length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(stats.badges).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-3 text-center hover:border-orange-500/30 transition-colors duration-300"
                        >
                          <Medal className="text-orange-400 w-5 h-5 mx-auto mb-2" />
                          <p className="text-orange-400 text-xs font-medium capitalize mb-1">{key.replace(/_/g, " ")}</p>
                          <p className="text-yellow-400 font-semibold text-sm">{value.replace("_", " ")}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Medal className="text-zinc-600 w-12 h-12 mx-auto mb-3" />
                      <p className="text-zinc-400">No badges earned yet</p>
                      <p className="text-zinc-500 text-sm">Keep participating to earn achievements!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Contests" && (
          <div className="flex justify-center items-center min-h-[200px]">
            {stats.contests && stats.contests > 0 ? (
              <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-400/30 rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-md mx-auto">
                <Trophy className="text-orange-400 w-12 h-12 mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-orange-400 mb-2">Contests Attended</h2>
                <div className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">{stats.contests}</div>
                <p className="text-zinc-400 text-base text-center">This is the total number of CodeChef contests you have participated in.</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 border border-zinc-700/50 rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-md mx-auto">
                <Trophy className="text-zinc-600 w-12 h-12 mb-4" />
                <h3 className="text-zinc-300 text-lg font-semibold mb-2">No Contest Data</h3>
                <p className="text-zinc-500 text-center">Contest history will appear here once you participate in contests.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

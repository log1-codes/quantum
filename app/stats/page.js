"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LeetCodeStats from "@/components/platforms/LeetCodeStats";
import CodeforcesStats from "@/components/platforms/CodeforcesStats";
import CodechefStats from "@/components/platforms/CodechefStats";
import GeeksForGeeksStats from "@/components/platforms/GeeksForGeeksStats";
import { useStats } from "@/components/StatsContext";

export default function StatsPage() {
  // Use stats and setStats from context
  const { stats, setStats } = useStats();
  const [loading, setLoading] = useState(!stats); // Only loading if no stats in context
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Only fetch if stats are not already cached in context and user is logged in
    if (!stats && session) {
      const fetchStats = async () => {
        setLoading(true);
        try {
          const response = await fetch("/api/platforms/stats/all");
          const data = await response.json();
          setStats(data); // Save to context for future use
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    } else {
      // If stats are already present or user is not logged in, just stop loading
      setLoading(false);
    }
  }, [session, stats, setStats]);

  // Handle visibility on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const renderLoginPrompt = () => (
    <div className="w-full min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500/3 to-orange-500/3 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Code-themed floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-orange-500/20 text-sm font-mono animate-float-code"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            {['{', '}', '[', ']', '(', ')', '<', '>', '//', '&&', '||', '==', '!=', '++', '--'][i % 15]}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 pt-24">
        <div
          className={`w-full max-w-6xl transform transition-all duration-1000 delay-300 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative">
            {/* Animated glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-3xl blur opacity-30 animate-gradient-x"></div>

            {/* Main card */}
            <div className="relative bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 text-center border border-orange-800/30 shadow-2xl">
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.02)_1px,transparent_1px)] bg-[size:24px_24px] rounded-3xl opacity-50"></div>
              
              {/* Enhanced decorative elements */}
              <div className="absolute top-8 left-8 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-8 left-10 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-1000"></div>
              <div className="absolute bottom-8 right-10 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-1500"></div>

              {/* Content */}
              <div className="relative z-10 space-y-8 lg:space-y-12">
                <div className="space-y-6">
                  <h1
                    className={`text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-100 bg-clip-text text-transparent leading-tight transform transition-all duration-1000 delay-500 ${
                      isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                    }`}
                  >
                    Track Your
                  </h1>
                  <h2
                    className={`text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent leading-tight transform transition-all duration-1000 delay-700 ${
                      isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                    }`}
                  >
                    Coding Journey
                  </h2>
                </div>

                <div
                  className={`w-32 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full transform transition-all duration-1000 delay-900 ${
                    isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                ></div>

                <div className="space-y-4">
                  <p
                    className={`text-xl md:text-2xl lg:text-3xl text-zinc-300 leading-relaxed max-w-4xl mx-auto transform transition-all duration-1000 delay-1100 ${
                      isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                    }`}
                  >
                    Monitor your progress across multiple coding platforms.
                  </p>
                  <p
                    className={`text-lg md:text-xl lg:text-2xl text-orange-400 font-semibold leading-relaxed transform transition-all duration-1000 delay-1200 ${
                      isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                    }`}
                  >
                    LeetCode • Codeforces • CodeChef • GeeksforGeeks
                  </p>
                </div>

                {/* Enhanced features showcase */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-16 transform transition-all duration-1000 delay-1300 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                >
                  <div className="group bg-zinc-800/60 rounded-2xl p-6 lg:p-8 border border-orange-800/20 hover:border-orange-600/50 hover:bg-zinc-800/80 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">Unified Dashboard</h3>
                    <p className="text-zinc-400 text-sm lg:text-base leading-relaxed">View all your coding stats in one centralized, beautiful interface</p>
                  </div>

                  <div className="group bg-zinc-800/60 rounded-2xl p-6 lg:p-8 border border-orange-800/20 hover:border-orange-600/50 hover:bg-zinc-800/80 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">Real-time Updates</h3>
                    <p className="text-zinc-400 text-sm lg:text-base leading-relaxed">Stay synchronized with your latest achievements and progress</p>
                  </div>

                  <div className="group bg-zinc-800/60 rounded-2xl p-6 lg:p-8 border border-orange-800/20 hover:border-orange-600/50 hover:bg-zinc-800/80 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">Track Progress</h3>
                    <p className="text-zinc-400 text-sm lg:text-base leading-relaxed">Visualize your improvement journey with detailed analytics</p>
                  </div>
                </div>

                {/* Enhanced CTA Section */}
                <div
                  className={`space-y-6 pt-8 lg:pt-12 transform transition-all duration-1000 delay-1500 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                >
                  <a
                    href="/api/auth/signin"
                    className="group relative inline-block"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {/* Enhanced button glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-3xl blur opacity-30 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>

                    {/* Main button */}
                    <div className="relative px-12 lg:px-16 py-5 lg:py-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-3xl font-bold text-lg lg:text-xl shadow-2xl transform group-hover:scale-105 group-hover:shadow-orange-500/40 transition-all duration-300">
                      <span className="relative z-10 flex items-center gap-4">
                        Start Tracking Now
                        <svg
                          className={`w-6 h-6 lg:w-7 lg:h-7 transform transition-all duration-300 ${
                            isHovered ? "translate-x-2 scale-110" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </div>
                  </a>
                  
                  <div className="space-y-2">
                    <p className="text-zinc-400 text-sm lg:text-base">
                      Join <span className="text-orange-400 font-bold text-lg">12,000+</span> developers already tracking their progress
                    </p>
                    <p className="text-zinc-500 text-xs lg:text-sm">
                      Free to use • No credit card required • Start in seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-code {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.1; 
          }
          25% { 
            transform: translateY(-15px) rotate(90deg); 
            opacity: 0.3; 
          }
          50% { 
            transform: translateY(-30px) rotate(180deg); 
            opacity: 0.2; 
          }
          75% { 
            transform: translateY(-15px) rotate(270deg); 
            opacity: 0.3; 
          }
        }
        
        @keyframes gradient-x {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .animate-float-code {
          animation: float-code 10s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
      `}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      {/* Only show stats section if user is logged in */}
      {session && (
        <div className="py-20 lg:py-28 relative pt-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.08),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(234,179,8,0.04),transparent_70%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
              Your <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">Coding Profiles</span>
            </h1>
            <div className="grid grid-cols-1 gap-8">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-zinc-400 mt-6 text-lg">Loading your coding stats...</p>
                </div>
              ) : (
                <>
                  {console.log("LeetCode Stats:", stats?.leetcode)}
                  <LeetCodeStats stats={stats?.leetcode} />
                  {console.log("Codeforces Stats:", stats?.codeforces)}
                  <CodeforcesStats stats={stats?.codeforces} />
                  {console.log("CodeChef Stats:", stats?.codechef)}
                  <CodechefStats stats={stats?.codechef} />
                  {console.log("GeeksForGeeks Stats:", stats?.geeksforgeeks)}
                  <GeeksForGeeksStats stats={stats?.geeksforgeeks} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Show login prompt if user is not logged in */}
      {!session && renderLoginPrompt()}
    </div>
  );
}
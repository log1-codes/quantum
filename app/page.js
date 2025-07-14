"use client"

import { ArrowRight, BarChart2, Brain, Code2, Zap, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Head from "next/head"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"

  const handleNavigation = (path) => router.push(path)

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Curated Content",
      description: "Access curated problems from LeetCode, CodeChef, Codeforces, and GeeksForGeeks.",
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Chat with Peers",
      description: "Engage with fellow learners through our integrated chat feature.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Social Integration",
      description: "Add your social profiles to connect with others in the community.",
    },
  ]

  return (
    <>
      {/* Metadata */}
      <Head>
        <title>Quantum - Level Up Your Coding</title>
        <meta
          name="description"
          content="Join the next generation of developers mastering algorithms through AI-powered learning."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white relative overflow-hidden">
        {/* Rectangular Grid/Box Background (from stats page) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50 z-0"></div>

        {/* Animated Glowing Blobs Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500/3 to-orange-500/3 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        {/* Floating Code-Themed Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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

        {/* Subtle Vertical Lines Background */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="vertical-lines"></div>
        </div>

        {/* Original gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.1),transparent_50%)] pointer-events-none z-0" />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 z-10">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                Level Up Your
                <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  {" "}
                  Coding Game
                </span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-3xl mx-auto mb-10">
                Join the next generation of developers mastering algorithms through AI-powered learning.
              </p>
              {/* Video Section */}
              <div className="relative w-full max-w-4xl mx-auto aspect-video mb-10">
                <video
                  className="w-full h-full rounded-lg shadow-lg"
                  src="/videos/how-to-use-quantum.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                ></video>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(session ? "/profile" : "/signup")}
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span className="flex items-center gap-2">
                    Start Coding <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/stats")}
                  className="px-8 py-3 bg-zinc-800/80 hover:bg-zinc-800 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span className="flex items-center gap-2">
                    View Stats <BarChart2 className="w-4 h-4" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-orange-500/30 group shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm"
                >
                  <div className="mb-4 text-orange-500 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-20 bg-black/30 relative z-10">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800/50 shadow-lg backdrop-blur-sm"
            >
              <h2 className="text-3xl font-bold mb-8">
                Master Your Skills Across
                <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  {" "}
                  All Platforms
                </span>
              </h2>
              <div className="flex justify-center gap-8 flex-wrap">
                {["LeetCode", "CodeChef", "Codeforces", "GeeksForGeeks"].map((platform, index) => (
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-zinc-400 group cursor-pointer"
                  >
                    <Zap className="w-5 h-5 group-hover:text-orange-500 transition-colors" />
                    <span className="group-hover:text-white transition-colors">{platform}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-bold mb-6">Ready to Begin?</h2>
              <p className="text-zinc-400 mb-8">Start your coding journey with personalized learning paths.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(session ? "/profile" : "/signup")}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg font-medium inline-flex items-center gap-2 group shadow-lg hover:shadow-xl transition-shadow relative z-10"
              >
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 relative z-10">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Quantum</span>
              </div>
              <div className="flex gap-6">
                {["About", "Privacy", "Terms", "Contact"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(item === "About" ? "/about" : item === "Contact" ? "/contact" : "#")
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* Simple Vertical Lines CSS + Animated Background CSS */}
        <style jsx>{`
          .vertical-lines {
            width: 100%;
            height: 100%;
            background-image: repeating-linear-gradient(
              90deg,
              transparent,
              transparent 79px,
              rgba(249, 115, 22, 0.1) 80px,
              rgba(249, 115, 22, 0.1) 81px
            );
          }
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
      </main>
    </>
  )
}

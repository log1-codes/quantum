"use client";

import { ArrowRight, BarChart2, Brain, Code2, Trophy, Zap, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";

  const handleNavigation = (path) => router.push(path);

  const features = [
    // {
    //   icon: <Code2 className="w-8 h-8" />,
    //   title: "Practice",
    //   description: "Master DSA through structured learning paths.",
    // },
    // {
    //   icon: <Brain className="w-8 h-8" />,
    //   title: "Learn",
    //   description: "AI-powered personalized recommendations.",
    // },
    // {
    //   icon: <Trophy className="w-8 h-8" />,
    //   title: "Compete",
    //   description: "Join contests and climb the leaderboard.",
    // },
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
  ];

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

      <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.1),transparent_50%)] pointer-events-none" />

        

        {/* Hero Section */}
        <section className="relative pt-32 pb-20">
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
                  {" "}Coding Game
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
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-orange-500/30 group shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="mb-4 text-orange-500 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-20 bg-black/30">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800/50 shadow-lg"
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
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
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
        <footer className="border-t border-zinc-800/50">
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
                      e.preventDefault();
                      handleNavigation(item === "About" ? "/about" : item === "Contact" ? "/contact" : "#");
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
      </main>
    </>
  );
}
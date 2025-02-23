"use client";

import { ArrowRight, BarChart2, Brain, Code2, Trophy, Zap, AlertTriangle } from 'lucide-react';
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";

  const handleNavigation = (path) => router.push(path);

  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Practice",
      description: "Master DSA through structured learning paths"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Learn",
      description: "AI-powered personalized recommendations"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Compete",
      description: "Join contests and climb the leaderboard"
    }
  ];

 

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.1),transparent_50%)]" />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Level Up Your
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"> Coding Game</span>
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
              Join the next generation of developers mastering algorithms through AI-powered learning
            </p>

              
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(session ? "/profile" : "/signup")}
                className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg font-medium group"
              >
                <span className="flex items-center gap-2">
                  Start Coding <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation("/stats")}
                className="px-8 py-3 bg-zinc-800/80 hover:bg-zinc-800 rounded-lg font-medium"
              >
                <span className="flex items-center gap-2">
                  View Stats <BarChart2 className="w-4 h-4" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

        {/* Caution */}
        <section className="">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl bg-yellow-900/20 border border-yellow-500/30"
          >
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mr-4" />
              <h2 className="text-3xl font-bold text-yellow-500">Caution</h2>
            </div>
            <h2 className="text-xl text-gray-400 font-semibold mb-4">
            Heads up! We're currently fetching the latest data for you, which may take a little time. Please allow us 30-50 seconds to gather everything you need. Rest assured, you won’t need to refresh the page manually—just sit tight while we work behind the scenes! Thank you for your patience. 😊
            </h2>
          </motion.div>
        </div>
      </section>


      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/30 group"
              >
                <div className="mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 bg-black/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800/50"
          >
            <h2 className="text-3xl font-bold mb-8">
              Master Your Skills Across
              <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent"> All Platforms</span>
            </h2>
            
            <div className="flex justify-center gap-8 flex-wrap">
              {['LeetCode', 'CodeChef', 'CodeForces'].map((platform, index) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-zinc-400 group cursor-pointer"
                >
                  <Zap className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                  <span className="group-hover:text-white transition-colors">{platform}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    
      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Begin?</h2>
            <p className="text-zinc-400 mb-8">Start your coding journey with personalized learning paths</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation(session ? "/profile" : "/signup")}
              className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg font-medium inline-flex items-center gap-2 group"
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
              <Code2 className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">quantum</span>
            </div>
            <div className="flex gap-6">
              {['About', 'Privacy', 'Terms', 'Contact'].map(item => (
                <a 
                  key={item} 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item === 'About' ? '/about' : item === 'Contact' ? '/contact' : '#');
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
  );
}


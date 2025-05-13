"use client";
import { motion } from "framer-motion";
import { Code2, Target, Clock, Users, ArrowRight, Github } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Multi-Platform Integration",
      description: "Seamlessly aggregates your profiles from LeetCode, CodeForces, CodeChef, and more in one unified dashboard.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-Time Updates",
      description: "Stay updated with your latest submissions, contest ratings, and problem-solving progress across all platforms.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Get detailed insights into your coding journey with visual analytics and progress tracking.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Features",
      description: "Connect with fellow developers, share achievements, and build your coding network.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(234,179,8,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="py-10 text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Your Coding Journey, Unified
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            We bring together your competitive programming profiles from multiple platforms,
            saving you time and providing valuable insights into your coding progress.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:bg-zinc-800/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-zinc-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-8 text-center shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Why Choose Our Platform?
          </h2>
          <div className="text-lg text-zinc-400 space-y-4">
            <p>
              In the competitive programming world, tracking your progress across multiple platforms
              can be time-consuming and inefficient. Our platform simplifies this by aggregating
              your data from various coding platforms into one intuitive dashboard.
            </p>
            <p>
              Whether you're preparing for technical interviews, participating in coding contests,
              or just improving your skills, we provide the tools and insights you need to succeed.
            </p>
          </div>

          <motion.a
            href="https://github.com/log1-codes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg font-medium text-white hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </motion.a>
        </motion.div>
      </div>
    </main>
  );
}
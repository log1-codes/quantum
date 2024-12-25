"use client";

import { Code2, BarChart2, ArrowRight, Github, Trophy } from 'lucide-react';
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(64,64,64,0.1),transparent_50%)] pointer-events-none" />

      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-24 pb-32">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-6xl font-bold bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-300 bg-clip-text text-transparent">
                CodeCracker
              </h1>
              <p className="mt-6 text-xl text-zinc-400 max-w-2xl">
                Level up your competitive programming journey with advanced tracking,
                analytics, and a supportive community of developers.
              </p>
            </motion.div>

            <div className="flex gap-4 mt-8">
              <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md flex items-center gap-2 text-lg transition-colors">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-md flex items-center gap-2 text-lg transition-colors">
                <Github className="w-4 h-4" /> View on GitHub
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-zinc-100">Why Choose CodeCracker?</h2>
              <p className="text-zinc-400 mt-4">
                Everything you need to excel in competitive programming
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Code2 className="w-10 h-10 text-emerald-500" />,
                  title: "Smart Problem Tracking",
                  description: "Automatically track your solved problems across CodeForces, LeetCode, and other major platforms."
                },
                {
                  icon: <BarChart2 className="w-10 h-10 text-blue-500" />,
                  title: "Advanced Analytics",
                  description: "Get detailed insights into your performance with beautiful charts and progression tracking."
                },
                {
                  icon: <Trophy className="w-10 h-10 text-amber-500" />,
                  title: "Skill Assessment",
                  description: "Understand your strengths and weaknesses with our AI-powered skill analysis."
                }
              ].map((feature, index) => (
                <div key={index} className="p-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all duration-300">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-100">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10k+", label: "Active Users" },
                { number: "100k+", label: "Problems Tracked" },
                { number: "50+", label: "Platforms" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <div key={index} className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </p>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-zinc-800">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-zinc-500">
                © {new Date().getFullYear()} CodeCracker. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}


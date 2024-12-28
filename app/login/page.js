"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Github, ChevronRight } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const handleProviderLogin = async (provider) => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative backdrop-blur-xl bg-black/40 p-8 rounded-2xl border border-gray-800 w-full max-w-md overflow-hidden"
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.h2 
          variants={itemVariants}
          className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center mb-8"
        >
          Welcome Back
        </motion.h2>

        <div className="space-y-4">
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProviderLogin("google")}
            className="w-full bg-white/10 text-white px-6 py-4 rounded-xl flex items-center justify-between group transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <img src="/Images/google.svg" alt="Google" className="w-6 h-6" />
              <span className="font-medium">Continue with Google</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
          </motion.button>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProviderLogin("github")}
            className="w-full bg-white/10 text-white px-6 py-4 rounded-xl flex items-center justify-between group transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Github className="w-6 h-6" />
              <span className="font-medium">Continue with GitHub</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
          </motion.button>
        </div>

        <motion.div 
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium relative group"
            >
              Sign up here
              <span className="absolute bottom-0 left-0 w-full h-px bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
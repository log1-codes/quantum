"use client"
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(() => ({
    name: "",
    username: "",
    email: "",
    platforms: {
      leetcode: "",
      codechef: "",
      codeforces: "",
      github:""
    },
    
  }));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (session?.user?.email && !userData.email) {
      fetchUserData();
    }
  }, [session, status, userData]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      const email = data.email || session?.user?.email || "";
      const extractedUsername = email.split("@")[0];

      setUserData({
        name: data.name || session?.user?.name || "",
        username: data.username || extractedUsername,
        email: email,
        platforms: {
          leetcode: data.platforms?.leetcode || "",
          codechef: data.platforms?.codechef || "",
          codeforces: data.platforms?.codeforces || "",
          github: data.platforms?.github|| ""
        },
       
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setUserData(prev => ({
        ...prev,
        username: updatedData.username || prev.username,
        platforms: {
          ...prev.platforms,
          leetcode: updatedData.platforms?.leetcode || prev.platforms.leetcode,
          codechef: updatedData.platforms?.codechef || prev.platforms.codechef,
          codeforces: updatedData.platforms?.codeforces || prev.platforms.codeforces,
          github : updatedData.platforms?.github || prev.platforms.github
        },
       
      }));
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const cleanLeetCodeUsername = (input) => {
    return input
      .replace("https://leetcode.com/u/", "")
      .replace("https://leetcode.com/", "")
      .replace(/\//g, "")
      .trim();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.1),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-zinc-900/50 backdrop-blur-lg rounded-xl shadow-2xl border border-zinc-800/50 relative z-10"
      >
        {loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {userData.name}
                </h1>
                <p className="text-zinc-400">@{userData.username}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg font-medium text-white hover:from-blue-600 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </>
                )}
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Personal Info</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <InputField
                      label="Name"
                      value={userData.name}
                      onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <InputField
                      label="Username"
                      value={userData.username}
                      onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
                    />
                    <InputField
                      label="Email"
                      value={userData.email}
                      disabled
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <DisplayField label="Name" value={userData.name} />
                    <DisplayField label="Username" value={userData.username} />
                    <DisplayField label="Email" value={userData.email} />
                  </div>
                )}
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Coding Platforms</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <InputField
                      label="LeetCode Username"
                      value={userData.platforms.leetcode}
                      onChange={(e) => {
                        const cleanUsername = cleanLeetCodeUsername(e.target.value);
                        setUserData(prev => ({
                          ...prev,
                          platforms: { ...prev.platforms, leetcode: cleanUsername }
                        }));
                      }}
                      placeholder="Enter LeetCode username"
                    />
                    <InputField
                      label="CodeForces Username"
                      value={userData.platforms.codeforces}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        platforms: { ...prev.platforms, codeforces: e.target.value }
                      }))}
                      placeholder="Enter CodeForces username"
                    />
                    <InputField
                      label="CodeChef Username"
                      value={userData.platforms.codechef}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        platforms: { ...prev.platforms, codechef: e.target.value }
                      }))}
                      placeholder="Enter CodeChef username"
                    />
                    <InputField
                      label="GIthub Username"
                      value={userData.platforms.github}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        platforms: { ...prev.platforms, github: e.target.value }
                      }))}
                      placeholder="Enter Github username"
                    />
                
                  </div>
                ) : (
                  <div className="space-y-4">
                    <DisplayField
                      label="LeetCode"
                      value={userData.platforms.leetcode || "Not set"}
                    />
                    <DisplayField
                      label="CodeForces"
                      value={userData.platforms.codeforces || "Not set"}
                    />
                    <DisplayField
                      label="CodeChef"
                      value={userData.platforms.codechef || "Not set"}
                    />
                    <DisplayField
                      label="Github"
                      value={userData.platforms.github || "Not set"}
                    />
                  </div>
                )}
              </section>
            </div>

            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdate}
                disabled={loading}
                className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg font-medium text-white hover:from-blue-600 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Updating..."
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </main>
  );
}

function InputField({ label, value, onChange, disabled = false, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-md shadow-sm py-2 px-3
          text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function DisplayField({ label, value }) {
  return (
    <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50">
      <h3 className="text-sm font-medium text-zinc-400 mb-1">{label}</h3>
      <p className="text-zinc-200">{value}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-8 bg-zinc-800 rounded w-48"></div>
          <div className="h-4 bg-zinc-800 rounded w-32"></div>
        </div>
        <div className="h-10 bg-zinc-800 rounded w-32"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
              <div className="h-10 bg-zinc-800 rounded w-full"></div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
              <div className="h-10 bg-zinc-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
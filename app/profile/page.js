"use client"

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Save, X, Camera, Code } from 'lucide-react';
import { SiLeetcode } from "react-icons/si";
import { SiCodeforces } from "react-icons/si";
import { SiCodechef } from "react-icons/si";
import { SiGeeksforgeeks } from "react-icons/si";
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(() => ({
    name: "",
    username: "",
    email: "",
    image: "",
    platforms: {
      leetcode: "",
      codechef: "",
      codeforces: "",
      geeksforgeeks: "",
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
  }, [session, status, userData, router]);

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
        image: data.image || session?.user?.image || "",
        platforms: {
          leetcode: data.platforms?.leetcode || "",
          codechef: data.platforms?.codechef || "",
          codeforces: data.platforms?.codeforces || "",
          geeksforgeeks: data.platforms?.geeksforgeeks || "",
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
          geeksforgeeks: updatedData.platforms?.geeksforgeeks || prev.platforms.geeksforgeeks,
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
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,78,216,0.15),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            className="col-span-1 bg-zinc-900/50 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-zinc-800/50"
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            <div className="p-6 flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative mb-4"
              >
                {loading ? (
                  <div className="w-32 h-32 rounded-full bg-zinc-800 animate-pulse" />
                ) : userData.image ? (
                  <img src={userData.image} alt="User Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/50 transition-all duration-300 hover:border-blue-500" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-500/50">
                    <span className="text-4xl font-bold">{userData.name.charAt(0)}</span>
                  </div>
                )}

              </motion.div>
              {loading ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    {userData.name || "Your Name"}
                  </h1>
                  <p className="text-zinc-400 mt-2">@{userData.username || "username"}</p>
                </>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !loading && setIsEditing(!isEditing)}
                disabled={loading}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg font-medium text-white 
                  hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {isEditing ? (
                  <>
                    <X size={16} /> Cancel
                  </>
                ) : (
                  <>
                    <Edit2 size={16} /> Edit Profile
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-1 sm:col-span-2 bg-zinc-900/50 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-zinc-800/50"
                  >
                    <div className="h-7 w-40 bg-zinc-800 rounded-lg animate-pulse mb-6" />
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                          <div className="h-6 w-full bg-zinc-800 rounded-lg animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="col-span-1 sm:col-span-2 bg-zinc-900/50 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-zinc-800/50"
                  >
                    <div className="h-7 w-48 bg-zinc-800 rounded-lg animate-pulse mb-6" />
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="h-6 w-6 bg-zinc-800 rounded-full animate-pulse" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                            <div className="h-6 w-full bg-zinc-800 rounded-lg animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : isEditing ? (
                <EditForm
                  key="edit-form"
                  userData={userData}
                  setUserData={setUserData}
                  handleUpdate={handleUpdate}
                  loading={loading}
                  cleanLeetCodeUsername={cleanLeetCodeUsername}
                />
              ) : (
                <DisplayInfo
                  key="display-info"
                  userData={userData}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

function EditForm({ userData, setUserData, handleUpdate, loading, cleanLeetCodeUsername }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="col-span-1 sm:col-span-2 bg-zinc-900/50 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-zinc-800/50"
      >
        <h2 className="text-xl font-semibold mb-6 text-gradient">Personal Info</h2>
        <div className="space-y-5">
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
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="col-span-1 sm:col-span-2 bg-zinc-900/50 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-zinc-800/50"
      >
        <h2 className="text-xl font-semibold mb-6 text-gradient">Coding Platforms</h2>
        <div className="space-y-5">
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
            icon={<SiLeetcode size={20} />}
          />
          <InputField
            label="CodeForces Username"
            value={userData.platforms.codeforces}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              platforms: { ...prev.platforms, codeforces: e.target.value }
            }))}
            icon={<SiCodeforces size={20} />}
          />
          <InputField
            label="CodeChef Username"
            value={userData.platforms.codechef}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              platforms: { ...prev.platforms, codechef: e.target.value }
            }))}
            icon={<SiCodechef size={20} />}
          />
          <InputField
            label="GeeksForGeeks Username"
            value={userData.platforms.geeksforgeeks}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              platforms: { ...prev.platforms, geeksforgeeks: e.target.value }
            }))}
            icon={<SiGeeksforgeeks size={20} />}
          />
        </div>
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUpdate}
        disabled={loading}
        className="col-span-1 sm:col-span-2 mt-4 py-3.5 px-6 bg-gradient-to-r from-blue-700 to-blue-600 
          rounded-lg font-medium text-white hover:from-blue-600 hover:to-blue-500 transition-all duration-300 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Updating...</span>
          </>
        ) : (
          <>
            <Save size={20} />
            Save Changes
          </>
        )}
      </motion.button>
    </>
  );
}

function DisplayInfo({ userData }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-900/50 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-zinc-800/50"
      >
        <h2 className="text-xl font-semibold mb-6 text-gradient">Personal Info</h2>
        <div className="space-y-5">
          <DisplayField label="Name" value={userData.name} />
          <DisplayField label="Username" value={userData.username} />
          <DisplayField label="Email" value={userData.email} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-zinc-900/50 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
      >
        <h2 className="text-xl font-semibold mb-6 text-gradient">Coding Platforms</h2>
        <div className="space-y-5">
          <DisplayField
            label="LeetCode"
            value={userData.platforms.leetcode || "Not set"}
            icon={<SiLeetcode size={20} />}
            link={userData.platforms.leetcode ? `https://leetcode.com/${userData.platforms.leetcode}` : null}
          />
          <DisplayField
            label="CodeForces"
            value={userData.platforms.codeforces || "Not set"}
            icon={<SiCodeforces size={20} />}
            link={userData.platforms.codeforces ? `https://codeforces.com/profile/${userData.platforms.codeforces}` : null}
          />
          <DisplayField
            label="CodeChef"
            value={userData.platforms.codechef || "Not set"}
            icon={<SiCodechef size={20} />}
            link={userData.platforms.codechef ? `https://www.codechef.com/users/${userData.platforms.codechef}` : null}
          />
          <DisplayField
            label="GeeksForGeeks"
            value={userData.platforms.geeksforgeeks || "Not set"}
            icon={<SiGeeksforgeeks size={20} />}
            link={userData.platforms.geeksforgeeks ? `https://geeksforgeeks.org/user/${userData.platforms.geeksforgeeks}` : null}
          />
        </div>
      </motion.div>
    </>
  );
}

function InputField({ label, value, onChange, disabled = false, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
            {icon}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full bg-zinc-800/50 border border-zinc-700 rounded-lg shadow-sm py-2.5 px-3
            text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-zinc-600
            ${icon ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  );
}

function DisplayField({ label, value, icon, link }) {
  const content = (
    <div className="flex items-center space-x-3 group">
      {icon && <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">{icon}</span>}
      <div>
        <h3 className="text-sm font-medium text-zinc-300">{label}</h3>
        <p className="text-zinc-200 group-hover:text-white transition-colors">{value}</p>
      </div>
    </div>
  );

  if (link && value !== "Not set") {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-zinc-800/30 rounded-lg p-2 -mx-2 transition-colors"
      >
        {content}
      </a>
    );
  }

  return <div className="p-2 -mx-2">{content}</div>;
}
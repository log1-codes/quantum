"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Save, X, ExternalLink, User, Mail, Check } from "lucide-react";
import { SiLeetcode, SiCodeforces, SiCodechef, SiGeeksforgeeks } from "react-icons/si";
import { Camera } from "lucide-react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
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
    socials: {
      linkedin: "",
      github: "",
      twitter: "",
    },
  });

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
        socials: {
          linkedin: data.socials?.linkedin || "",
          github: data.socials?.github || "",
          twitter: data.socials?.twitter || "",
        },
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data", {
        style: {
          background: "#ff7a00",
          color: "#ffffff",
          fontWeight: "500",
        },
      });
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
      toast.success("Profile updated successfully", {
        style: {
          background: "#ff7a00",
          color: "#ffffff",
          fontWeight: "500",
        },
      });

      setIsEditing(false);
      setUserData((prev) => ({
        ...prev,
        username: updatedData.username || prev.username,
        platforms: {
          ...prev.platforms,
          leetcode: updatedData.platforms?.leetcode || prev.platforms.leetcode,
          codechef: updatedData.platforms?.codechef || prev.platforms.codechef,
          codeforces: updatedData.platforms?.codeforces || prev.platforms.codeforces,
          geeksforgeeks: updatedData.platforms?.geeksforgeeks || prev.platforms.geeksforgeeks,
        },
        socials: {
          linkedin: updatedData.socials?.linkedin || prev.socials.linkedin,
          github: updatedData.socials?.github || prev.socials.github,
          twitter: updatedData.socials?.twitter || prev.socials.twitter,
        },
      }));
    } catch (error) {
      toast.error("Failed to update profile", {
        style: {
          background: "#ff7a00",
          color: "#ffffff",
          fontWeight: "500",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white pt-20 pb-16 relative overflow-hidden">
      {/* Improved background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100px_100px,rgba(234,179,8,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_bottom_right,rgba(234,179,8,0.1),transparent_80%)] pointer-events-none" />
      <div className="absolute w-full h-full bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent"
        >
          Your Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card - Left Side */}
            <div className="lg:col-span-1">
              <ProfileCard 
                userData={userData} 
                loading={loading} 
                isEditing={isEditing} 
                setIsEditing={setIsEditing} 
              />
            </div>

            {/* Info Cards - Right Side */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <LoadingSkeleton />
                ) : isEditing ? (
                  <EditForm
                    key="edit-form"
                    userData={userData}
                    setUserData={setUserData}
                    handleUpdate={handleUpdate}
                    loading={loading}
                  />
                ) : (
                  <DisplayInfo key="display-info" userData={userData} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function ProfileCard({ userData, loading, isEditing, setIsEditing }) {
  return (
    <motion.div
      className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-orange-800/30 h-full"
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(255, 122, 0, 0.15)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Header gradient */}
      <div className="h-24 bg-gradient-to-r from-orange-600/30 to-yellow-600/30" />
      
      <div className="px-6 pb-8 pt-0 -mt-12 flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative mb-5"
        >
          {loading ? (
            <div className="w-28 h-28 rounded-full bg-zinc-800/80 animate-pulse border-4 border-zinc-900" />
          ) : userData.image ? (
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-r from-orange-500 to-yellow-500 shadow-xl">
              <img
                src={userData.image}
                alt="User Profile"
                className="w-full h-full rounded-full object-cover border-2 border-zinc-900"
              />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-r from-orange-500 to-yellow-500 shadow-xl">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                <span className="text-4xl font-bold text-orange-500">{userData.name.charAt(0)}</span>
              </div>
            </div>
          )}
          
          {/* Add a camera icon for future photo upload feature */}
          <div className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-1.5 border-2 border-zinc-900 shadow-lg">
            <Camera size={16} className="text-zinc-900" />
          </div>
        </motion.div>
        
        {loading ? (
          <div className="space-y-3 w-full flex flex-col items-center">
            <div className="h-8 w-48 bg-zinc-800/80 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-zinc-800/80 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              {userData.name || "Your Name"}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-zinc-400">@{userData.username || "username"}</p>
            </div>
          </>
        )}
        
        {/* Small divider */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 my-6 rounded-full" />
        
        {/* Social links with actual URLs */}
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          <div className="flex flex-col items-center">
            <a 
              href={userData.socials.linkedin || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-xl font-bold mb-3 ${userData.socials.linkedin ? 'text-orange-500 hover:text-orange-400 transition-colors' : 'text-zinc-600 cursor-not-allowed'}`}
            >
              <FaLinkedin size={22} />
            </a>
            <p className="text-xs text-zinc-400">Linkedin</p>
          </div>
          <div className="flex flex-col items-center">
            <a 
              href={userData.socials.github || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-xl font-bold mb-3 ${userData.socials.github ? 'text-orange-500 hover:text-orange-400 transition-colors' : 'text-zinc-600 cursor-not-allowed'}`}
            >
              <FaGithub size={22} />
            </a>
            <p className="text-xs text-zinc-400">Github</p>
          </div>
          <div className="flex flex-col items-center">
            <a 
              href={userData.socials.twitter || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-xl font-bold mb-3 ${userData.socials.twitter ? 'text-orange-500 hover:text-orange-400 transition-colors' : 'text-zinc-600 cursor-not-allowed'}`}
            >
              <FaTwitter size={22} />
            </a>
            <p className="text-xs text-zinc-400">Twitter</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => !loading && setIsEditing(!isEditing)}
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl font-medium text-white 
            hover:from-orange-500 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 
            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
        >
          {isEditing ? (
            <>
              <X size={18} /> Cancel Editing
            </>
          ) : (
            <>
              <Edit2 size={18} /> Edit Profile
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-800/30 h-full"
    >
      <div className="h-7 w-40 bg-zinc-800/80 rounded-lg animate-pulse mb-8" />
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-24 bg-zinc-800/80 rounded animate-pulse" />
            <div className="h-12 w-full bg-zinc-800/80 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function EditForm({ userData, setUserData, handleUpdate, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-800/30"
      >
        <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2">
          <User size={20} className="text-orange-500" />
          Personal Information
        </h2>
        <div className="space-y-6">
          <InputField
            label="Name"
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
          />
          <InputField
            label="Username"
            value={userData.username}
            onChange={(e) => setUserData((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="Choose a username"
          />
          <InputField label="Email" value={userData.email} disabled placeholder="Your email address" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-800/30"
      >
        <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2">
          <Code size={20} className="text-orange-500" />
          Coding Platforms
        </h2>
        <div className="space-y-6">
          <InputField
            label="LeetCode Username"
            value={userData.platforms.leetcode}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                platforms: { ...prev.platforms, leetcode: e.target.value },
              }))
            }
            icon={<SiLeetcode size={22} />}
            placeholder="Your LeetCode username"
          />
          <InputField
            label="CodeForces Username"
            value={userData.platforms.codeforces}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                platforms: { ...prev.platforms, codeforces: e.target.value },
              }))
            }
            icon={<SiCodeforces size={22} />}
            placeholder="Your CodeForces username"
          />
          <InputField
            label="CodeChef Username"
            value={userData.platforms.codechef}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                platforms: { ...prev.platforms, codechef: e.target.value },
              }))
            }
            icon={<SiCodechef size={22} />}
            placeholder="Your CodeChef username"
          />
          <InputField
            label="GeeksForGeeks Username"
            value={userData.platforms.geeksforgeeks}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                platforms: { ...prev.platforms, geeksforgeeks: e.target.value },
              }))
            }
            icon={<SiGeeksforgeeks size={22} />}
            placeholder="Your GeeksForGeeks username"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-800/30"
      >
        <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2">
          <FaLinkedin size={20} className="text-orange-500" />
          Social Links
        </h2>
        <div className="space-y-6">
          <InputField
            label="LinkedIn"
            value={userData.socials.linkedin}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                socials: { ...prev.socials, linkedin: e.target.value },
              }))
            }
            placeholder="Enter your LinkedIn profile URL"
            icon={<FaLinkedin size={22} />}
          />
          <InputField
            label="GitHub"
            value={userData.socials.github}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                socials: { ...prev.socials, github: e.target.value },
              }))
            }
            placeholder="Enter your GitHub profile URL"
            icon={<FaGithub size={22} />}
          />
          <InputField
            label="Twitter"
            value={userData.socials.twitter}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                socials: { ...prev.socials, twitter: e.target.value },
              }))
            }
            placeholder="Enter your Twitter profile URL"
            icon={<FaTwitter size={22} />}
          />
        </div>
      </motion.div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUpdate}
        disabled={loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-500 
          rounded-xl font-medium text-white hover:from-orange-500 hover:to-orange-400 transition-all duration-300 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Updating Profile...</span>
          </>
        ) : (
          <>
            <Save size={20} />
            Save Changes
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

function DisplayInfo({ userData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-800/30"
      >
        <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2">
          <User size={20} className="text-orange-500" />
          Personal Information
        </h2>
        <div className="space-y-6">
          <DisplayField 
            label="Name" 
            value={userData.name} 
            icon={<User size={18} className="text-orange-500" />} 
          />
          <DisplayField 
            label="Username" 
            value={userData.username} 
            icon={<AtSign size={18} className="text-orange-500" />} 
          />
          <DisplayField 
            label="Email" 
            value={userData.email} 
            icon={<Mail size={18} className="text-orange-500" />} 
          />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-800/30"
      >
        <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2">
          <Code size={20} className="text-orange-500" />
          Coding Platforms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlatformCard
            platform="LeetCode"
            username={userData.platforms.leetcode}
            icon={<SiLeetcode size={24} className="text-orange-500" />}
            link={userData.platforms.leetcode ? `https://leetcode.com/${userData.platforms.leetcode}` : null}
          />
          <PlatformCard
            platform="CodeForces"
            username={userData.platforms.codeforces}
            icon={<SiCodeforces size={24} className="text-orange-500" />}
            link={userData.platforms.codeforces ? `https://codeforces.com/profile/${userData.platforms.codeforces}` : null}
          />
          <PlatformCard
            platform="CodeChef"
            username={userData.platforms.codechef}
            icon={<SiCodechef size={24} className="text-orange-500" />}
            link={userData.platforms.codechef ? `https://www.codechef.com/users/${userData.platforms.codechef}` : null}
          />
          <PlatformCard
            platform="GeeksForGeeks"
            username={userData.platforms.geeksforgeeks}
            icon={<SiGeeksforgeeks size={24} className="text-orange-500" />}
            link={userData.platforms.geeksforgeeks ? `https://geeksforgeeks.org/user/${userData.platforms.geeksforgeeks}` : null}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function InputField({ label, value, onChange, disabled = false, icon, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-4 flex items-center text-orange-500/80">
            {icon}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full bg-zinc-800/50 border border-zinc-700 rounded-xl shadow-inner py-3.5 px-4
            text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50
            disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:border-zinc-600
            ${icon ? "pl-12" : ""}`}
        />
      </div>
    </div>
  );
}

function DisplayField({ label, value, icon }) {
  return (
    <div className="flex items-start space-x-4 p-3 hover:bg-zinc-800/20 rounded-xl transition-colors">
      {icon && <span className="mt-0.5">{icon}</span>}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-1">{label}</h3>
        <p className="text-zinc-100 font-medium">{value}</p>
      </div>
    </div>
  );
}

function PlatformCard({ platform, username, icon, link }) {
  const hasUsername = username && username !== "Not set";

  return (
    <motion.div
      whileHover={{ y: -3, backgroundColor: "rgba(39, 39, 42, 0.4)" }}
      transition={{ duration: 0.2 }}
      className="bg-zinc-800/20 backdrop-blur-sm rounded-xl border border-zinc-700/50 p-4 hover:border-orange-500/30 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <h3 className="font-medium text-zinc-200">{platform}</h3>
            <p className="text-sm text-zinc-400 mt-0.5">
              {hasUsername ? username : "Not connected"}
            </p>
          </div>
        </div>

        {hasUsername && link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 transition-colors"
          >
            <ExternalLink size={18} />
          </a>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/50 text-zinc-500">
            <X size={14} />
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      <div className="mt-4 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${hasUsername ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
        <span className="text-xs text-zinc-400">
          {hasUsername ? "Connected" : "Not connected"}
        </span>
      </div>
    </motion.div>
  );
}

// Missing components from import
function Code(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}

function AtSign(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
    </svg>
  );
}
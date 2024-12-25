"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa"; // Import only FaUser

const Profile = () => {
    const { data: session } = useSession();

    if (!session) {
        return <p>Loading...</p>;
    }

    const { user } = session;

    const platforms = user.platforms || {};

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <motion.h2
                className="text-4xl font-bold text-white mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Profile
            </motion.h2>
            <motion.div
                className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 w-full max-w-sm"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.img
                    src={user.image || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white">{user.name || 'N/A'}</h3>
                    <p className="text-gray-400">{user.email || 'N/A'}</p>
                    <div className="text-gray-400 mt-2">
                        <p>LeetCode: {platforms.leetcode || 'N/A'}</p>
                        <p>CodeChef: {platforms.codechef || 'N/A'}</p>
                        <p>Codeforces: {platforms.codeforces || 'N/A'}</p>
                        <p>Geeks for Geeks: {platforms.geeksforgeeks || 'N/A'}</p>
                    </div>
                </div>
                <motion.div
                    className="flex justify-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaUser className="text-white text-3xl" /> {/* Correct usage */}
                </motion.div>
            </motion.div>
        </div>
    );
};

const ProfilePage = () => (
    <SessionProvider>
        <Profile />
    </SessionProvider>
);

export default ProfilePage;
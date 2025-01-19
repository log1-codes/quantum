"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/profile/LoadingSpinner';

export default function UserStats() {
  const { username } = useParams();
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [platformUsernames, setPlatformUsernames] = useState(null);

  useEffect(() => {
    const fetchUserPlatforms = async () => {
      try {
        const response = await fetch(`/api/user/platforms?username=${username}`);
        if (!response.ok) throw new Error('Failed to fetch user platforms');
        const data = await response.json();
        setPlatformUsernames(data.platforms);
        
        const statsPromises = Object.entries(data.platforms).map(async ([platform, platformUsername]) => {
          if (!platformUsername) return [platform, null];
          
          try {
            const statsResponse = await fetch(`/api/platforms/stats/${platform}?username=${platformUsername}`);
            if (!statsResponse.ok) throw new Error(`Failed to fetch ${platform} stats`);
            const statsData = await statsResponse.json();
            return [platform, statsData];
          } catch (error) {
            console.error(`Error fetching ${platform} stats:`, error);
            toast.error(`Failed to fetch ${platform} stats`);
            return [platform, null];
          }
        });

        const statsResults = await Promise.all(statsPromises);
        const statsObject = Object.fromEntries(statsResults);
        setStats(statsObject);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserPlatforms();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!platformUsernames) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">No platform usernames found for this user.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">
          Coding Stats for {decodeURIComponent(username)}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(platformUsernames).map(([platform, platformUsername]) => {
            if (!platformUsername) return null;
            
            return (
              <motion.div
                key={platform}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-900 rounded-lg p-6 border border-zinc-800"
              >
                <h2 className="text-xl font-semibold text-zinc-100 mb-4 capitalize">
                  {platform}
                </h2>
                <p className="text-zinc-400 mb-4">
                  Username: {platformUsername}
                </p>
                
                {stats && stats[platform] ? (
                  <div className="space-y-2">
                    {platform === 'leetcode' && (
                      <>
                        <p className="text-zinc-300">
                          Total Solved: {stats[platform].totalSolved || 0}
                        </p>
                        <p className="text-green-400">
                          Easy: {stats[platform].easySolved || 0}
                        </p>
                        <p className="text-yellow-400">
                          Medium: {stats[platform].mediumSolved || 0}
                        </p>
                        <p className="text-red-400">
                          Hard: {stats[platform].hardSolved || 0}
                        </p>
                      </>
                    )}
                    
                    {platform === 'codeforces' && (
                      <>
                        <p className="text-zinc-300">
                          Rating: {stats[platform].rating || 'N/A'}
                        </p>
                        <p className="text-zinc-300">
                          Max Rating: {stats[platform].maxRating || 'N/A'}
                        </p>
                        <p className="text-zinc-300">
                          Rank: {stats[platform].rank || 'N/A'}
                        </p>
                      </>
                    )}
                    
                  </div>
                ) : (
                  <p className="text-zinc-500">Failed to fetch stats</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
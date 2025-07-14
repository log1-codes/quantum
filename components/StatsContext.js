"use client";
import React, { createContext, useContext, useState } from "react";

// Create a context for stats data
const StatsContext = createContext();

export function StatsProvider({ children }) {
  // This state will hold the stats data and persist as long as the app is not reloaded
  const [stats, setStats] = useState(null);

  /**
   * Remove a platform's stats from the context cache.
   * Use this after a user deletes a username for a platform.
   * @param {string} platform - The platform key (e.g., 'leetcode')
   */
  const removePlatformStats = (platform) => {
    setStats((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      delete updated[platform];
      // Also clear the username in the platforms object if present
      if (updated.platforms) {
        updated.platforms = { ...updated.platforms, [platform]: "" };
      }
      return updated;
    });
  };

  /**
   * Refetch all stats from the API and update the context.
   * Use this after a user adds or updates a username for a platform.
   */
  const refetchStats = async () => {
    try {
      const response = await fetch("/api/platforms/stats/all");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      // Optionally handle error
      console.error("Failed to refetch stats:", error);
    }
  };

  return (
    <StatsContext.Provider value={{ stats, setStats, removePlatformStats, refetchStats }}>
      {children}
    </StatsContext.Provider>
  );
}

// Custom hook to use stats context in any component
export function useStats() {
  return useContext(StatsContext);
} 
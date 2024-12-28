// Create this file at: components/profile/PlatformCard.js
import { LoadingSpinner } from './LoadingSpinner';

export default function PlatformCard({ platform, stats, loading }) {
  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  const renderPlatformStats = () => {
    switch (platform) {
      case 'leetcode':
        return (
          <div className="space-y-2">
            <p className="text-gray-300">
              Problems Solved: {stats.submitStats?.acSubmissionNum?.[0]?.count || 0}
            </p>
            <div className="space-y-1">
              <p className="text-green-400">
                Easy: {stats.submitStats?.acSubmissionNum?.[1]?.count || 0}
              </p>
              <p className="text-yellow-400">
                Medium: {stats.submitStats?.acSubmissionNum?.[2]?.count || 0}
              </p>
              <p className="text-red-400">
                Hard: {stats.submitStats?.acSubmissionNum?.[3]?.count || 0}
              </p>
            </div>
          </div>
        );

      case 'codeforces':
        return (
          <div className="space-y-2">
            <p className="text-gray-300">Rating: {stats.rating}</p>
            <p className="text-gray-300">Max Rating: {stats.maxRating}</p>
            <p className="text-gray-300">Rank: {stats.rank}</p>
            <p className="text-gray-300">Contests: {stats.contests}</p>
            <p className="text-gray-300">Contributions: {stats.contributions}</p>
          </div>
        );

      case 'codechef':
        return (
          <div className="space-y-2">
            <p className="text-gray-300">Rating: {stats.rating}</p>
            <p className="text-gray-300">Max Rating: {stats.maxRating}</p>
            <p className="text-gray-300">Global Rank: {stats.globalRank}</p>
            <p className="text-gray-300">Country Rank: {stats.countryRank}</p>
          </div>
        );

      case 'geeksforgeeks':
        return (
          <div className="space-y-2">
            <p className="text-gray-300">Coding Score: {stats.codingScore}</p>
            <p className="text-gray-300">Problems Solved: {stats.problemsSolved}</p>
            <p className="text-gray-300">Institute: {stats.instituteName}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition-colors">
      <h3 className="text-xl font-bold text-white mb-4 capitalize flex items-center">
        <img 
          src={`/${platform}.svg`} 
          alt={platform} 
          className="w-6 h-6 mr-2"
        />
        {platform}
      </h3>
      {renderPlatformStats()}
    </div>
  );
}
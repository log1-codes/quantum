export async function getCodeforcesStats(username) {
  try {
    const [userInfo, userRating] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`),
      fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(username)}`)
    ]);

    const info = await userInfo.json();
    const rating = await userRating.json();

    if (info.status !== 'OK') throw new Error('User not found');

    const user = info.result[0];
    
    return {
      handle: user.handle || username,
      rank: user.rank || 'unranked',
      maxRank: user.maxRank || 'unranked',
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      
      contests: rating.result?.length || 0,
      
      contributions: user.contribution || 0,
      friendOfCount: user.friendOfCount || 0,
      lastOnlineTimeSeconds: user.lastOnlineTimeSeconds || 0,
      registrationTimeSeconds: user.registrationTimeSeconds || 0,
      
      titlePhoto: user.titlePhoto || '',
      organization: user.organization || '',
      
      recentContests: rating.result?.slice(-5).map(contest => ({
        contestId: contest.contestId,
        contestName: contest.contestName,
        rank: contest.rank,
        oldRating: contest.oldRating,
        newRating: contest.newRating,
      })) || [],
      
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Codeforces stats error:", error);
    return null;
  }
}
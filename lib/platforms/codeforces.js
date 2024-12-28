// export async function verifyCodeforces(username) {
//     try {
//       const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
//       const data = await response.json();
//       return data.status === 'OK';
//     } catch (error) {
//       return false;
//     }
//   }
  
//   export async function getCodeforcesStats(username) {
//     try {
//       const [userInfo, userRating] = await Promise.all([
//         fetch(`https://codeforces.com/api/user.info?handles=${username}`),
//         fetch(`https://codeforces.com/api/user.rating?handle=${username}`)
//       ]);
  
//       const info = await userInfo.json();
//       const rating = await userRating.json();
  
//       if (info.status !== 'OK') throw new Error('User not found');
  
//       return {
//         rating: info.result[0].rating,
//         maxRating: info.result[0].maxRating,
//         rank: info.result[0].rank,
//         contests: rating.result.length,
//         contributions: info.result[0].contribution
//       };
//     } catch (error) {
//       return null;
//     }
//   }



// File: /lib/platforms/codeforces.js

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
      // Basic Info
      handle: user.handle || username,
      rank: user.rank || 'unranked',
      maxRank: user.maxRank || 'unranked',
      
      // Ratings
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      
      // Contest Participation
      contests: rating.result?.length || 0,
      
      // Contributions and Activity
      contributions: user.contribution || 0,
      friendOfCount: user.friendOfCount || 0,
      lastOnlineTimeSeconds: user.lastOnlineTimeSeconds || 0,
      registrationTimeSeconds: user.registrationTimeSeconds || 0,
      
      // Additional Info
      titlePhoto: user.titlePhoto || '',
      organization: user.organization || '',
      
      // Recent Contests (last 5)
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
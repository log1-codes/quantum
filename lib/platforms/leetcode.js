// const baseUrl = "https://alfa-leetcode-api.onrender.com";

// export async function getLeetcodeStats(username) {
//   try {
    
//     const userProfileResponse = await fetch(`${baseUrl}/userProfile/${username}`);
//     if (!userProfileResponse.ok) {
//       throw new Error(`Error fetching user profile: ${userProfileResponse.statusText}`);
//     }
//     const userProfile = await userProfileResponse.json();

//     // Get solved problems details
//     const solvedResponse = await fetch(`${baseUrl}/${username}/solved`);
//     if (!solvedResponse.ok) {
//       throw new Error(`Error fetching solved problems: ${solvedResponse.statusText}`);
//     }
//     const solvedData = await solvedResponse.json();

//     // Get submission calendar
//     const calendarResponse = await fetch(`${baseUrl}/${username}/calendar`);
//     if (!calendarResponse.ok) {
//       throw new Error(`Error fetching calendar: ${calendarResponse.statusText}`);
//     }
//     const calendar = await calendarResponse.json();

//     // Get language stats
//     const languageStatsResponse = await fetch(`${baseUrl}/languageStats?username=${username}`);
//     if (!languageStatsResponse.ok) {
//       throw new Error(`Error fetching language stats: ${languageStatsResponse.statusText}`);
//     }
//     const languageStats = await languageStatsResponse.json();

//     // Get skill stats
//     const skillStatsResponse = await fetch(`${baseUrl}/skillStats/${username}`);
//     const skillStats = await skillStatsResponse.json();
//     if (!skillStats.ok) {
//       throw new Error(`Error fetching skill stats: ${skillStatsResponse.statusText}`);
//     }
   

//     // Get contest history
//     const contestHistoryResponse = await fetch(`${baseUrl}/${username}/contest/history`);
//     if (!contestHistoryResponse.ok) {
//       throw new Error(`Error fetching contest history: ${contestHistoryResponse.statusText}`);
//     }
//     const contestHistory = await contestHistoryResponse.json();

//     // Get recent submissions
//     const submissionsResponse = await fetch(`${baseUrl}/${username}/submission`);
//     if (!submissionsResponse.ok) {
//       throw new Error(`Error fetching submissions: ${submissionsResponse.statusText}`);
//     }
//     const submissions = await submissionsResponse.json();

//     // Format the data properly
//     return {
//       userProfile: userProfile,
//       solvedProblems: {
//         total: userProfile.submitStats?.acSubmissionNum?.[0]?.count || 0,
//         easy: userProfile.submitStats?.acSubmissionNum?.[1]?.count || 0,
//         medium: userProfile.submitStats?.acSubmissionNum?.[2]?.count || 0,
//         hard: userProfile.submitStats?.acSubmissionNum?.[3]?.count || 0
//       },
//       calendar,
//       languageStats,
//       skillStats,
//       contestHistory,
//       submissions,
//       badges: userProfile.badges || [],
//       contestData: {
//         rating: userProfile.userContestRanking?.rating || 0,
//         globalRanking: userProfile.userContestRanking?.globalRanking || 'N/A',
//         topPercentage: userProfile.userContestRanking?.topPercentage || 0,
//         attendedContestsCount: userProfile.userContestRanking?.attendedContestsCount || 0,
//         contestHistory: contestHistory?.matchedUser?.contestHistory || []
//       }
//     };
//   } catch (error) {
//     console.error('Error fetching LeetCode data:', error);
//     return null;
//   }
// }


const baseUrl = process.env.NEXT_PUBLIC_LEETCODE_BASE_URL;

export async function getLeetcodeStats(username) {
  try {
    const response = await fetch(`${baseUrl}/${username}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();

    if (data.status === "error") {
      console.log("User  does not exist or has no data.");
      return data;
    }

    return {
      totalSolved: data.totalSolved,
      totalQuestions: data.totalQuestions,
      easySolved: data.easySolved,
      totalEasy: data.totalEasy,
      mediumSolved: data.mediumSolved,
      totalMedium: data.totalMedium,
      hardSolved: data.hardSolved,
      totalHard: data.totalHard,
      acceptanceRate: data.acceptanceRate,
      ranking: data.ranking,
      contributionPoints: data.contributionPoints,
      reputation: data.reputation,
      submissionCalendar: data.submissionCalendar
    };
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    return null;
  }
}
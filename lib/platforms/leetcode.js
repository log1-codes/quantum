// export async function getLeetcodeStats(username) {
//   try {
//     // Clean the username
//     const cleanUsername = username.replace('u/', '').replace(/\//g, '').trim();

//     // Base URL
//     const baseUrl = "https://alfa-leetcode-api.onrender.com";

//     // Fetch all required data
//     const [
//       userProfileResponse,
//       badgesResponse,
//       solvedResponse,
//       contestResponse,
//       calendarResponse,
//       languageStatsResponse,
//       skillStatsResponse,
//     ] = await Promise.all([
//       fetch(`${baseUrl}/userProfile/${cleanUsername}`),
//       fetch(`${baseUrl}/${cleanUsername}/badges`),
//       fetch(`${baseUrl}/${cleanUsername}/solved`),
//       fetch(`${baseUrl}/${cleanUsername}/contest`),
//       fetch(`${baseUrl}/${cleanUsername}/calendar`),
//       fetch(`${baseUrl}/languageStats?username=${cleanUsername}`),
//       fetch(`${baseUrl}/skillStats/${cleanUsername}`),
//     ]);

//     // Parse JSON responses
//     const userProfileData = await userProfileResponse.json();
//     const badgesData = await badgesResponse.json();
//     const solvedData = await solvedResponse.json();
//     const contestData = await contestResponse.json();
//     const calendarData = await calendarResponse.json();
//     const languageStatsData = await languageStatsResponse.json();
//     const skillStatsData = await skillStatsResponse.json();

//     // Construct the return object
//     return {
//       userProfile: {
//         username: cleanUsername,
//         totalSolved: solvedData.totalSolved || 0,
//         acceptanceRate: userProfileData.acceptanceRate || 0,
//         totalQuestions: userProfileData.totalQuestions || 0,
//         ranking: userProfileData.ranking || 0,
//       },
//       contestDetails: {
//         contestRanking: contestData.contestRanking || 0,
//         globalRanking: contestData.globalRanking || 0,
//         rating: contestData.rating || 0,
//       },
//       badges: {
//         currentBadges: badgesData.badges || [],
//         upcomingBadges: badgesData.upcomingBadges || [],
//       },
//       calendar: {
//         streak: calendarData.streak || 0,
//         maxStreak: calendarData.maxStreak || 0,
//         totalActiveDays: calendarData.totalActiveDays || 0,
//       },
//       languageStats: languageStatsData.languages || [],
//       skillStats: skillStatsData.skills || [],
//       lastUpdated: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error("LeetCode API Error:", error);
//     return null;
//   }
// }


// leetcode.js
const baseUrl = "https://alfa-leetcode-api.onrender.com";

export async function getLeetcodeStats(username) {
  try {
    // Fetching user details from the correct endpoint
    const userDetailsResponse = await fetch(`${baseUrl}/${username}`);
    if (!userDetailsResponse.ok) {
      throw new Error(`Error fetching user details: ${userDetailsResponse.statusText}`);
    }
    
    // Parsing the JSON data for user details
    const userDetails = await userDetailsResponse.json();

    // Fetching solved problems data
    const solvedResponse = await fetch(`${baseUrl}/${username}/solved`);
    if (!solvedResponse.ok) {
      throw new Error(`Error fetching solved problems: ${solvedResponse.statusText}`);
    }

    // Parsing the JSON data for solved problems
    const solvedData = await solvedResponse.json();


    const badges= await fetch(`${baseUrl}/${username}/badges`)
    if(!badges.ok)
    {
      throw new Error(`Error fetching badges data : ${badges.statusText}`)
    }
    const badgesData = await badges.json();

    const contests = await fetch(`${baseUrl}/${username}/contest`);
    if(!contests.ok)
    {
        throw new Error(`Error Fetching Contest data : ${contests.statusText}`)
    }
    const contestData = await contests.json(); 
    return {
      ...userDetails,
      solvedProblems: solvedData,
      badgesData:badgesData ,
      contestData
    };
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    return null; 
  }
}

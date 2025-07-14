const baseUrl = process.env.NEXT_PUBLIC_LEETCODE_BASE_URL;

export async function getLeetcodeStats(username) {
  try {
    const response = await fetch(`${baseUrl}/${username}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();

    if (data.status === "error") {
      // console.log("User  does not exist or has no data.");
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
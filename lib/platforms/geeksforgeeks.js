const base_url = process.env.NEXT_PUBLIC_GEEKS_FOR_GEEKS_BASE_URL;
export async function getGeeksForGeeksStats(username) {
  try {
    const response = await fetch(`${base_url}/${username}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status === "error") {
      // console.log("User does not exist or has no data.");
      return {
        success: false,
        message: "User does not exist or has no data.",
        data: null,
      };
    }
    
    const formattedData = {
      userInfo: {
        userName: data.info.userName,
        fullName: data.info.fullName,
        profilePicture: data.info.profilePicture,
        institute: data.info.institute,
        instituteRank: data.info.instituteRank,
        currentStreak: data.info.currentStreak,
        maxStreak: data.info.maxStreak,
        codingScore: data.info.codingScore,
        monthlyScore: data.info.monthlyScore,
        totalProblemsSolved: data.info.totalProblemsSolved,
      },
      solvedStats: {
        easy: data.solvedStats.easy.count,
        medium: data.solvedStats.medium.count,
        basic: data.solvedStats.basic.count,
        hard: data.solvedStats.hard.count,
      },
      solvedQuestions: {
        easy: data.solvedStats.easy.questions,
        medium: data.solvedStats.medium.questions,
        basic: data.solvedStats.basic.questions,
        hard: data.solvedStats.hard.questions,
      }
    };

    return {
      success: true,
      data: formattedData,
    };
    
  } catch (error) {
    console.error('Error fetching GeeksforGeeks data:', error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching data.",
      data: null,
    };
  }
}

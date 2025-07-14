const baseUrl = process.env.NEXT_PUBLIC_CODECHEF_BASE_URL;
export async function verifyCodechef(username) {
  try {
    const response = await fetch(`${baseUrl}/user-stats/${username}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export async function getCodechefStats(username) {
  try {
    const response1 = await fetch(`${baseUrl}/user-stats/${username}`);
    const data1 = await response1.json();

    const response2 = await fetch(`https://coding-platform-profile-api.onrender.com/codechef/${username}`);
    const data2 = await response2.json();

    if (!data1.username) {
      throw new Error('Failed to fetch data');
    }
    if(!data2.username){
      throw new Error('Failed to fetch data');
    }
    // console.log(data1);
    // console.log(data2);
    return {
      badges: data1.badges,
      country: data1.country,
      division: data1.division, 
      globalRank: data1.global_rank,
      countryRank: data2.country_rank,
      institution: data1.institution,
      problemsSolved: data1.problem_fully_solved,
      rating: data1.rating,
      totalStars: data1.total_stars,
      username: data1.username,
      contests : data2.no_of_contest,

    };
  } catch (error) {
    console.error('Error fetching CodeChef stats:', error);
    return null;
  }
}
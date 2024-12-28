export async function verifyCodechef(username) {
  try {
    const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export async function getCodechefStats(username) {
  try {
    const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to fetch data');
    }

    return {
      profilePicture: data.profile,
      name: data.name.trim(),
      currentRating: data.currentRating,
      highestRating: data.highestRating,
      countryFlag: data.countryFlag,
      countryName: data.countryName,
      globalRank: data.globalRank,
      countryRank: data.countryRank,
      stars: data.stars,
      heatMap: data.heatMap,
      ratingData: data.ratingData
    };
  } catch (error) {
    console.error('Error fetching CodeChef stats:', error);
    return null;
  }
}
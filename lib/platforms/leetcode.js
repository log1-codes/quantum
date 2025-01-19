const baseUrl = "https://alfa-leetcode-api.onrender.com";

export async function getLeetcodeStats(username) {
  try {
    const userDetailsResponse = await fetch(`${baseUrl}/${username}`);
    if (!userDetailsResponse.ok) {
      throw new Error(`Error fetching user details: ${userDetailsResponse.statusText}`);
    }
    const userDetails = await userDetailsResponse.json();
    const solvedResponse = await fetch(`${baseUrl}/${username}/solved`);
    if (!solvedResponse.ok) {
      throw new Error(`Error fetching solved problems: ${solvedResponse.statusText}`);
    }
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

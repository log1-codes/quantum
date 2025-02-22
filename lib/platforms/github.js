const baseUrl = "https://api.github.com/users";

export async function getGithubStats(username) {
  try {
    const userData = await fetch(`${baseUrl}/${username}`);
    const repoData = await fetch(`${baseUrl}/${username}/repos`);
    const followersData = await fetch(`${baseUrl}/${username}/followers`);
    const followingData = await fetch(`${baseUrl}/${username}/following`,);
    const starredData = await fetch(`${baseUrl}/${username}/starred`);
    const gistsData = await fetch(`${baseUrl}/${username}/gists`);
    const eventsData = await fetch(`${baseUrl}/${username}/events/public`);
    const orgsData = await fetch(`${baseUrl}/${username}/orgs`);
    const receivedEventsData = await fetch(
      `${baseUrl}/${username}/received_events`);
    const keysData = await fetch(`${baseUrl}/${username}/keys`);
    const blockedData = await fetch(`${baseUrl}/${username}/blocks`);
    const subscriptionsData = await fetch(
      `${baseUrl}/${username}/subscriptions`
    );

    return {
      user: await userData.json(),
      repos: await repoData.json().catch(() => []), 
      followers: await followersData.json(),
      following: await followingData.json(),
      starred: await starredData.json(),
      gists: await gistsData.json(),
      events: await eventsData.json().catch(() => []), 
      orgs: await orgsData.json().catch(() => []), 
      receivedEvents: await receivedEventsData.json(),
      keys: await keysData.json(),
      blocked: await blockedData.json(),
      subscriptions: await subscriptionsData.json(),
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return {
      user: {},
      repos: [], 
      followers: [],
      following: [],
      starred: [],
      gists: [],
      events: [],
      orgs: [], 
      receivedEvents: [],
      keys: [],
      blocked: [],
      subscriptions: [],
    };
  }
}
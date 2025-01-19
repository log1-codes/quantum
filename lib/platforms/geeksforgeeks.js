import { JSDOM } from 'jsdom';

export async function getGeeksforgeeksStats(username) {
  try {
    const response = await fetch(`https://auth.geeksforgeeks.org/user/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const getTextContent = (selector) => {
      const element = document.querySelector(selector);
      return element ? element.textContent.trim() : '';
    };

    const parseIntFromSelector = (selector) => {
      const text = getTextContent(selector);
      return parseInt(text.replace(/,/g, '')) || 0;
    };

    const parseFloatFromSelector = (selector) => {
      const text = getTextContent(selector);
      return parseFloat(text) || 0;
    };

    const stats = {
      username,
      instituteName: getTextContent('.basic_details_data'),
      codingScore: parseIntFromSelector('.score_card_value'),
      problemsSolved: parseIntFromSelector('.problems_solved_value'),
      monthlyCodingScore: parseIntFromSelector('.monthly_coding_score_value'),
      currentStreak: parseIntFromSelector('.streak_value'),
      maxStreak: parseIntFromSelector('.max_streak_value'),
      overallCodingPercentile: parseFloatFromSelector('.percentile_value'),
      contestRating: parseIntFromSelector('.rating_value'),
      globalRank: parseIntFromSelector('.rank_value'),
      instituteRank: parseIntFromSelector('.rank_value:nth-child(2)'),
      totalGeekBits: parseIntFromSelector('.geekbits_value'),
      articleCount: parseIntFromSelector('.article_value'),
      discussCount: parseIntFromSelector('.discuss_value'),
      lastUpdated: new Date().toISOString()
    };

    const languageStats = document.querySelectorAll('.lang-stats');
    stats.languageStats = Array.from(languageStats).map(stat => ({
      language: stat.querySelector('.language')?.textContent?.trim() || '',
      solved: parseInt(stat.querySelector('.solved')?.textContent?.split(' ')[0] || '0')
    }));


    return stats;
  } catch (error) {
    console.error('Error fetching GFG stats:', error);
    return null;
  }
}


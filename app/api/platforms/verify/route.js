import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { platform, username } = await request.json();
    let isValid = false;
    
    switch (platform) {
      case 'leetcode':
        isValid = await verifyLeetcode(username);
        break;
      case 'codechef':
        isValid = await verifyCodechef(username);
        break;
      case 'codeforces':
        isValid = await verifyCodeforces(username);
        break;
      case 'geeksforgeeks':
        isValid = await verifyGeeksforgeeks(username);
        break;

      case 'github':
        isValid = await verifyGithub(username);
        break; 
    }

    return NextResponse.json({ isValid });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify username' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongoose';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const db = await connectDB();
    const usersCollection = db.collection('users');
    const messagesCollection = db.collection('messages');

    if (query) {
      // Search users by query
      const users = await usersCollection.find({
        $and: [
          { 
            $or: [
              { email: { $regex: query, $options: 'i' } },
              { name: { $regex: query, $options: 'i' } }
            ]
          },
          { email: { $ne: session.user.email } }
        ]
      }).project({
        name: 1,
        email: 1,
        image: 1,
      }).limit(10).toArray();

      return NextResponse.json({ users });
    } else {
      // Get user list of people the current user has talked with
      const sentMessages = await messagesCollection.distinct('recipientEmail', { senderEmail: session.user.email });
      const receivedMessages = await messagesCollection.distinct('senderEmail', { recipientEmail: session.user.email });
      const userEmails = Array.from(new Set([...sentMessages, ...receivedMessages]));

      const users = await usersCollection.find({
        email: { $in: userEmails }
      }).project({
        name: 1,
        email: 1,
        image: 1,
      }).toArray();

      return NextResponse.json({ users });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
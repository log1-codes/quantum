import connectDB from '@/lib/mongoose';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectDB();
    const messagesCollection = db.collection('messages');
    const { senderEmail, senderName, senderImage, recipientEmail, content } = await request.json();
    const message = {
      senderEmail: session.user.email,
      senderName: session.user.name,
      senderImage: session.user.image,
      recipientEmail,
      content,
      timestamp: new Date(),
    };

    await messagesCollection.insertOne(message);
    return NextResponse.json(message);
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const recipientEmail = searchParams.get('recipientEmail');

  try {
    const db = await connectDB();
    const messagesCollection = db.collection('messages');

    const messages = await messagesCollection.find({
      $or: [
        { senderEmail: session.user.email, recipientEmail },
        { senderEmail: recipientEmail, recipientEmail: session.user.email }
      ]
    })
    .sort({ timestamp: 1 })
    .toArray();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Message fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
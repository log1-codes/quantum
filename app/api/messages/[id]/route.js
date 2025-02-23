import connectDB from '@/lib/mongoose';
import Message from '@/models/Message';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    await connectDB();
    const { id } = await params;

    try {
        const message = await Message.findById(id);
        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    await connectDB();
    const { id } = params;
    const { content } = await request.json();

    try {
        const updatedMessage = await Message.findByIdAndUpdate(id, { content }, { new: true });
        if (!updatedMessage) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json(updatedMessage);
    } catch (error) {
        console.error('Error updating message:', error);
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await connectDB();
    const { id } = params;

    try {
        const deletedMessage = await Message.findByIdAndDelete(id);
        if (!deletedMessage) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}


export async function POST(request, { params }) {
    await connectDB();
    const { id } = params;
    const { reaction } = await request.json();

    try {
        const message = await Message.findById(id);
        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        if (!message.reactions) {
            message.reactions = [];
        }
        message.reactions.push(reaction);
        await message.save();

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error adding reaction:', error);
        return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
    }
}
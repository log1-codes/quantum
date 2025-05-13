import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!data.platforms) {
      data.platforms = {};
    }
    if(!data.socials) {
      data.socials = {} ;
    }
    Object.keys(data.platforms).forEach(platform => {
      data.platforms[platform] = data.platforms[platform]?.trim() || '';
    });
    
    Object.keys(data.socials).forEach(social=>{
      data.socials[social] = data.socials[social]?.trim()||'';
    })
    console.log("Updating user with data:", data);

    await connectDB();
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name: data.name,
        username: data.username,
        platforms: data.platforms,
        socials : data.socials
      },
      { new: true, upsert: true }
    );


    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
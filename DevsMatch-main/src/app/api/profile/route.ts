import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getLanguageColor } from '@/lib/github-utils';

// Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get user with GitHub data
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Format user data with language colors
    const formattedUser = {
      ...user,
      languages: (user.languages || []).map(lang => ({
        name: lang,
        color: getLanguageColor(lang),
      })),
    };
    
    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { tagline, location, interests } = await request.json();
    
    // Validate data
    const updateData: any = {};
    
    if (tagline !== undefined) {
      updateData.tagline = tagline;
    }
    
    if (location !== undefined) {
      updateData.location = location;
    }
    
    if (interests !== undefined && Array.isArray(interests)) {
      updateData.interests = interests;
    }
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
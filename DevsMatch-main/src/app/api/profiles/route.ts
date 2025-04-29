import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { sortProfilesByMatchScore } from '@/lib/matching-algorithm';
import { getLanguageColor } from '@/lib/github-utils';
import { UserProfile } from '@/types';

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
    
    // Get current user's profile
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    // Get already swiped users
    const swiped = await prisma.swipe.findMany({
      where: {
        userId,
      },
      select: {
        targetId: true,
      },
    });
    
    const swipedIds = swiped.map(s => s.targetId);
    
    // Get potential matches (users that haven't been swiped yet)
    const potentialMatches = await prisma.user.findMany({
      where: {
        id: {
          not: userId, // Not the current user
          notIn: swipedIds, // Not already swiped
        },
        githubId: {
          not: null, // Must have GitHub data
        },
      },
      take: 10, // Limit to 10 profiles
    });
    
    // Transform database users to UserProfile format
    const currentUserProfile: UserProfile = {
      id: currentUser.id,
      username: currentUser.username || '',
      name: currentUser.name,
      avatarUrl: currentUser.avatarUrl || '',
      bio: currentUser.bio || null,
      tagline: currentUser.tagline || null,
      location: currentUser.location || null,
      languages: (currentUser.languages || []).map(lang => ({
        name: lang,
        percentage: 0, // We don't have percentages here
        color: getLanguageColor(lang),
      })),
      repos: currentUser.repos as any[] || [],
      activityLevel: currentUser.activityLevel || 'medium',
      interests: currentUser.interests || [],
    };
    
    const potentialMatchProfiles: UserProfile[] = potentialMatches.map(user => ({
      id: user.id,
      username: user.username || '',
      name: user.name,
      avatarUrl: user.avatarUrl || '',
      bio: user.bio || null,
      tagline: user.tagline || null,
      location: user.location || null,
      languages: (user.languages || []).map(lang => ({
        name: lang,
        percentage: 0,
        color: getLanguageColor(lang),
      })),
      repos: user.repos as any[] || [],
      activityLevel: user.activityLevel || 'medium',
      interests: user.interests || [],
    }));
    
    // Sort profiles by match score
    const sortedProfiles = sortProfilesByMatchScore(
      currentUserProfile,
      potentialMatchProfiles
    );
    
    return NextResponse.json(sortedProfiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}
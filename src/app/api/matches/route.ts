import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getLanguageColor } from '@/lib/github-utils';

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
    
    // Get all matches for the current user
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: true,
        user2: true,
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1, // Get only the last message
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Format matches to show the other user's data
    const formattedMatches = matches.map(match => {
      // Determine which user is the other user (not the current user)
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      
      return {
        id: match.id,
        matchedAt: match.createdAt,
        user: {
          id: otherUser.id,
          username: otherUser.username,
          name: otherUser.name,
          avatarUrl: otherUser.avatarUrl,
          bio: otherUser.bio,
          tagline: otherUser.tagline,
          location: otherUser.location,
          languages: (otherUser.languages || []).map(lang => ({
            name: lang,
            percentage: 0, // We don't store percentages in DB
            color: getLanguageColor(lang),
          })),
        },
        lastMessage: match.messages[0] || null,
      };
    });
    
    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
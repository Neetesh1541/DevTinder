import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { targetId, liked } = await request.json();
    
    // Validate inputs
    if (!targetId || typeof liked !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Create swipe record
    const swipe = await prisma.swipe.create({
      data: {
        userId,
        targetId,
        liked,
      },
    });
    
    let match = null;
    
    // Check for mutual likes (match)
    if (liked) {
      const mutualLike = await prisma.swipe.findFirst({
        where: {
          userId: targetId,
          targetId: userId,
          liked: true,
        },
      });
      
      // If mutual like found, create a match
      if (mutualLike) {
        match = await prisma.match.create({
          data: {
            user1Id: userId,
            user2Id: targetId,
          },
          include: {
            user2: true, // Include the matched user's data
          },
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      swipe,
      match, // Will be null if no match was made
    });
  } catch (error) {
    console.error('Error processing swipe:', error);
    return NextResponse.json(
      { error: 'Failed to process swipe' },
      { status: 500 }
    );
  }
}
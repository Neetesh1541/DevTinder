'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { UserProfile } from '@/types';
import { ProfileCard } from '@/components/profile-card';
import { MatchNotification } from '@/components/match-notification';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/');
  }
  
  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/profiles');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }
        
        const data = await response.json();
        setProfiles(data);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchProfiles();
    }
  }, [status]);
  
  // Handle swipe action
  const handleSwipe = async (liked: boolean) => {
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    
    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId: currentProfile.id,
          liked,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process swipe');
      }
      
      const data = await response.json();
      
      // Check if there's a match
      if (data.match) {
        setMatchedUser(currentProfile);
        setMatchId(data.match.id);
      }
      
      // Move to next profile
      setCurrentIndex(currentIndex + 1);
    } catch (err) {
      console.error('Error processing swipe:', err);
    }
  };
  
  // Clear match notification
  const handleClearMatch = () => {
    setMatchedUser(null);
    setMatchId(null);
  };
  
  return (
    <div className="flex flex-col">
      <main className="flex-1 container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Find Your Coding Partner</h1>
          <p className="text-muted-foreground">
            Swipe right to connect, left to pass
          </p>
        </div>
        
        <div className="flex justify-center">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          ) : profiles.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No profiles found</h2>
              <p className="text-muted-foreground">
                We couldn't find any developers for you right now. Check back later!
              </p>
            </div>
          ) : currentIndex >= profiles.length ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">That's everyone!</h2>
              <p className="text-muted-foreground">
                You've seen all available profiles. Check back later for more!
              </p>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  window.location.reload();
                }}
                className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Start Over
              </button>
            </div>
          ) : (
            <ProfileCard
              profile={profiles[currentIndex]}
              onSwipe={handleSwipe}
            />
          )}
        </div>
      </main>
      
      {/* Match notification */}
      <MatchNotification
        matchedUser={matchedUser}
        matchId={matchId}
        onClose={handleClearMatch}
      />
    </div>
  );
}
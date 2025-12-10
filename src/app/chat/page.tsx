'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Match } from '@/types';
import { MatchCard } from '@/components/match-card';
import { MessageSquare } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/');
  }
  
  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/matches');
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchMatches();
    }
  }, [status]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Chat with your matched developers
          </p>
        </div>
        
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
        ) : matches.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
            <p className="text-muted-foreground mb-4">
              You haven't matched with any developers yet. Start swiping to find your coding partner!
            </p>
            <a
              href="/dashboard"
              className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start Swiping
            </a>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/header';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tagline, setTagline] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tagline,
          location,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Redirect to dashboard after successful update
      router.push('/dashboard');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user || null} />
      
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Add a few more details to help us match you with the right developers
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tagline */}
              <div>
                <label htmlFor="tagline" className="block text-sm font-medium mb-1">
                  Tagline
                </label>
                <input
                  id="tagline"
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="E.g., React dev seeking AI collaborators"
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  maxLength={100}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  A short description of what you're looking for
                </p>
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country or Remote"
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  maxLength={100}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Where you're based or if you prefer remote collaboration
                </p>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              
              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Save and Continue'
                  )}
                </button>
              </div>
              
              {/* Skip link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Skip for now
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
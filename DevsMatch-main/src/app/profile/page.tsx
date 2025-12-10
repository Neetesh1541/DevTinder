'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { LanguageBadge } from '@/components/langauge-badge';
import { Github, User, MapPin, Edit, Check, Star } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  githubId: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  tagline: string | null;
  languages: { name: string; color: string }[];
  repos: any[];
  activityLevel: string | null;
  interests: string[];
  location: string | null;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editing states
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newTagline, setNewTagline] = useState('');
  const [newLocation, setNewLocation] = useState('');
  
  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/');
  }
  
  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setUserData(data);
        setNewTagline(data.tagline || '');
        setNewLocation(data.location || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status]);
  
  // Handle updating profile
  const updateProfile = async (data: any) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedData = await response.json();
      setUserData(updatedData);
      
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };
  
  // Handle tagline update
  const handleTaglineUpdate = async () => {
    if (await updateProfile({ tagline: newTagline })) {
      setIsEditingTagline(false);
    }
  };
  
  // Handle location update
  const handleLocationUpdate = async () => {
    if (await updateProfile({ location: newLocation })) {
      setIsEditingLocation(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            View and edit your developer profile
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
        ) : userData ? (
          <div className="grid gap-8 md:grid-cols-3">
            {/* Left column - Avatar and basic info */}
            <div className="md:col-span-1">
              <div className="rounded-lg border bg-card overflow-hidden">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={userData.avatarUrl || 'https://github.com/identicons/github.png'}
                    alt={userData.name || userData.username || 'User'}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-1">
                    {userData.name || userData.username}
                  </h2>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Github size={14} className="mr-1" />
                    <a 
                      href={`https://github.com/${userData.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {userData.username}
                    </a>
                  </div>
                  
                  {/* Tagline */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Tagline</span>
                      <button
                        onClick={() => setIsEditingTagline(!isEditingTagline)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isEditingTagline ? <Check size={14} /> : <Edit size={14} />}
                      </button>
                    </div>
                    
                    {isEditingTagline ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          value={newTagline}
                          onChange={(e) => setNewTagline(e.target.value)}
                          placeholder="Add a tagline"
                          className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          maxLength={100}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setNewTagline(userData.tagline || '');
                              setIsEditingTagline(false);
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleTaglineUpdate}
                            className="text-xs text-primary hover:text-primary/90"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        {userData.tagline || 'No tagline set'}
                      </p>
                    )}
                  </div>
                  
                  {/* Location */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Location</span>
                      <button
                        onClick={() => setIsEditingLocation(!isEditingLocation)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isEditingLocation ? <Check size={14} /> : <Edit size={14} />}
                      </button>
                    </div>
                    
                    {isEditingLocation ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          placeholder="Add location (City, Country or Remote)"
                          className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          maxLength={100}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setNewLocation(userData.location || '');
                              setIsEditingLocation(false);
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleLocationUpdate}
                            className="text-xs text-primary hover:text-primary/90"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin size={14} className="mr-1" />
                        <span>{userData.location || 'No location set'}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Activity Level */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Activity Level</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userData.activityLevel === 'high' 
                        ? 'Very active' 
                        : userData.activityLevel === 'medium' 
                          ? 'Moderately active' 
                          : userData.activityLevel === 'low'
                            ? 'Occasionally active'
                            : 'No data'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Detailed info */}
            <div className="md:col-span-2">
              {/* Bio */}
              <div className="rounded-lg border bg-card p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2">Bio</h3>
                <p className="text-muted-foreground">
                  {userData.bio || 'No bio available'}
                </p>
              </div>
              
              {/* Languages */}
              <div className="rounded-lg border bg-card p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Languages</h3>
                {userData.languages && userData.languages.length > 0 ? (
                  <div className="flex flex-wrap">
                    {userData.languages.map((lang) => (
                      <LanguageBadge 
                        key={lang.name}
                        name={lang.name}
                        color={lang.color}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No languages found</p>
                )}
              </div>
              
              {/* Interests */}
              <div className="rounded-lg border bg-card p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Interests</h3>
                {userData.interests && userData.interests.length > 0 ? (
                  <div className="flex flex-wrap">
                    {userData.interests.map((interest) => (
                      <span 
                        key={interest}
                        className="mr-2 mb-2 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No interests found</p>
                )}
              </div>
              
              {/* Repositories */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Featured Repositories</h3>
                {userData.repos && userData.repos.length > 0 ? (
                  <div className="space-y-4">
                    {userData.repos.map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-md border bg-background p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{repo.name}</span>
                          {repo.stars > 0 && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Star size={12} className="mr-1" />
                              <span>{repo.stars}</span>
                            </div>
                          )}
                        </div>
                        {repo.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {repo.description}
                          </p>
                        )}
                        {repo.language && (
                          <div className="mt-2">
                            <LanguageBadge name={repo.language} />
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No repositories found</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
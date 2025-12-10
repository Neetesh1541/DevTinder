'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { LanguageBadge } from './langauge-badge';
import { Github, Star, MapPin, Activity, Award } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ProfileCardProps {
  profile: UserProfile;
  onSwipe: (liked: boolean) => void;
  animate?: boolean;
}

export function ProfileCard({ profile, onSwipe, animate = true }: ProfileCardProps) {
  const [direction, setDirection] = useState<null | 'left' | 'right'>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate card rotation based on drag position
  const getRotation = () => {
    return position.x * 0.05; // Rotate proportionally to drag distance
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Check if dragged far enough to trigger a swipe
    if (position.x > 100) {
      // Swiped right
      setDirection('right');
      setTimeout(() => onSwipe(true), 200);
    } else if (position.x < -100) {
      // Swiped left
      setDirection('left');
      setTimeout(() => onSwipe(false), 200);
    } else {
      // Reset position if not dragged far enough
      setPosition({ x: 0, y: 0 });
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="relative h-[32rem] w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
        initial={animate ? { scale: 0.8, opacity: 0 } : false}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: direction === 'left' ? -1000 : direction === 'right' ? 1000 : position.x,
          y: position.y,
          rotate: getRotation()
        }}
        exit={{ 
          x: direction === 'left' ? -1000 : 1000,
          opacity: 0,
          transition: { duration: 0.2 }
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 50
        }}
        drag={!direction}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.9}
        onDrag={(_ : any, info : any) => {
          setIsDragging(true);
          setPosition({ x: info.offset.x, y: info.offset.y });
        }}
        onDragEnd={handleDragEnd}
      >
        {/* Match score indicator if available */}
        {profile.matchScore !== undefined && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-primary-foreground">
              <Award size={14} />
              <span className="text-sm font-medium">{profile.matchScore}% Match</span>
            </div>
          </div>
        )}
        
        {/* Swipe indicators */}
        {isDragging && (
          <>
            {position.x > 60 && (
              <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 rotate-[-20deg]">
                <span className="block rounded-md bg-green-500 px-4 py-2 font-semibold uppercase tracking-wider text-white">
                  Like
                </span>
              </div>
            )}
            {position.x < -60 && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 rotate-[20deg]">
                <span className="block rounded-md bg-red-500 px-4 py-2 font-semibold uppercase tracking-wider text-white">
                  Pass
                </span>
              </div>
            )}
          </>
        )}
        
        {/* Profile image */}
        <div className="h-1/2 overflow-hidden">
          <img 
            src={profile.avatarUrl} 
            alt={profile.username} 
            className="h-full w-full object-cover"
          />
        </div>
        
        {/* Profile info */}
        <div className="h-1/2 overflow-y-auto p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {profile.name || profile.username}
              </h2>
              <div className="flex items-center text-muted-foreground">
                <Github size={16} className="mr-1" />
                <a 
                  href={`https://github.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  {profile.username}
                </a>
              </div>
            </div>
            
            {profile.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin size={14} className="mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
          
          {/* Tagline */}
          {profile.tagline && (
            <p className="mb-3 text-sm italic text-muted-foreground">
              "{profile.tagline}"
            </p>
          )}
          
          {/* Bio */}
          {profile.bio && (
            <p className="mb-4 text-sm text-foreground">
              {profile.bio}
            </p>
          )}
          
          {/* Activity level */}
          <div className="mb-2 flex items-center">
            <Activity size={14} className="mr-1 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {profile.activityLevel === 'high' 
                ? 'Very active' 
                : profile.activityLevel === 'medium' 
                  ? 'Moderately active' 
                  : 'Occasionally active'}
            </span>
          </div>
          
          {/* Languages */}
          <div className="mb-4">
            <h3 className="mb-1 text-sm font-medium">Top Languages</h3>
            <div className="flex flex-wrap">
              {profile.languages.map((lang) => (
                <LanguageBadge 
                  key={lang.name}
                  name={lang.name}
                  color={lang.color}
                  percentage={lang.percentage > 0 ? lang.percentage : undefined}
                />
              ))}
            </div>
          </div>
          
          {/* Interests */}
          {profile.interests.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-1 text-sm font-medium">Interests</h3>
              <div className="flex flex-wrap">
                {profile.interests.map((interest) => (
                  <span 
                    key={interest}
                    className="mr-2 mb-2 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Top repos */}
          {profile.repos && profile.repos.length > 0 && (
            <div>
              <h3 className="mb-1 text-sm font-medium">Featured Repositories</h3>
              <div className="space-y-2">
                {profile.repos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border bg-card p-2 hover:bg-accent/50 transition-colors"
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
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
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
            </div>
          )}
        </div>
        
        {/* Control buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8">
          <button
            onClick={() => {
              setDirection('left');
              setTimeout(() => onSwipe(false), 200);
            }}
            className="h-14 w-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button
            onClick={() => {
              setDirection('right');
              setTimeout(() => onSwipe(true), 200);
            }}
            className="h-14 w-14 rounded-full bg-white shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { confetti } from '@/lib/confetti';
import Link from 'next/link';
import { LanguageBadge } from './langauge-badge';
import { Github, MessageCircle } from 'lucide-react';

interface MatchNotificationProps {
  matchedUser: UserProfile | null;
  matchId: string | null;
  onClose: () => void;
}

export function MatchNotification({ 
  matchedUser, 
  matchId, 
  onClose 
}: MatchNotificationProps) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (matchedUser) {
      setVisible(true);
      
      // Show confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setVisible(false);
    }
  }, [matchedUser]);
  
  if (!matchedUser || !matchId) return null;
  
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative mx-auto max-w-md rounded-xl bg-card p-6 shadow-xl"
          >
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">It's a Match!</h2>
              <p className="mb-6 text-muted-foreground">
                You and {matchedUser.name || matchedUser.username} have liked each other
              </p>
            </div>
            
            <div className="mb-6 flex justify-center space-x-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-primary bg-muted">
                <img 
                  src={matchedUser.avatarUrl} 
                  alt={matchedUser.username} 
                  className="h-full w-full object-cover" 
                />
              </div>
            </div>
            
            <div className="mb-4 text-center">
              <h3 className="text-xl font-bold">
                {matchedUser.name || matchedUser.username}
              </h3>
              
              <div className="mt-1 flex items-center justify-center text-sm text-muted-foreground">
                <Github size={16} className="mr-1" />
                <a 
                  href={`https://github.com/${matchedUser.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {matchedUser.username}
                </a>
              </div>
              
              {matchedUser.tagline && (
                <p className="mt-2 text-sm italic">"{matchedUser.tagline}"</p>
              )}
            </div>
            
            <div className="mb-4 flex flex-wrap justify-center">
              {matchedUser.languages.slice(0, 5).map((lang) => (
                <LanguageBadge 
                  key={lang.name}
                  name={lang.name}
                  color={lang.color}
                />
              ))}
            </div>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => {
                  setVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Keep Swiping
              </button>
              
              <Link
                href={`/chat/${matchId}`}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setVisible(false);
                  setTimeout(onClose, 300);
                }}
              >
                <MessageCircle size={16} className="mr-1" />
                <span>Send Message</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
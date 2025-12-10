'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Match } from '@/types';
import { LanguageBadge } from './langauge-badge';
import { Github, MessageCircle } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const { id, user, createdAt, lastMessage } = match;
  
  return (
    <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">
                {user.name || user.username}
              </h3>
              <span className="text-xs text-muted-foreground">
                Matched {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
            </div>
            
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <Github size={12} className="mr-1" />
              <span className="truncate">
                {user.username}
              </span>
            </div>
            
            {/* Languages */}
            <div className="mt-2 flex flex-wrap">
              {user.languages.slice(0, 3).map((lang) => (
                <LanguageBadge 
                  key={lang.name}
                  name={lang.name}
                  color={lang.color}
                  className="text-[10px] py-0 px-2"
                />
              ))}
              {user.languages.length > 3 && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mr-1 mb-1 bg-muted text-muted-foreground">
                  +{user.languages.length - 3} more
                </span>
              )}
            </div>
            
            {/* Last message */}
            {lastMessage && (
              <div className="mt-2 flex items-start gap-1">
                <MessageCircle size={14} className="mt-0.5 flex-shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">
                  {lastMessage.content}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="border-t p-2">
        <div className="flex justify-end">
          <Link
            href={`/chat/${id}`}
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <MessageCircle size={14} className="mr-1" />
            <span>Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
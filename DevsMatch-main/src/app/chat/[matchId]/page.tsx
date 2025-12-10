'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Message, UserProfile } from '@/types';
import { Header } from '@/components/layout/header';
import { ChatInterface } from '@/components/ui/chat-interface';
import { LanguageBadge } from '@/components/ui/language-badge';
import { Github, ArrowLeft } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const matchId = params.matchId as string;
  
  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }
  
  // Fetch messages and match data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch messages
        const messagesResponse = await fetch(`/api/messages?matchId=${matchId}`);
        
        if (!messagesResponse.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
        
        // Get matched user from the first message
        if (messagesData.length > 0) {
          const firstMessage = messagesData[0];
          const sender = firstMessage.sender;
          
          // If the sender is not the current user, then it's the matched user
          if (sender.id !== session?.user?.id) {
            setMatchedUser({
              id: sender.id,
              username: sender.username,
              avatarUrl: sender.avatarUrl,
              name: null,
              bio: null,
              tagline: null,
              location: null,
              languages: [],
              repos: [],
              activityLevel: 'medium',
              interests: [],
            });
          } else {
            // Otherwise, the receiver is the matched user
            // We would need to fetch this information separately
            
            // For simplicity, just showing a placeholder
            setMatchedUser({
              id: firstMessage.receiverId,
              username: 'github_user',
              avatarUrl: 'https://github.com/identicons/github.png',
              name: null,
              bio: null,
              tagline: null,
              location: null,
              languages: [],
              repos: [],
              activityLevel: 'medium',
              interests: [],
            });
          }
        } else {
          // If no messages, fetch match data
          const matchesResponse = await fetch('/api/matches');
          
          if (!matchesResponse.ok) {
            throw new Error('Failed to fetch match data');
          }
          
          const matchesData = await matchesResponse.json();
          const match = matchesData.find((m: any) => m.id === matchId);
          
          if (match) {
            setMatchedUser(match.user);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load chat data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, matchId, session?.user?.id]);
  
  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          content,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await response.json();
      setMessages([...messages, newMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header user={session?.user || null} />
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* User info sidebar (desktop) */}
        <div className="hidden md:block w-1/3 max-w-sm border-r overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : matchedUser ? (
            <div>
              <div className="mb-4 flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-2 rounded-full p-1 hover:bg-muted"
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="text-xl font-bold">Chat</h2>
              </div>
              
              <div className="text-center mb-6">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
                  <img
                    src={matchedUser.avatarUrl}
                    alt={matchedUser.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <h3 className="mt-4 text-lg font-bold">
                  {matchedUser.name || matchedUser.username}
                </h3>
                
                <div className="mt-1 flex items-center justify-center text-sm text-muted-foreground">
                  <Github size={14} className="mr-1" />
                  <a 
                    href={`https://github.com/${matchedUser.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {matchedUser.username}
                  </a>
                </div>
              </div>
              
              {matchedUser.tagline && (
                <p className="mb-4 text-sm italic text-center">
                  "{matchedUser.tagline}"
                </p>
              )}
              
              {matchedUser.bio && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Bio</h4>
                  <p className="text-sm text-muted-foreground">
                    {matchedUser.bio}
                  </p>
                </div>
              )}
              
              {matchedUser.languages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Languages</h4>
                  <div className="flex flex-wrap">
                    {matchedUser.languages.map((lang) => (
                      <LanguageBadge 
                        key={lang.name}
                        name={lang.name}
                        color={lang.color}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {matchedUser.interests.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Interests</h4>
                  <div className="flex flex-wrap">
                    {matchedUser.interests.map((interest) => (
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
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center">
              <p className="text-muted-foreground">No match data available</p>
            </div>
          )}
        </div>
        
        {/* Mobile header */}
        <div className="md:hidden border-b p-3 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 rounded-full p-1 hover:bg-muted"
          >
            <ArrowLeft size={20} />
          </button>
          
          {matchedUser && (
            <div className="flex items-center">
              <div className="h-8 w-8 mr-2 overflow-hidden rounded-full">
                <img
                  src={matchedUser.avatarUrl}
                  alt={matchedUser.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm">
                  {matchedUser.name || matchedUser.username}
                </h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Github size={10} className="mr-1" />
                  <span>{matchedUser.username}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <p className="text-muted-foreground">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <ChatInterface
              messages={messages}
              currentUserId={session?.user?.id || ''}
              matchId={matchId}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
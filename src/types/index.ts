export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

export interface GithubLanguage {
  name: string;
  percentage: number;
}

export interface UserLanguage {
  name: string;
  percentage: number;
  color: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  tagline: string | null;
  location: string | null;
  languages: UserLanguage[];
  repos: {
    name: string;
    url: string;
    description: string | null;
    language: string | null;
    stars: number;
  }[];
  activityLevel: string;
  interests: string[];
  matchScore?: number;
}

export interface SwipeAction {
  userId: string;
  targetId: string;
  liked: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  read: boolean;
}

export interface Match {
  id: string;
  user: UserProfile;
  createdAt: Date;
  lastMessage?: Message;
}
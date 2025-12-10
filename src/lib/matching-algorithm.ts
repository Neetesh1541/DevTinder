import { UserProfile } from '@/types';

// Points allocation
const LANGUAGE_POINTS = 40;
const ACTIVITY_POINTS = 20;
const INTERESTS_POINTS = 20;
const LOCATION_POINTS = 20;

// Compare languages between users
const compareLanguages = (user1: UserProfile, user2: UserProfile): number => {
  const user1Languages = new Set(user1.languages.map((lang) => lang.name));
  const user2Languages = new Set(user2.languages.map((lang) => lang.name));
  
  // Find common languages
  const commonLanguages = Array.from(user1Languages).filter((lang) => 
    user2Languages.has(lang)
  );
  
  // Calculate points based on percentage of shared languages
  const sharedPercentage = commonLanguages.length / 
    Math.max(1, Math.min(user1Languages.size, user2Languages.size));
  
  return Math.min(LANGUAGE_POINTS, Math.round(sharedPercentage * LANGUAGE_POINTS));
};

// Compare activity levels
const compareActivityLevels = (user1: UserProfile, user2: UserProfile): number => {
  if (user1.activityLevel === user2.activityLevel) {
    return ACTIVITY_POINTS;
  }
  
  // If not exactly the same, give partial points based on closeness
  const levels = ['low', 'medium', 'high'];
  const user1Index = levels.indexOf(user1.activityLevel);
  const user2Index = levels.indexOf(user2.activityLevel);
  
  const difference = Math.abs(user1Index - user2Index);
  if (difference === 1) {
    return Math.round(ACTIVITY_POINTS * 0.5); // 50% for adjacent levels
  }
  
  return 0; // No points for completely different levels
};

// Compare interests
const compareInterests = (user1: UserProfile, user2: UserProfile): number => {
  const user1Interests = new Set(user1.interests);
  const user2Interests = new Set(user2.interests);
  
  // Find common interests
  const commonInterests = Array.from(user1Interests).filter((interest) => 
    user2Interests.has(interest)
  );
  
  // Calculate points based on shared interests
  const maxInterests = Math.max(1, Math.min(user1Interests.size, user2Interests.size));
  const sharedPercentage = commonInterests.length / maxInterests;
  
  return Math.min(INTERESTS_POINTS, Math.round(sharedPercentage * INTERESTS_POINTS));
};

// Compare locations
const compareLocations = (user1: UserProfile, user2: UserProfile): number => {
  if (!user1.location || !user2.location) {
    return 0;
  }
  
  // Check for exact matches including "Remote"
  if (user1.location === user2.location) {
    return LOCATION_POINTS;
  }
  
  // Check if both are remote
  if (
    user1.location.toLowerCase().includes('remote') && 
    user2.location.toLowerCase().includes('remote')
  ) {
    return LOCATION_POINTS;
  }
  
  // Check for same country
  const user1Country = getCountry(user1.location);
  const user2Country = getCountry(user2.location);
  
  if (user1Country && user2Country && user1Country === user2Country) {
    return Math.round(LOCATION_POINTS * 0.7); // 70% for same country
  }
  
  return 0;
};

// Helper function to extract country from location string
const getCountry = (location: string): string | null => {
  // Very simple extraction - assumes format "City, Country" or just "Country"
  const parts = location.split(',');
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return location.trim();
};

// Calculate overall match score (0-100)
export const calculateMatchScore = (user1: UserProfile, user2: UserProfile): number => {
  const languageScore = compareLanguages(user1, user2);
  const activityScore = compareActivityLevels(user1, user2);
  const interestsScore = compareInterests(user1, user2);
  const locationScore = compareLocations(user1, user2);
  
  // Total score
  const totalScore = languageScore + activityScore + interestsScore + locationScore;
  
  return totalScore;
};

// Sort profiles by match score
export const sortProfilesByMatchScore = (
  currentUser: UserProfile, 
  potentialMatches: UserProfile[]
): UserProfile[] => {
  return potentialMatches
    .map((profile) => ({
      ...profile,
      matchScore: calculateMatchScore(currentUser, profile),
    }))
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};
import { Octokit } from '@octokit/rest';
import { GithubUser, GithubRepo, GithubLanguage, UserProfile } from '@/types';

// Language colors for various programming languages
export const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  'Jupyter Notebook': '#DA5B0B',
  Vue: '#41b883',
  React: '#61dafb',
  Angular: '#dd0031',
  // Add more languages as needed
};

// Get default color for languages not in our list
export const getLanguageColor = (language: string): string => {
  return languageColors[language] || '#8e44ad'; // Default purple color
};

// Initialize Octokit with auth token
export const getOctokit = (token: string) => {
  return new Octokit({ auth: token });
};

// Fetch user profile from GitHub
export const fetchGithubUser = async (
  octokit: Octokit,
  username: string
): Promise<GithubUser> => {
  const { data } = await octokit.users.getByUsername({
    username,
  });
  
  return {
    id: data.id,
    login: data.login,
    avatar_url: data.avatar_url,
    html_url: data.html_url,
    name: data.name,
    bio: data.bio,
    location: data.location,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
};

// Fetch user repositories from GitHub
export const fetchUserRepos = async (
  octokit: Octokit,
  username: string
): Promise<GithubRepo[]> => {
  const { data } = await octokit.repos.listForUser({
    username,
    sort: 'updated',
    direction: 'desc',
    per_page: 10,
  });
  
  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    topics: repo.topics || [],
  }));
};

// Fetch languages for a repository
export const fetchRepoLanguages = async (
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<GithubLanguage[]> => {
  const { data } = await octokit.repos.listLanguages({
    owner,
    repo,
  });
  
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(data).map(([name, count]) => ({
    name,
    percentage: Math.round((count / total) * 100),
  }));
};

// Determine activity level based on commit count
export const determineActivityLevel = (commitCount: number): string => {
  if (commitCount > 500) return 'high';
  if (commitCount > 100) return 'medium';
  return 'low';
};

// Extract main languages from repos
export const extractLanguagesFromRepos = (repos: GithubRepo[]): GithubLanguage[] => {
  const languageCount: Record<string, number> = {};
  
  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });
  
  const total = Object.values(languageCount).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(languageCount)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);
};

// Extract interests from repo topics
export const extractInterests = (repos: GithubRepo[]): string[] => {
  const topics = new Set<string>();
  
  repos.forEach((repo) => {
    repo.topics.forEach((topic) => {
      topics.add(topic);
    });
  });
  
  return Array.from(topics).slice(0, 5); // Return top 5 interests
};

// Transform GitHub data into our UserProfile format
export const transformGithubDataToProfile = (
  user: GithubUser,
  repos: GithubRepo[],
  languages: GithubLanguage[],
  activityLevel: string,
  interests: string[],
  tagline?: string
): UserProfile => {
  // Format languages with colors
  const userLanguages = languages.map((lang) => ({
    ...lang,
    color: getLanguageColor(lang.name),
  }));
  
  // Get top repos (most stars)
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 2)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
    }));
  
  return {
    id: user.id.toString(),
    username: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    tagline: tagline || null,
    location: user.location,
    languages: userLanguages,
    repos: topRepos,
    activityLevel,
    interests,
  };
};
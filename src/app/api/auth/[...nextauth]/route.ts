import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from '@/lib/generated/prisma/client';
import { Session } from 'next-auth';

// Extend the Session type to include user id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

const prisma = new PrismaClient();
import { getOctokit, fetchGithubUser, fetchUserRepos, extractLanguagesFromRepos, extractInterests, determineActivityLevel, transformGithubDataToProfile } from '@/lib/github-utils';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      authorization: {
        params: { scope: 'read:user user:email repo' },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!user.email || !account || account.provider !== 'github') {
        return true; // Continue without GitHub data
      }

      try {
        // Only update GitHub data if we have an access token
        if (account.access_token) {
          const octokit = getOctokit(account.access_token);
          
          // Get GitHub user data
          const githubUser = await fetchGithubUser(octokit, (profile as any)?.login || user.email);
          const repos = await fetchUserRepos(octokit, (profile as any)?.login as string);
          
          // Calculate statistics
          const languages = extractLanguagesFromRepos(repos);
          const interests = extractInterests(repos);
          const activityLevel = determineActivityLevel(
            githubUser.public_repos * 50 + githubUser.followers * 10
          );
          
          // Prepare GitHub data for our database
          const userData = {
            githubId: githubUser.id.toString(),
            username: githubUser.login,
            avatarUrl: githubUser.avatar_url,
            bio: githubUser.bio,
            languages: languages.map(lang => lang.name),
            repos: repos.slice(0, 5).map(repo => ({
              name: repo.name,
              url: repo.html_url,
              description: repo.description,
              language: repo.language,
              stars: repo.stargazers_count,
            })),
            activityLevel,
            interests,
            location: githubUser.location || null,
          };
          
          // First, ensure the user exists
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id }
          });

          if (!existingUser) {
            // Create the user if they don't exist
            await prisma.user.create({
              data: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                ...userData
              }
            });
          } else {
            // Update existing user
            await prisma.user.update({
              where: { id: user.id },
              data: userData,
            });
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error updating GitHub profile data:', error);
        return true; // Continue sign in even if GitHub data fetch fails
      }
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    newUser: '/profile/setup',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
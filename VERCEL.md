# Vercel Deployment Guide for CodeMate

This guide will help you deploy CodeMate to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. A PostgreSQL database (recommended: Vercel Postgres, Supabase, or Neon)

## Step 1: Prepare Your Repository

1. Push your code to GitHub
2. Make sure all changes are committed

## Step 2: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database" → Select "Postgres"
3. Copy the `DATABASE_URL` connection string

### Option B: External Database (Supabase/Neon)

1. Create a PostgreSQL database on Supabase or Neon
2. Copy the connection string

## Step 3: Run Database Migrations

Before deploying, run migrations on your production database:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

Or use Vercel's CLI:

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

## Step 4: Deploy to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `DevsMatch-main` (if your project is in a subdirectory)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Environment Variables

Add these environment variables in Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app.vercel.app
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Step 5: Set Up GitHub OAuth App

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: CodeMate
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
4. Copy the Client ID and Client Secret to Vercel environment variables

## Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be live at `https://your-app.vercel.app`

## Step 7: Post-Deployment

After deployment, ensure:

1. Database migrations are applied (run `npx prisma migrate deploy` if needed)
2. Environment variables are set correctly
3. GitHub OAuth callback URL matches your Vercel domain

## Troubleshooting

### Build Fails

- Check that `prisma generate` runs successfully
- Ensure all environment variables are set
- Check build logs in Vercel dashboard

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs
- Check if SSL is required (add `?sslmode=require` to connection string)

### NextAuth Issues

- Verify `NEXTAUTH_URL` matches your Vercel domain
- Ensure `NEXTAUTH_SECRET` is set
- Check GitHub OAuth callback URL matches

## Continuous Deployment

Vercel automatically deploys on every push to your main branch. For other branches, Vercel creates preview deployments.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)


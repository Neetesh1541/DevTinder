# Quick Deployment Guide

## Prerequisites Checklist

- [ ] GitHub repository pushed (already done: https://github.com/Neetesh1541/DevTinder.git)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] PostgreSQL database (Vercel Postgres, Supabase, or Neon)
- [ ] GitHub OAuth App created

## Step 1: Set Up Database

### Option A: Vercel Postgres (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Create a new project or go to your project
3. Navigate to **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Copy the `DATABASE_URL` connection string

### Option B: External Database
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech

## Step 2: Create GitHub OAuth App

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: CodeMate (or your preferred name)
   - **Homepage URL**: `https://your-app.vercel.app` (you'll update this after deployment)
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

## Step 3: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your repository: `Neetesh1541/DevTinder`
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `DevsMatch-main` ⚠️ **IMPORTANT**
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
5. Click **Environment Variables** and add:
   ```
   DATABASE_URL=your-postgresql-connection-string
   NEXTAUTH_SECRET=l3wzOJ3aKA+Q+upq92gDc6ZoRf8MOBWmGXgkagkpha8=
   NEXTAUTH_URL=https://your-app.vercel.app
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   NODE_ENV=production
   ```
   ⚠️ Replace `your-app.vercel.app` with your actual Vercel domain after first deployment
6. Click **Deploy**

### Method 2: Via Vercel CLI

```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy (from DevsMatch-main directory)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No (first time) or Yes (if updating)
# - Project name: codemate (or your preferred name)
# - Directory: ./DevsMatch-main
# - Override settings? No

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

## Step 4: Run Database Migrations

After deployment, run migrations on your production database:

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

Or use Vercel's environment:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

## Step 5: Update GitHub OAuth App

After deployment, update your GitHub OAuth App:
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Edit your app
3. Update:
   - **Homepage URL**: `https://your-actual-app.vercel.app`
   - **Authorization callback URL**: `https://your-actual-app.vercel.app/api/auth/callback/github`
4. Update `NEXTAUTH_URL` in Vercel environment variables to match

## Step 6: Verify Deployment

1. Visit your deployed app: `https://your-app.vercel.app`
2. Test GitHub OAuth login
3. Check Vercel dashboard for build logs if issues occur

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `prisma generate` runs successfully (it's in the build script)

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs
- For external databases, add `?sslmode=require` to connection string if needed

### NextAuth Issues
- Verify `NEXTAUTH_URL` matches your Vercel domain exactly
- Ensure `NEXTAUTH_SECRET` is set
- Check GitHub OAuth callback URL matches your domain

### Prisma Issues
- Ensure `postinstall` script runs: `prisma generate`
- Check that Prisma Client is generated correctly
- Verify database migrations are applied

## Generated NEXTAUTH_SECRET

Your generated secret: `l3wzOJ3aKA+Q+upq92gDc6ZoRf8MOBWmGXgkagkpha8=`

Save this securely and use it in your Vercel environment variables.


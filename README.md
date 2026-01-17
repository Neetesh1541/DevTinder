# CodeMate..

CodeMate is a developer matching platform that connects developers based on their GitHub profiles, tech stacks, and coding interests.

## Features

- 🔐 GitHub OAuth authentication
- 👥 Match with developers based on tech stack compatibility
- 💬 Real-time messaging with matched developers
- 📊 GitHub profile analysis and activity tracking
- 🎯 Smart matching algorithm

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- GitHub OAuth App credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd DevsMatch-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/codemate?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth App
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Node Environment
NODE_ENV="development"
```

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000` for dev)
- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret

## Deploy on Vercel

This project is configured for easy deployment on Vercel. See [VERCEL.md](./VERCEL.md) for detailed deployment instructions.

Quick steps:
1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## License

MIT

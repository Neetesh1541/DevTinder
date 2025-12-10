import { PrismaClient } from '@/lib/generated/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
        bio: 'Full-stack developer passionate about React and Node.js',
        tagline: 'Building the future, one line of code at a time',
        languages: ['JavaScript', 'TypeScript', 'Python'],
        repos: [
          {
            name: 'awesome-project',
            description: 'An awesome project',
            stars: 100,
            language: 'TypeScript',
          },
        ],
        activityLevel: 'high',
        interests: ['Web Development', 'Open Source', 'AI'],
        location: 'San Francisco, CA',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        username: 'janesmith',
        avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
        bio: 'Backend developer specializing in Python and Go',
        tagline: 'Making the backend magic happen',
        languages: ['Python', 'Go', 'Rust'],
        repos: [
          {
            name: 'backend-service',
            description: 'A high-performance backend service',
            stars: 50,
            language: 'Go',
          },
        ],
        activityLevel: 'medium',
        interests: ['Backend Development', 'DevOps', 'Cloud Computing'],
        location: 'New York, NY',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        username: 'alexjohnson',
        avatarUrl: 'https://avatars.githubusercontent.com/u/3?v=4',
        bio: 'Frontend developer with a passion for design systems',
        tagline: 'Creating beautiful user experiences',
        languages: ['JavaScript', 'TypeScript', 'CSS'],
        repos: [
          {
            name: 'design-system',
            description: 'A comprehensive design system',
            stars: 200,
            language: 'TypeScript',
          },
        ],
        activityLevel: 'high',
        interests: ['UI/UX', 'Design Systems', 'Accessibility'],
        location: 'London, UK',
      },
    }),
  ]);

  // Create some swipes
  await Promise.all([
    prisma.swipe.create({
      data: {
        userId: users[0].id,
        targetId: users[1].id,
        liked: true,
      },
    }),
    prisma.swipe.create({
      data: {
        userId: users[1].id,
        targetId: users[0].id,
        liked: true,
      },
    }),
  ]);

  // Create a match
  await prisma.match.create({
    data: {
      user1Id: users[0].id,
      user2Id: users[1].id,
    },
  });

  // Create some messages
  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Hey! Nice to meet you!',
        senderId: users[0].id,
        receiverId: users[1].id,
        matchId: (await prisma.match.findFirst())?.id || '',
      },
    }),
    prisma.message.create({
      data: {
        content: 'Hi there! Great to connect with you too!',
        senderId: users[1].id,
        receiverId: users[0].id,
        matchId: (await prisma.match.findFirst())?.id || '',
      },
    }),
  ]);

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
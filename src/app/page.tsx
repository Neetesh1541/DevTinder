"use client";

import { useRouter } from 'next/navigation';
import { Github as GitHub, Code, Globe, Users } from 'lucide-react';
import { signIn } from "next-auth/react"

export default function Home() {
  const router = useRouter();
  
  const handleSignIn = async () => {
    try {
      await signIn('github', {
        callbackUrl: '/dashboard'
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-24 text-center">
        <div className="container max-w-3xl">
          <div className="inline-flex items-center justify-center rounded-full bg-muted p-3 mb-8">
            <GitHub className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Find Your Perfect <span className="text-primary">Coding</span> Partner
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Connect with developers who share your tech stack, interests, and coding style. 
            Swipe, match, and collaborate on amazing projects together.
          </p>
          
          <button
            onClick={handleSignIn}
            className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-lg font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <GitHub className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <GitHub className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with GitHub</h3>
              <p className="text-muted-foreground">
                Sign in with your GitHub account and we'll analyze your repositories,
                languages, and coding patterns.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Match on Tech Stack</h3>
              <p className="text-muted-foreground">
                Our algorithm finds developers with complementary skills, 
                interests, and project goals.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaborate Globally</h3>
              <p className="text-muted-foreground">
                Connect with developers worldwide or filter by location to
                find the perfect coding partner.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials/Stats Section */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Join the Community</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <p className="text-muted-foreground">Developers worldwide</p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Programming languages</p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">1,000+</div>
              <p className="text-muted-foreground">Successful projects</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-primary py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to Find Your Coding Match?
          </h2>
          
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have found their perfect coding partners
            through our platform.
          </p>
          
          <button
            onClick={handleSignIn}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-background px-6 text-lg font-medium text-foreground ring-offset-background transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <GitHub className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </button>
        </div>
      </section>
      
      {/* Founder Section */}
      <section className="bg-muted py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">⭐ Founder</h2>
          
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Neetesh Kumar</h3>
              <p className="text-lg text-muted-foreground">Founder & Chief Product Architect</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">📞 Contact</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Email: <a href="mailto:neeteshk1104@gmail.com" className="text-primary hover:underline">neeteshk1104@gmail.com</a></p>
                  <p>• Phone: <a href="tel:8218828273" className="text-primary hover:underline">8218828273</a></p>
                  <p>• GitHub: <a href="https://github.com/neetesh1541" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">/neetesh1541</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t bg-background py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <GitHub className="h-5 w-5 text-primary" />
            <span className="font-semibold">CodeMate</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
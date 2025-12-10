"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Github as GitHub,
  Menu,
  X,
  Home,
  Search,
  Heart,
  MessageSquare,
  User as UserIcon,
  LogOut,
} from "lucide-react";

export function Header() {
  const { data } = useSession();
  const user = data?.user as User | null;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Explore", href: "/dashboard", icon: Search },
    { name: "Matches", href: "/matches", icon: Heart },
    { name: "Messages", href: "/chat", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 py-2 md:px-8 md:py-4">
      <Link href="/" className="flex items-center gap-2 font-bold">
        <span className="hidden md:inline-block">CodeMate</span>
      </Link>

      {user && (
        <>
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-accent"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </>
      )}

      {!user && (
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Mobile navigation */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t">
          <div className="container py-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User, LogOut, TrendingUp, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { 
    data: session, 
    isPending: sessionLoading,
    error: sessionError,
    refetch: refetchSession
  } = authClient.useSession();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/login");
            refetchSession();
          },
          onError: (error) => {
            console.error("Logout failed:", error);
          }
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!session?.user;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    
    const names = session.user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-[var(--brand-primary)] text-white border-b-4 border-[var(--brand-accent)] sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[var(--brand-accent)] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[var(--primary-foreground)]" />
          </div>
          <span className="text-xl font-bold text-white group-hover:text-[var(--brand-accent)] transition-colors">
            NewsHub
          </span>
        </Link>

        {/* Main Nav */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { name: "Home", path: "/" },
            { name: "Trending", path: "/trending" },
            { name: "World", path: "/world" },
            { name: "Politics", path: "/politics" },
            { name: "Technology", path: "/technology" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-white/90 hover:text-[var(--brand-accent)] font-medium transition-colors relative group py-2"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand-accent)] group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Auth + Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/search">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-[var(--brand-accent)] hover:bg-white/10 rounded-full"
            >
              <Search className="w-4 h-4" />
            </Button>
          </Link>

          {sessionLoading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-1">
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/profile")}
                className="text-white/70 hover:text-[var(--brand-accent)] hover:bg-white/10 rounded-full"
                title="Profile"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* User Avatar */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/profile")}
                className="rounded-full p-0 hover:bg-white/10 transition-all group"
                title="Profile"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--brand-accent)] to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-105 transition-transform">
                  {getUserInitials()}
                </div>
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoading}
                className="text-white/70 hover:text-red-400 hover:bg-white/10 rounded-full"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-white/60 text-primary hover:text-[var(--brand-primary)] hover:bg-[var(--brand-accent)] hover:border-[var(--brand-accent)] rounded-full px-4"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-[var(--brand-accent)] text-[var(--primary-foreground)] hover:brightness-110 rounded-full px-4 font-semibold">
                  Subscribe
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          className="md:hidden text-white hover:text-[var(--brand-accent)] transition-colors p-2 rounded-lg hover:bg-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-white/20 bg-[var(--brand-primary)] backdrop-blur-lg">
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Trending", path: "/trending" },
                { name: "World", path: "/world" },
                { name: "Politics", path: "/politics" },
                { name: "Technology", path: "/technology" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-3 text-white/90 hover:text-[var(--brand-accent)] py-3 px-4 rounded-lg hover:bg-white/10 transition-all group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Search in mobile */}
            <Link 
              href="/search" 
              className="flex items-center gap-3 text-white/90 hover:text-[var(--brand-accent)] py-3 px-4 rounded-lg hover:bg-white/10 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* User Info in Mobile - Modern */}
                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center gap-3 px-4 py-2 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-accent)] to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      {getUserInitials()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {session?.user?.name || "User"}
                      </span>
                      <span className="text-xs text-white/60">
                        {session?.user?.email || ""}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 px-4">
                    <Button
                      onClick={() => {
                        router.push("/profile");
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 rounded-full"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      onClick={handleLogout}
                      disabled={isLoading}
                      variant="outline"
                      className="border-red-400/30 text-red-400 hover:bg-red-400/10 rounded-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoading ? "..." : "Logout"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="border-t border-white/20 pt-4 space-y-3">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-white/60 text-primary hover:text-[var(--brand-primary)] hover:bg-[var(--brand-accent)] hover:border-[var(--brand-accent)] rounded-full"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[var(--brand-accent)] text-[var(--primary-foreground)] hover:brightness-110 rounded-full font-semibold">
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
}
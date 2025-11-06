"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User, LogOut, TrendingUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Simple dropdown component for authenticated users
  const UserAccountDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors px-3 border border-white/20"
        >
          <User className="w-4 h-4" />
          <span className="text-sm">Account</span>
          <ChevronDown className="w-3 h-3 text-white/70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="w-4 h-4 mr-2" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          disabled={isLoading}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>{isLoading ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
        <div className="hidden md:flex items-center gap-3">
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
            <UserAccountDropdown />
          ) : (
            <>
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
            </>
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
                <div className="border-t border-white/20 pt-4 space-y-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-white/90 hover:text-[var(--brand-accent)] py-3 px-4 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center gap-3 text-white/90 hover:text-red-400 py-3 px-4 rounded-lg hover:bg-white/10 transition-all w-full text-left disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoading ? "Logging out..." : "Log out"}</span>
                  </button>
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
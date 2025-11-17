"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User, LogOut, TrendingUp, Settings, ChevronDown, MapPin, Globe, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMediaDropdown, setShowMediaDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [newsScope, setNewsScope] = useState<"local" | "global">("local");
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

  // Media outlets data - only names
  const mediaOutlets = {
    local: [
      { id: "fanabc", name: "Fana BC", category: "Broadcast" },
      { id: "addis-standard", name: "Addis Standard", category: "News" },
      { id: "reporter-ethiopia", name: "The Reporter Ethiopia", category: "News" },
      { id: "ethiopian-monitor", name: "Ethiopian Monitor", category: "News" },
      { id: "ena", name: "ENA (Ethiopian News Agency)", category: "Official" }
    ],
    global: [
      { id: "bbc", name: "BBC News", category: "International" },
      { id: "cnn", name: "CNN", category: "International" },
      { id: "aljazeera", name: "Al Jazeera", category: "International" },
      { id: "reuters", name: "Reuters", category: "Wire Service" },
      { id: "ap", name: "Associated Press", category: "Wire Service" },
      { id: "dw", name: "Deutsche Welle", category: "International" }
    ]
  } as const;

  const currentMediaOutlets = mediaOutlets[newsScope];

  const handleMediaSelect = (mediaId: string) => {
    setShowMediaDropdown(false);
    router.push(`/news?scope=${newsScope}&source=${mediaId}`);
  };

  const toggleNewsScope = () => {
    const newScope = newsScope === "local" ? "global" : "local";
    setNewsScope(newScope);
    setShowMediaDropdown(false);
    const newSources = mediaOutlets[newScope];
    const defaultSource = newSources[0]?.id;
    router.push(`/news?scope=${newScope}&source=${defaultSource}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlScope = params.get('scope');
    if (urlScope === 'local' || urlScope === 'global') {
      setNewsScope(urlScope);
    }
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-[var(--brand-primary)] text-white border-b-4 border-[var(--brand-accent)] sticky top-0 z-50 shadow-2xl shadow-[var(--brand-accent)]/20"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-10 h-10 bg-gradient-to-br from-[var(--brand-accent)] to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--brand-accent)]/30"
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white group-hover:text-[var(--brand-accent)] transition-colors tracking-tight">
              NewsHub
            </span>
            <span className="text-xs text-white/60 font-medium">Ethiopia & Beyond</span>
          </div>
        </Link>

        {/* Main Nav with Filters */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { name: "Home", path: "/" },
            { name: "Trending", path: "/trending" },
            { name: "Politics", path: "/politics" },
            { name: "Tech", path: "/technology" },
            { name: "Sports", path: "/sports" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-white/90 hover:text-[var(--brand-accent)] font-semibold transition-colors relative group py-2"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--brand-accent)] to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}

          {/* Scope Toggle */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-white/20 shadow-inner"
          >
            <motion.button
              onClick={() => setNewsScope("local")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                newsScope === "local" 
                  ? "bg-gradient-to-r from-[var(--brand-accent)] to-emerald-500 text-white shadow-lg shadow-[var(--brand-accent)]/30" 
                  : "text-white/60 hover:text-white/80"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <MapPin className="w-4 h-4" />
              Local
            </motion.button>
            <motion.button
              onClick={() => setNewsScope("global")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                newsScope === "global" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30" 
                  : "text-white/60 hover:text-white/80"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Globe className="w-4 h-4" />
              Global
            </motion.button>
          </motion.div>

          {/* Media Filter Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMediaDropdown(!showMediaDropdown)}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-2 text-white/90 hover:text-white font-semibold transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[var(--brand-accent)]/20"
            >
              <Radio className="w-4 h-4" />
              <span>Sources</span>
              <motion.div
                animate={{ rotate: showMediaDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showMediaDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-gray-800 text-sm uppercase tracking-wider">
                        {newsScope === "local" ? "Ethiopian Media" : "Global Media"}
                      </h3>
                      <span className="text-xs font-semibold bg-gradient-to-r from-[var(--brand-accent)] to-cyan-500 text-white px-2 py-1 rounded-full">
                        {currentMediaOutlets.length} sources
                      </span>
                    </div>
                  </div>
                  
                  <div className="py-1 max-h-96 overflow-y-auto">
                    {currentMediaOutlets.map((media) => (
                      <motion.button
                        key={media.id}
                        onClick={() => handleMediaSelect(media.id)}
                        whileHover={{ scale: 1.02 }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between transition-all group"
                      >
                        <div className="flex flex-col">
                          <div className="font-semibold text-gray-800 group-hover:text-[var(--brand-accent)]">
                            {media.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{media.category}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Auth + Actions */}
        <div className="hidden md:flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/search">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:text-[var(--brand-accent)] hover:bg-white/10 rounded-2xl backdrop-blur-lg border border-white/10"
              >
                <Search className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {sessionLoading ? (
            <div className="w-10 h-10 rounded-2xl bg-white/10 animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* User Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl pl-3 pr-2 py-1.5 hover:bg-white/15 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--brand-accent)] to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {getUserInitials()}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm leading-tight max-w-[120px] truncate">
                        {session?.user?.name?.split(' ')[0]}
                      </div>
                      <div className="text-white/60 text-xs leading-tight">
                        {session?.user?.email?.split('@')[0]}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: showUserDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-white/10">
                        <div className="font-semibold text-gray-800 text-sm truncate">
                          {session?.user?.name}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                          {session?.user?.email}
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <motion.button
                          onClick={() => {
                            router.push("/profile");
                            setShowUserDropdown(false);
                          }}
                          whileHover={{ scale: 1.02 }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </motion.button>
                        
                        <motion.button
                          onClick={() => {
                            router.push("/profile");
                            setShowUserDropdown(false);
                          }}
                          whileHover={{ scale: 1.02 }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </motion.button>
                      </div>
                      
                      <div className="border-t border-white/10 p-1">
                        <motion.button
                          onClick={handleLogout}
                          disabled={isLoading}
                          whileHover={{ scale: 1.02 }}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all disabled:opacity-50"
                        >
                          <LogOut className="w-4 h-4" />
                          {isLoading ? "Signing out..." : "Sign Out"}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-2xl font-semibold"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-[var(--brand-accent)] to-cyan-500 text-white hover:brightness-110 rounded-2xl font-black shadow-lg shadow-[var(--brand-accent)]/30">
                    Subscribe
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden text-white hover:text-[var(--brand-accent)] transition-colors p-2 rounded-2xl hover:bg-white/10 backdrop-blur-lg border border-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 bg-[var(--brand-primary)] backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-6">
              {/* Navigation Links */}
              <div className="space-y-2">
                {[
                  { name: "Home", path: "/" },
                  { name: "Trending", path: "/trending" },
                  { name: "Politics", path: "/politics" },
                  { name: "Tech", path: "/technology" },
                  { name: "Sports", path: "/sports" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="flex items-center gap-3 text-white/90 hover:text-[var(--brand-accent)] py-3 px-4 rounded-2xl hover:bg-white/10 transition-all group font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Scope Toggle in Mobile */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-black mb-3 text-sm uppercase tracking-wider">News Scope</h3>
                <div className="flex bg-white/10 rounded-xl p-1">
                  <button
                    onClick={() => {
                      setNewsScope("local");
                      setIsOpen(false);
                      router.push(`/news?scope=local`);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                      newsScope === "local" 
                        ? "bg-gradient-to-r from-[var(--brand-accent)] to-emerald-500 text-white shadow-lg" 
                        : "text-white/60"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Local
                  </button>
                  <button
                    onClick={() => {
                      setNewsScope("global");
                      setIsOpen(false);
                      router.push(`/news?scope=global`);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                      newsScope === "global" 
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg" 
                        : "text-white/60"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Global
                  </button>
                </div>
              </div>

              {/* Media Sources in Mobile */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-black mb-3 text-sm uppercase tracking-wider">
                  {newsScope === "local" ? "Local Sources" : "Global Sources"}
                </h3>
                <div className="space-y-2">
                  {currentMediaOutlets.map((media) => (
                    <motion.button
                      key={media.id}
                      onClick={() => {
                        handleMediaSelect(media.id);
                        setIsOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 rounded-xl transition-all group flex justify-between items-center"
                    >
                      <div className="flex flex-col">
                        <div className="font-semibold text-white group-hover:text-[var(--brand-accent)]">
                          {media.name}
                        </div>
                        <div className="text-xs text-white/60 mt-0.5">{media.category}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Search in mobile */}
              <Link 
                href="/search" 
                className="flex items-center gap-3 text-white/90 hover:text-[var(--brand-accent)] py-3 px-4 rounded-2xl hover:bg-white/10 transition-all font-semibold"
                onClick={() => setIsOpen(false)}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>

              {isAuthenticated ? (
                <>
                  {/* User Info in Mobile */}
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex items-center gap-3 px-4 py-2 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-accent)] to-purple-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{session?.user?.name}</div>
                        <div className="text-white/60 text-sm">{session?.user?.email}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 px-4">
                      <Button
                        onClick={() => {
                          router.push("/profile");
                          setIsOpen(false);
                        }}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 rounded-2xl font-semibold"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                      <Button
                        onClick={handleLogout}
                        disabled={isLoading}
                        variant="outline"
                        className="border-red-400/30 text-red-400 hover:bg-red-400/10 rounded-2xl font-semibold"
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
                      className="w-full border-white/30 text-primary hover:bg-white/10 rounded-2xl font-semibold"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-[var(--brand-accent)] to-cyan-500 text-white hover:brightness-110 rounded-2xl font-black">
                      Subscribe Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
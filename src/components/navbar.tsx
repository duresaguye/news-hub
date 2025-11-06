'use client';

import Link from "next/link";
import { Menu, X, Search, User, Bell, Bookmark, TrendingUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"


export default function Navbar({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-[var(--brand-primary)] text-white border-b-4 border-[var(--brand-accent)] sticky top-0 z-50 shadow-sm">
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

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { name: 'Home', path: '/' },
            { name: 'Trending', path: '/trending' },
            { name: 'World', path: '/world' },
            { name: 'Politics', path: '/politics' },
            { name: 'Technology', path: '/technology' }
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

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="text-white/90 hover:text-[var(--brand-accent)] hover:bg-white/10 rounded-full">
              <Search className="w-4 h-4" />
            </Button>
          </Link>
          {isAuthenticated && (
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-white/90 hover:text-[var(--brand-accent)] hover:bg-white/10 rounded-full">
                <User className="w-4 h-4" />
              </Button>
            </Link>
          )}
          
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          
          {!isAuthenticated && (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="border-white/60 text-primary hover:text-[var(--brand-primary)] hover:bg-[var(--brand-accent)] hover:border-[var(--brand-accent)] rounded-full px-4">
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white hover:text-[var(--brand-accent)] transition-colors p-2 rounded-lg hover:bg-white/10" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Enhanced Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/20 bg-[var(--brand-primary)] backdrop-blur-lg">
          <div className="px-4 py-6 space-y-4">
            {/* Main Navigation */}
            <div className="space-y-2">
              {[
                { name: 'Home', path: '/', icon: null },
                { name: 'Trending', path: '/trending', icon: TrendingUp },
                { name: 'World', path: '/world', icon: null },
                { name: 'Politics', path: '/politics', icon: null },
                { name: 'Technology', path: '/technology', icon: null }
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.path} 
                  className="flex items-center gap-3 text-white/90 hover:text-[var(--brand-accent)] py-3 px-4 rounded-lg hover:bg-white/10 transition-all group"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            {isAuthenticated && (
            <div className="border-t border-white/20 pt-4 space-y-2">
              {[
                { name: 'Search', path: '/search', icon: Search },
                { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
                { name: 'Notifications', path: '/notifications', icon: Bell },
                { name: 'Profile', path: '/profile', icon: User }
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.path} 
                  className="flex items-center gap-3 text-white/90 hover:text-[var(--brand-accent)] py-3 px-4 rounded-lg hover:bg-white/10 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            )}

            {/* Auth Buttons */}
            {!isAuthenticated && (
              <div className="border-t border-white/20 pt-4 space-y-3">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-white/60 text-white hover:text-[var(--brand-primary)] hover:bg-[var(--brand-accent)] hover:border-[var(--brand-accent)] rounded-full">
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

            {/* Current User Info (if logged in) */}
            <div className="border-t border-white/20 pt-4 text-center">
              <p className="text-white/60 text-sm">
                Trusted News • Global Sources
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
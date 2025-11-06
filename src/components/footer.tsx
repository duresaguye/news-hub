import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Mail, 
  Phone, 
  MapPin,
  Send,
  Shield,

} from "lucide-react"
import SocialCards from "./social-cards"

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-[var(--brand-accent)] bg-[var(--brand-primary)] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand & Newsletter Section */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-2xl text-white mb-2 tracking-tight">NewsHub</h3>
              <p className="text-white/80 max-w-md text-sm leading-relaxed">
                Your trusted source for Ethiopian news and global perspectives. Stay informed with real-time updates from verified sources worldwide.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[var(--brand-accent)]">Stay Updated</h4>
              <p className="text-white/70 text-sm">
                Get the latest news delivered to your inbox
              </p>
              <div className="flex gap-2 max-w-md">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[var(--brand-accent)]"
                />
                <Button className="bg-[var(--brand-accent)] text-[var(--primary-foreground)] hover:brightness-110 whitespace-nowrap">
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Links Grid with Social Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Links Column */}
            <div className="grid grid-cols-2 gap-8">
              {/* Categories */}
              <div>
                <h4 className="font-semibold text-[var(--brand-accent)] mb-4">Categories</h4>
                <ul className="space-y-2 text-sm">
                  {[
                    "Politics",
                    "Technology", 
                    "Business",
                    "Health",
                    "Sports",
                    "Entertainment"
                  ].map((category) => (
                    <li key={category}>
                      <Link 
                        href={`/category/${category.toLowerCase()}`}
                        className="text-white/90 hover:text-[var(--brand-accent)] transition-colors block py-1"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-[var(--brand-accent)] mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  {[
                    "About Us",
                    "Our Team",
                    "Careers", 
                    "Contact",
                    "Privacy",
                    "Terms"
                  ].map((item) => (
                    <li key={item}>
                      <Link 
                        href={`/${item.toLowerCase().replace(' ', '-')}`}
                        className="text-white/90 hover:text-[var(--brand-accent)] transition-colors block py-1"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social Cards Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--brand-accent)] text-center md:text-left">Follow Us</h4>
              <div className="flex justify-center md:justify-start">
                <SocialCards />
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center gap-3 text-white/80 text-sm justify-center md:justify-start">
                  <Phone className="w-4 h-4 text-[var(--brand-accent)]" />
                  <span>+251 11 123 4567</span>
                </div>
                <div className="flex items-center gap-3 text-white/80 text-sm justify-center md:justify-start">
                  <Mail className="w-4 h-4 text-[var(--brand-accent)]" />
                  <span>contact@newshub.et</span>
                </div>
                <div className="flex items-start gap-3 text-white/80 text-sm justify-center md:justify-start">
                  <MapPin className="w-4 h-4 text-[var(--brand-accent)] mt-0.5" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/15 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <div className="flex items-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--brand-accent)]" />
                <span>Trusted News Sources</span>
              </div>
              
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/80">
              <span className="font-semibold text-[var(--brand-accent)]">&copy; 2025 NewsHub</span>
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Shield, Globe } from "lucide-react"
import hero from "@/assets/hero.png"

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="relative min-h-[70vh] md:min-h-[80vh] w-full bg-center bg-cover bg-fixed"
        style={{
          backgroundImage:
            hero ? `url(${hero})` : undefined,
        }}
      >
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 backdrop-blur-[2px]" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-2 h-2 bg-white rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32 flex items-center justify-center h-full">
          <div className="text-center text-white">
            {/* Enhanced badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm ring-1 ring-white/20 px-4 py-2 rounded-full text-sm font-medium tracking-wide mb-6">
              <Shield className="w-4 h-4" />
              <span>Trusted Global Sources • Personalized for You</span>
            </div>

            {/* Main heading with better typography */}
            <h1 className="mt-4 text-5xl md:text-7xl font-bold leading-tight tracking-tight text-balance">
              Stay Informed with
              <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                NewsHub
              </span>
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-pretty leading-relaxed">
              Your comprehensive news platform aggregating trusted sources like BBC, CNN, Al Jazeera and more — all in one place.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-white/80">
              {[
                { icon: Globe, label: "50+ Countries", value: "Covered" },
                { icon: TrendingUp, label: "24/7", value: "Live Updates" },
                { icon: Shield, label: "Trusted", value: "Sources" }
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{stat.label}</div>
                    <div className="text-sm opacity-80">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced CTA buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/search">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold rounded-full shadow-lg hover:shadow-blue-500/25 transition-all">
                  <Search className="w-5 h-5 mr-2" />
                  Search Global News
                </Button>
              </Link>
              <Link to="/trending">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 px-8 py-6 text-base font-semibold rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Stories
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 opacity-80">
              <span className="text-sm">Trusted by readers worldwide</span>
              <div className="flex items-center gap-4">
                {["BBC", "CNN", "Al Jazeera", "Reuters"].map((source) => (
                  <div key={source} className="text-xs font-medium bg-white/5 px-3 py-1 rounded-full">
                    {source}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-background/80 to-background" />
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Eye, Bookmark, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

const sampleArticles = [
  {
    id: "1",
    title: "Ethiopia Announces Major Infrastructure Development Plan for 2025-2026",
    description: "The government has unveiled a comprehensive $15 billion infrastructure development plan focusing on transportation, energy, and digital infrastructure across all regions.",
    source: "Ethiopian News Agency",
    date: "2 hours ago",
    category: "Politics",
    readTime: "4 min read",
    views: 1247,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
    isBreaking: true
  },
  {
    id: "2",
    title: "Tech Startups in Addis Ababa Secure Record $50M in Funding",
    description: "Ethiopian tech startups have raised unprecedented funding this quarter, signaling growing investor confidence in the country's digital economy.",
    source: "Tech Tribune Africa",
    date: "5 hours ago",
    category: "Technology",
    readTime: "3 min read",
    views: 892,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    isBreaking: false
  },
  {
    id: "3",
    title: "Agricultural Innovations Boost Crop Yields by 40% in Pilot Regions",
    description: "New sustainable farming techniques and technology adoption are transforming agricultural productivity in Ethiopia's rural communities.",
    source: "Agriculture Today",
    date: "1 day ago",
    category: "Agriculture",
    readTime: "5 min read",
    views: 1563,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    isBreaking: false
  },
  {
    id: "4",
    title: "National Football Team Qualifies for Continental Championship Finals",
    description: "In a stunning comeback victory, Ethiopia's national team secures their spot in the African Cup of Nations finals after a decade-long absence.",
    source: "Sports Daily Ethiopia",
    date: "3 hours ago",
    category: "Sports",
    readTime: "2 min read",
    views: 2341,
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800&auto=format&fit=crop",
    isBreaking: true
  },
  {
    id: "5",
    title: "New Economic Policy Aims to Boost Foreign Investment",
    description: "The government introduces sweeping reforms to attract international businesses and stimulate economic growth across key sectors.",
    source: "Business Ethiopia",
    date: "6 hours ago",
    category: "Business",
    readTime: "4 min read",
    views: 987,
    image: "https://images.unsplash.com/photo-1665686374006-b8f04cf62d57?q=80&w=800&auto=format&fit=crop",
    isBreaking: false
  },
  {
    id: "6",
    title: "Healthcare Initiative Reaches 1 Million Rural Residents",
    description: "A nationwide healthcare program has successfully provided medical services to remote communities, improving access to quality care.",
    source: "Health Watch",
    date: "1 day ago",
    category: "Health",
    readTime: "3 min read",
    views: 756,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop",
    isBreaking: false
  }
]

type GridArticle = {
  id: string
  title: string
  description: string
  source: string
  date: string
  category: string
  readTime?: string
  views?: number
  image: string
  isBreaking?: boolean
  url?: string
}

interface ArticleGridProps {
  articles?: GridArticle[]
  title?: string
  badgeText?: string
}

export default function ArticleGrid({ articles, title, badgeText }: ArticleGridProps) {
  const [displayCount, setDisplayCount] = useState(6)
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set(["1"]))

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6)
  }

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newBookmarked = new Set(bookmarked)
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id)
    } else {
      newBookmarked.add(id)
    }
    setBookmarked(newBookmarked)
  }

  const list = (articles && articles.length > 0 ? articles : sampleArticles)
  const articlesToDisplay = list.slice(0, displayCount)

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
          {badgeText ?? 'Latest Updates'}
        </Badge>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{title ?? "Today's Top Stories"}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Curated news from trusted sources around the world
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articlesToDisplay.map((article) => (
          article.url ? (
            <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-0 shadow-sm group overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`${
                      article.isBreaking 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}>
                      {article.isBreaking ? 'Breaking' : article.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={(e) => toggleBookmark(article.id, e)}
                    >
                      <Bookmark 
                        className={`w-4 h-4 ${
                          bookmarked.has(article.id) ? 'fill-blue-600 text-blue-600' : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-balance text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-3 text-gray-600 leading-relaxed mb-4">
                    {article.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime ?? ' '}</span>
                      </div>
                      {typeof article.views === 'number' && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all">
                      <span className="text-sm font-medium">Read</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ) : (
            <Link key={article.id} to={`/article/${article.id}`}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-0 shadow-sm group overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`${
                      article.isBreaking 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}>
                      {article.isBreaking ? 'Breaking' : article.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={(e) => toggleBookmark(article.id, e)}
                    >
                      <Bookmark 
                        className={`w-4 h-4 ${
                          bookmarked.has(article.id) ? 'fill-blue-600 text-blue-600' : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-balance text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-3 text-gray-600 leading-relaxed mb-4">
                    {article.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all">
                      <span className="text-sm font-medium">Read</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        ))}
      </div>

      {displayCount < list.length && (
        <div className="text-center mt-16">
          <Button 
            onClick={handleLoadMore} 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-base border-gray-300 hover:border-blue-600 hover:text-blue-600"
          >
            Load More Articles
          </Button>
        </div>
      )}
    </section>
  )
}
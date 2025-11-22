"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Eye, Bookmark, Share2 } from "lucide-react"
import Link from "next/link"
import { useState, type MouseEvent } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useBookmarks } from "@/hooks/use-bookmarks"

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
  url?: string | null
}

interface ArticleGridProps {
  articles?: GridArticle[]
  title?: string
  badgeText?: string
}

export default function ArticleGrid({ articles, title, badgeText }: ArticleGridProps) {
  const [displayCount, setDisplayCount] = useState(6)
  const { toast } = useToast()
  const { isBookmarked, toggleBookmark, isMutating } = useBookmarks()
  // Add: Track expanded cards by id
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6)
  }

  const handleBookmarkClick = async (article: GridArticle, e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    await toggleBookmark({
      url: article.url ?? article.id,
      title: article.title,
      source: article.source,
      imageUrl: article.image,
      description: article.description,
      category: article.category,
    })
  }

  // Add this
  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const list = articles && articles.length > 0 ? articles : []
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

      {list.length === 0 ? (
        <div className="py-16 text-center text-white/70">
          No articles available yet. Please check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articlesToDisplay.map((article) => {
          const articleWithUrl = article as GridArticle
          const bookmarkKey = articleWithUrl.url ?? articleWithUrl.id
          const saved = isBookmarked(bookmarkKey)
          const bookmarking = isMutating(bookmarkKey)
          const isExpanded = expanded[article.id]
          return (
            <Link key={article.id} href={`/article/${encodeURIComponent(article.id)}`}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-0 shadow-sm group overflow-hidden">
                <div className="relative overflow-hidden">
                  {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white/70 text-sm">
                      No image
                    </div>
                  )}
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
                    onClick={(e) => handleBookmarkClick(articleWithUrl, e)}
                    disabled={bookmarking}
                    >
                      <Bookmark 
                        className={`w-4 h-4 ${
                          saved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'
                        }`} 
                      />
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
                  {/* Only show first 100 chars if not expanded, otherwise full description */}
                  <CardDescription className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {isExpanded ? article.description : `${article.description?.slice(0, 100)}${article.description && article.description.length > 100 ? '...' : ''}`}
                  </CardDescription>
                  <div className="flex items-center gap-2 mb-4">
                    {article.description && article.description.length > 100 && (
                      <Button type="button" size="sm" variant="outline" onClick={(e) => {
                        e.preventDefault(); // don't navigate link
                        e.stopPropagation();
                        toggleExpanded(article.id)
                      }}>
                        {isExpanded ? 'Show Less' : 'More'}
                      </Button>
                    )}
                  </div>
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
            </Link>
          )
        })}
      </div>
      )}
      {list.length > 0 && displayCount < list.length && (
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
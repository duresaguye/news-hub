import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bookmark, Share2, Clock, Eye } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchResultsProps {
  query: string
  category: string
  sortBy: string
}

interface Article {
  id: number
  title: string
  description: string
  source: string
  date: string
  category: string
  image: string
  readTime?: string
  views?: number
  isBookmarked?: boolean
}

export default function SearchResults({ query, category, sortBy }: SearchResultsProps) {
  const [openId, setOpenId] = useState<number | null>(null)
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set([1]))
  
  // Enhanced sample results
  const results: Article[] = [
    {
      id: 1,
      title: "Breaking: Major Policy Change Announced in Federal Government",
      description: "The government has announced a comprehensive policy change that will affect millions of citizens across key sectors including healthcare and education.",
      source: "Ethiopian News Agency",
      date: "2 hours ago",
      category: "Politics",
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
      readTime: "3 min read",
      views: 1247,
      isBookmarked: true
    },
    {
      id: 2,
      title: "Tech Innovation Reshapes Ethiopian Agricultural Sector",
      description: "A groundbreaking technology developed by local engineers is set to transform the agricultural industry with AI-powered solutions.",
      source: "Addis Tech Review",
      date: "5 hours ago",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      readTime: "4 min read",
      views: 892,
      isBookmarked: false
    },
    {
      id: 3,
      title: "Economic Growth Reaches 7.2% in Latest Quarter Report",
      description: "Latest economic data shows unprecedented growth in key sectors including manufacturing and services, exceeding government projections.",
      source: "Business Ethiopia",
      date: "1 day ago",
      category: "Business",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
      readTime: "5 min read",
      views: 1563,
      isBookmarked: false
    },
  ]

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newBookmarked = new Set(bookmarked)
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id)
    } else {
      newBookmarked.add(id)
    }
    setBookmarked(newBookmarked)
  }

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (sortBy === "popular") {
      return (b.views || 0) - (a.views || 0)
    }
    if (sortBy === "relevant") {
      return a.title.toLowerCase().includes(query.toLowerCase()) ? -1 : 1
    }
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Results Header */}
      {query && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {results.length} results found for "<span className="font-semibold text-gray-900">{query}</span>"
            {category !== "all" && ` in ${category}`}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Sorted by: {sortOptions.find(opt => opt.id === sortBy)?.label}</span>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {results.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                {query ? "Try adjusting your search terms or filters" : "Enter a search query to find articles"}
              </p>
              {query && (
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Clear search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sortedResults.map((result) => (
            <div key={result.id}>
              <Card 
                className="hover:shadow-md transition-all duration-200 cursor-pointer border group"
                onClick={() => setOpenId(result.id)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-48 flex-shrink-0">
                      <img
                        src={result.image}
                        alt={result.title}
                        className="h-48 sm:h-full w-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {result.category}
                            </Badge>
                            <span className="text-sm text-gray-500">{result.source}</span>
                            <span className="text-sm text-gray-500">{result.date}</span>
                          </div>
                          <CardTitle className="text-xl leading-tight group-hover:text-blue-600 transition-colors">
                            {result.title}
                          </CardTitle>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => toggleBookmark(result.id, e)}
                          >
                            <Bookmark 
                              className={`w-4 h-4 ${bookmarked.has(result.id) ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`} 
                            />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardDescription className="text-base leading-relaxed mb-4">
                        {result.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {result.readTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{result.readTime}</span>
                            </div>
                          )}
                          {result.views && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{result.views.toLocaleString()} views</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all">
                          <span className="text-sm font-medium">Read full story</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Details Dialog */}
              <Dialog open={openId === result.id} onOpenChange={(v) => !v && setOpenId(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                  <div className="aspect-[21/9] w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-3">
                        {result.category}
                      </Badge>
                      <DialogTitle className="text-2xl text-white mb-2">{result.title}</DialogTitle>
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span>{result.source}</span>
                        <span>•</span>
                        <span>{result.date}</span>
                        <span>•</span>
                        <span>{result.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {result.description} This is a sample preview. In a real application, this would contain the full article content fetched from your news API.
                      </p>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">About the Source</h4>
                        <p className="text-gray-600 text-sm">
                          {result.source} is a trusted news provider delivering accurate and timely information to readers worldwide.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => toggleBookmark(result.id, e)}
                            className="gap-2"
                          >
                            <Bookmark 
                              className={`w-4 h-4 ${bookmarked.has(result.id) ? 'fill-blue-600 text-blue-600' : ''}`} 
                            />
                            {bookmarked.has(result.id) ? 'Saved' : 'Save'}
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                          </Button>
                        </div>
                        <Button onClick={() => setOpenId(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const sortOptions = [
  { id: "recent", label: "Most Recent" },
  { id: "popular", label: "Most Popular" },
  { id: "relevant", label: "Most Relevant" },
]
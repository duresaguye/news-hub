import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bookmark, Share2, Clock, Eye } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEverything, useTopHeadlines } from "@/lib/newsHooks"
import Link from "next/link"

interface SearchResultsProps {
  query: string
  category: string
  sortBy: string
}

interface Article {
  id: string
  title: string
  description: string
  source: string
  date: string
  category: string
  image: string
  readTime?: string
  views?: number
  isBookmarked?: boolean
  url?: string
}

export default function SearchResults({ query, category, sortBy }: SearchResultsProps) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const q = useMemo(() => {
    if (!query && category === "all") return "";
    if (!query && category !== "all") return category;
    if (query && category !== "all") return `${query} ${category}`;
    return query;
  }, [query, category]) as string

  const sort = sortBy === "recent" ? "publishedAt" : sortBy === "popular" ? "popularity" : "relevancy"
  const isBlankAll = (!q || q.trim() === "") && category === "all"
  const everything = useEverything({ q, sortBy: sort, language: "en", pageSize: 20 })
  const headlines = useTopHeadlines({ country: "us", pageSize: 20 })

  const loading = isBlankAll ? headlines.loading : everything.loading
  const error = isBlankAll ? headlines.error : everything.error
  const data = isBlankAll ? headlines.data : (everything.data ?? null)

  const results: Article[] = (data ?? []) as unknown as Article[]

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newBookmarked = new Set(bookmarked)
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id)
    } else {
      newBookmarked.add(id)
    }
    setBookmarked(newBookmarked)
  }

  const sortedResults = results

  return (
    <div className="space-y-6">
      {/* Results Header */}
      {(query || category !== "all") && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {results.length} results for {query ? (<span className="font-semibold text-gray-900">"{query}"</span>) : 'your filters'}
            {category !== "all" && ` • ${category}`}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Sorted by: {sortOptions.find(opt => opt.id === sortBy)?.label}</span>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading…</div>
      ) : error ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load articles</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : results.length === 0 ? (
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
              <Link href={result.url ? `/article/${encodeURIComponent(result.url)}` : '#'}>
                <Card 
                  className="hover:shadow-md transition-all duration-200 cursor-pointer border group"
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
              </Link>
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
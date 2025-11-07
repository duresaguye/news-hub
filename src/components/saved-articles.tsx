'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

interface SavedArticle {
  id: string
  title: string
  source: string
  publishedAt: string
  url: string
  urlToImage?: string
  description?: string
  category?: string
}

export default function SavedArticles() {
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const response = await fetch('/api/saved-articles', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch saved articles');
        }

        const data = await response.json();

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.articles)
              ? data.articles
              : [];

        const normalized: SavedArticle[] = items.map((item) => ({
          id: item.id,
          title: item.title ?? 'Untitled article',
          source: item.source ?? 'Unknown source',
          publishedAt: item.publishedAt ?? item.createdAt ?? new Date().toISOString(),
          url: item.url,
          urlToImage: item.imageUrl ?? item.urlToImage ?? undefined,
          description: item.description ?? undefined,
          category: item.category ?? undefined,
        })).filter((item) => Boolean(item.url));

        setSavedArticles(normalized);
      } catch (err) {
        console.error('Error fetching saved articles:', err);
        setError('Failed to load saved articles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedArticles();
  }, []);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            <p>{error}</p>
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : savedArticles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No saved articles yet</p>
            <p className="text-sm text-muted-foreground mt-2">Start saving articles to read them later</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
              Browse Articles
            </Button>
          </CardContent>
        </Card>
      ) : (
        savedArticles.map((article) => (
          <Link key={article.id} href={`/article/${encodeURIComponent(article.url)}`}>
            <Card className="hover:border-primary transition cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {article.category && (
                        <span className="text-xs font-semibold text-primary uppercase">
                          {article.category}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{article.source}</span>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-primary fill-primary" />
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  )
}

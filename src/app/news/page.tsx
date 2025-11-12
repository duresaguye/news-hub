'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import type { RssFeedItem } from '@/lib/rss-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { getAvailableSources } from '@/lib/rss';
import { RssFeed } from '@/lib/rss';

function NewsPageContent() {
  const searchParams = useSearchParams();
  const [feed, setFeed] = useState<RssFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const scope = (searchParams.get('scope') as 'local' | 'global') || 'local';
  const source = searchParams.get('source') || getAvailableSources('local')[0]?.id;

  useEffect(() => {
    const fetchNews = async () => {
      if (!source) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/rss/${scope}/${source}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data: RssFeed = await response.json();
        setFeed(data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [scope, source]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-full flex flex-col">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {scope === 'local' ? 'Local News' : 'Global News'}
        </h1>
        <p className="text-muted-foreground">
          Latest updates from {source?.toUpperCase()}
        </p>
      </div>

      {(!feed?.items || feed.items.length === 0) ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No articles found</h2>
          <p className="text-muted-foreground">
            We couldn't find any articles from this source. Please try another one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feed.items.map((article: RssFeedItem, index: number) => (
            <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-shadow">
              {article.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Hide the image if it fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription>
                  {new Date(article.pubDate).toLocaleDateString()}
                  {article.author && ` • ${article.author}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {article.description || article.contentSnippet || 'No description available.'}
                </p>
                {article.categories && article.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {article.categories.slice(0, 3).map((category, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild variant="outline" className="ml-auto">
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    Read more <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-full flex flex-col">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    }>
      <NewsPageContent />
    </Suspense>
  );
}

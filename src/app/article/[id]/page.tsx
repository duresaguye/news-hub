'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Empty } from '@/components/ui/empty';
import { ArrowLeft, ExternalLink, Calendar, User, Bookmark, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type NewsApiArticle = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

export default function ArticleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  const [article, setArticle] = useState<NewsApiArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Decode the article URL from the ID
    const decodedUrl = decodeURIComponent(articleId);
    
    // Fetch article by searching for it using the URL
    async function fetchArticle() {
      try {
        setLoading(true);
        // Extract domain from URL to search
        const url = new URL(decodedUrl);
        const domain = url.hostname.replace('www.', '');
        
        // Search for the article
        const response = await fetch(`/api/news/everything?domains=${domain}&pageSize=100`);
        const data = await response.json();
        
        if (data.status === 'error') {
          setError(data.message || 'Failed to fetch article');
          return;
        }
        
        // Find the article by URL
        const foundArticle = data.articles?.find((a: NewsApiArticle) => a.url === decodedUrl);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          // If not found, try to get from cache or use URL directly
          // For now, create a basic article object
          setArticle({
            source: { id: null, name: domain },
            author: null,
            title: 'Article',
            description: 'Click below to read the full article on the source website.',
            url: decodedUrl,
            urlToImage: null,
            publishedAt: new Date().toISOString(),
            content: null,
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: Implement bookmark storage
  };

  const shareArticle = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description || '',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Empty title="Article not found" description={error || 'The article you are looking for could not be found.'} />
        <div className="mt-8 text-center">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <article>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge variant="secondary">{article.source.name}</Badge>
            {article.author && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          {article.description && (
            <p className="text-xl text-muted-foreground mb-6">
              {article.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleBookmark}
              className={bookmarked ? 'bg-blue-50 border-blue-200' : ''}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
              {bookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={shareArticle}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Read on Source
              </a>
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        {article.urlToImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.urlToImage}
              alt={article.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            {article.content ? (
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: article.content
                    .replace(/\[.*?\]/g, '') // Remove citations like [1234 chars]
                    .replace(/\+\d+.*/g, '') // Remove "+123 more chars"
                    .split('\n')
                    .map((para) => `<p>${para.trim()}</p>`)
                    .join(''),
                }}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  {article.description || 'Full article content is not available. Please visit the source to read the complete article.'}
                </p>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    To read the full article, visit the original source:
                  </p>
                  <Button asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Full Article on {article.source.name}
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
          <Button asChild>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Source
            </a>
          </Button>
        </div>
      </article>
    </div>
  );
}


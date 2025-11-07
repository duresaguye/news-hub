'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Empty } from '@/components/ui/empty';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ExternalLink, Calendar, User, Bookmark, Share2, Facebook, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';
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
  const { isBookmarked, toggleBookmark, isMutating } = useBookmarks();
  const { toast } = useToast();

  useEffect(() => {
    // Decode the article URL from the ID
    const decodedUrl = decodeURIComponent(articleId);
    
    // Fetch article by searching for it using the URL
    async function fetchArticle() {
      try {
        setLoading(true);
        
        // First try to fetch the specific article by its URL
        try {
          const response = await fetch(`/api/news/article?url=${encodeURIComponent(decodedUrl)}`);
          const data = await response.json();
          
          if (data.article) {
            setArticle(data.article);
            return;
          }
        } catch (err) {
          console.error('Error fetching specific article:', err);
        }
        
        // If specific article fetch fails, try searching by domain
        try {
          const url = new URL(decodedUrl);
          const domain = url.hostname.replace('www.', '');
          
          const searchResponse = await fetch(`/api/news/everything?domains=${domain}&pageSize=50`);
          const searchData = await searchResponse.json();
          
          if (searchData.articles?.length > 0) {
            // Try to find a matching article by URL or title
            const foundArticle = searchData.articles.find(
              (a: NewsApiArticle) => 
                a.url === decodedUrl || 
                a.title.toLowerCase() === new URL(decodedUrl).pathname.split('/').pop()?.toLowerCase()
            );
            
            if (foundArticle) {
              setArticle(foundArticle);
              return;
            }
            
            // If no exact match, use the first article from the domain
            setArticle({
              ...searchData.articles[0],
              url: decodedUrl, // Keep the original URL
            });
            return;
          }
        } catch (err) {
          console.error('Error searching articles by domain:', err);
        }
        
        // If all else fails, create a minimal article object
        const url = new URL(decodedUrl);
        const domain = url.hostname.replace('www.', '');
        
        setArticle({
          source: { id: null, name: domain },
          author: null,
          title: url.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Article',
          description: `Read the full article on ${domain}`,
          url: decodedUrl,
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: null,
        });
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

  const handleBookmark = async () => {
    if (!article?.url) {
      toast({
        title: 'Missing article URL',
        description: 'We could not determine the source URL for this article.',
        variant: 'destructive',
      });
      return;
    }

    await toggleBookmark({
      url: article.url,
      title: article.title,
      source: article.source.name,
      imageUrl: article.urlToImage,
      description: article.description,
      publishedAt: article.publishedAt,
    });
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

  const isSaved = article.url ? isBookmarked(article.url) : false;
  const bookmarkDisabled = article.url ? isMutating(article.url) : false;

  const absoluteArticleUrl = (() => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    try {
      return new URL(`/article/${encodeURIComponent(articleId)}`, 'https://example.com').toString();
    } catch {
      return '';
    }
  })();

  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(absoluteArticleUrl)}&title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.description ?? '')}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteArticleUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(absoluteArticleUrl)}&text=${encodeURIComponent(article.title)}`;

  const copyShareLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(absoluteArticleUrl);
        toast({ title: 'Link copied', description: 'Article link copied to your clipboard.' });
      } else {
        throw new Error('Clipboard not supported');
      }
    } catch (err) {
      console.error('Copy failed', err);
      toast({ title: 'Could not copy link', description: 'Please try again in a moment.', variant: 'destructive' });
    }
  };

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
              onClick={handleBookmark}
              className={isSaved ? 'bg-blue-50 border-blue-200' : ''}
              disabled={bookmarkDisabled}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Share to:</span>
              <Button variant="outline" size="sm" asChild>
                <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" aria-label="Share on LinkedIn">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" title="Share on Facebook" aria-label="Share on Facebook">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="Share on X (Twitter)" aria-label="Share on X (Twitter)">
                  <Twitter className="w-4 h-4 mr-2" />
                  X
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={copyShareLink} title="Copy article link" aria-label="Copy article link">
                <LinkIcon className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
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
            {article.content || article.description ? (
              <div className="space-y-6">
                {/* Show description as a lead-in */}
                {article.description && (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p className="text-xl font-light leading-relaxed text-muted-foreground">
                      {article.description}
                    </p>
                  </div>
                )}
                
                {/* Main content */}
                {article.content && (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    {article.content
                      .replace(/\[.*?\]/g, '') // Remove citations like [1234 chars]
                      .replace(/\+\d+.*/g, '') // Remove "+123 more chars"
                      .split('\n')
                      .filter(para => para.trim().length > 0) // Remove empty paragraphs
                      .map((para, index) => (
                        <p key={index} className="mb-4 leading-relaxed">
                          {para.trim()}
                        </p>
                      ))}
                  </div>
                )}
                
                {/* Source link */}
                <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-muted">
                  <p className="text-sm text-muted-foreground mb-3">
                    This article was originally published on {new URL(article.url).hostname}. 
                    Read the full story with additional details and media:
                  </p>
                  <Button variant="outline" asChild>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Continue reading on {article.source.name}
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-lg leading-relaxed">
                    We couldn't load the full content of this article, but you can read it directly on the source website.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-muted">
                  <Button asChild>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
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


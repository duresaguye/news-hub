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

import type { NewsApiArticle } from '@/lib/newsApi';

export default function ArticleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  const [article, setArticle] = useState<NewsApiArticle & { documentId?: string; content?: any } | null>(null);
  const [articleContent, setArticleContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isBookmarked, toggleBookmark, isMutating } = useBookmarks();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/article?id=${encodeURIComponent(articleId)}`);
        const data = await response.json();
        if (data.article) {
          setArticle(data.article);
          
          // Handle different content formats
          let contentText = '';
          
          if (Array.isArray(data.article.content)) {
            // Handle content as array of blocks
            contentText = data.article.content
              .map((block: any) => {
                if (block.children && Array.isArray(block.children)) {
                  return block.children.map((child: any) => child.text || '').join(' ');
                }
                return '';
              })
              .filter((text: string) => text.trim() !== '')
              .join('\n\n');
          } else if (typeof data.article.content === 'string') {
            // Handle content as plain string
            contentText = data.article.content;
          } else if (data.article.description) {
            // Fallback to description if content is not available
            contentText = data.article.description;
          } else {
            contentText = 'No content available';
          }
          
          setArticleContent(contentText);
          return;
        }

        setError('Article not found');
      } catch (err: any) {
        console.error('Error fetching specific article:', err);
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
    if (!article) {
      toast({
        title: 'Missing article URL',
        description: 'We could not determine the source for this article.',
        variant: 'destructive',
      });
      return;
    }

    await toggleBookmark({
      url: article.url || article.permalink || String(article.id),
      title: article.title,
      source: article.source?.name || 'Unknown',
      imageUrl: article.imageUrl,
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

  const bookmarkKey = article?.url ?? article?.id ?? '';
  const isSaved = bookmarkKey ? isBookmarked(bookmarkKey) : false;
  const bookmarkDisabled = bookmarkKey ? isMutating(bookmarkKey) : false;

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
            <Badge variant="secondary">News Hub</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          {article.content[0]?.children[0]?.text && (
            <p className="text-xl text-muted-foreground mb-6">
              {article.content[0].children[0].text}
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
            <Button variant="outline" size="sm" disabled title="Source link not available">
              <ExternalLink className="w-4 h-4 mr-2" />
              Read on Source
            </Button>
          </div>
        </header>

        {/* Featured Image - Using placeholder since the new API doesn't provide images */}
        <div className="mb-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <div className="w-full aspect-video flex items-center justify-center text-gray-400">
            <span>No image available</span>
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            {article.content || article.description ? (
              <div className="space-y-6">
                {/* Show description as a lead-in */}
                {article.content[0]?.children[0]?.text && (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p className="text-xl font-light leading-relaxed text-muted-foreground">
                      {article.content[0].children[0].text}
                    </p>
                  </div>
                )}
                
                {/* Main content */}
                {articleContent && (
                  <div className="prose max-w-none dark:prose-invert prose-lg">
                    {articleContent
                      .split('\n')
                      .filter(para => para.trim().length > 0)
                      .map((para, index) => (
                        <p key={index} className="mb-4 leading-relaxed">
                          {para.trim()}
                        </p>
                      ))}
                  </div>
                )}
                
                {/* Source link */}
                {article.url && (
                  <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-muted">
                    <p className="text-sm text-muted-foreground mb-3">
                      This article was originally published on {(() => {
                        try {
                          return new URL(article.url).hostname;
                        } catch {
                          return article.source.name;
                        }
                      })()}. 
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
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-lg leading-relaxed">
                    We couldn't load the full content of this article, but you can read it directly on the source website.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground">
                  Source: News Hub
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
          {article.url && (
            <Button asChild>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Source
              </a>
            </Button>
          )}
        </div>
      </article>
    </div>
  );
}


import { NextResponse } from 'next/server';
import { getArticleByUrl } from '@/lib/newsService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { status: 'error', message: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Try to get the article directly by URL from our service
    const article = await getArticleByUrl(url);
    
    if (article) {
      return NextResponse.json({ 
        status: 'ok', 
        article: article 
      });
    }

    // If article not found in cache or current news, try to fetch fresh data
    // by searching with the domain
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      const searchParams = new URLSearchParams({
        domains: domain,
        pageSize: '1',
        sortBy: 'relevancy',
      });
      
      // This will trigger a fresh fetch and update the cache
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/news/everything?${searchParams.toString()}`);
      
      if (response.ok) {
        const { articles } = await response.json();
        if (articles?.length > 0) {
          return NextResponse.json({ 
            status: 'ok', 
            article: articles[0] 
          });
        }
      }
    } catch (searchError) {
      console.error('Error searching for article by domain:', searchError);
      // Continue to return not found if search fails
    }

    return NextResponse.json(
      { status: 'error', message: 'Article not found' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.message || 'Failed to fetch article',
        code: error.code,
      },
      { status: 500 }
    );
  }
}

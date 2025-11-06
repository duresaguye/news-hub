import { NextResponse } from 'next/server';
import { NewsApiClient } from '@/lib/newsApi';

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
    const newsApi = new NewsApiClient();
    
    // Try to get the article directly by URL
    const response = await newsApi.getArticleByUrl(url);
    
    if (response.articles?.length > 0) {
      return NextResponse.json({ status: 'ok', article: response.articles[0] });
    }

    // If direct fetch fails, try searching by domain
    const domain = new URL(url).hostname.replace('www.', '');
    const searchResponse = await newsApi.everything({
      domains: domain,
      pageSize: 1,
      sortBy: 'relevancy',
    });

    if (searchResponse.articles?.length > 0) {
      return NextResponse.json({ status: 'ok', article: searchResponse.articles[0] });
    }

    return NextResponse.json(
      { status: 'error', message: 'Article not found' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

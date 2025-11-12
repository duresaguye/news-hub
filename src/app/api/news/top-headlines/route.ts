import { NextRequest, NextResponse } from 'next/server';
import { fetchNews } from '@/lib/newsService';

// Map NewsAPI parameters to our service parameters
function mapParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Map country if provided
  const country = searchParams.get('country');
  if (country) {
    params.country = country;
  }
  
  // Map category if provided
  const category = searchParams.get('category');
  if (category) {
    params.category = category;
  }
  
  // Map search query if provided
  const q = searchParams.get('q');
  if (q) {
    params.q = q;
  }
  
  // Map page size if provided
  const pageSize = searchParams.get('pageSize');
  if (pageSize) {
    params.pageSize = pageSize;
  }
  
  return params;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  try {
    // Convert query parameters to our service's expected format
    const params = mapParams(searchParams);
    
    // Fetch news using our service (with caching and fallback)
    const newsData = await fetchNews(params);
    
    // Return the response in the same format as before
    return NextResponse.json({
      status: 'ok',
      totalResults: newsData.articles.length,
      articles: newsData.articles,
    });
    
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error.message || 'Failed to fetch news',
        code: error.code,
      },
      { status: 500 }
    );
  }
}

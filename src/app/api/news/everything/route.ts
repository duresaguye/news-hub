import { NextRequest, NextResponse } from 'next/server';
import { fetchNews } from '@/lib/newsService';

// Map NewsAPI parameters to our service parameters
function mapParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  
  // Map search query
  const q = searchParams.get('q');
  if (q) params.q = q;
  
  // Map search in title
  const qInTitle = searchParams.get('qInTitle');
  if (qInTitle) params.q = qInTitle; // Using q since Currents/Guardian don't have title-specific search
  
  // Map domains
  const domains = searchParams.get('domains');
  if (domains) params.domains = domains;
  
  // Map exclude domains
  const excludeDomains = searchParams.get('excludeDomains');
  if (excludeDomains) params.excludeDomains = excludeDomains;
  
  // Map date range
  const from = searchParams.get('from');
  if (from) params.from = from;
  
  const to = searchParams.get('to');
  if (to) params.to = to;
  
  // Map language
  const language = searchParams.get('language');
  if (language) params.language = language;
  
  // Map sort order
  const sortBy = searchParams.get('sortBy');
  if (sortBy) params.sortBy = sortBy;
  
  // Map pagination
  const pageSize = searchParams.get('pageSize');
  if (pageSize) params.pageSize = pageSize;
  
  const page = searchParams.get('page');
  if (page) params.page = page;
  
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

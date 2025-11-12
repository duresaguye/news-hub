import { supabase } from './supabase';

// Cache configuration
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_MISS_THRESHOLD = 10 * 60 * 1000; // 10 minutes

// Types
type NewsSource = 'currents' | 'guardian' | 'rss' | 'cache' | 'mixed';
type NewsRegion = 'local' | 'global';

interface CachedNewsData {
  status: 'ok' | 'error';
  totalResults: number;
  articles: NewsArticle[];
  source: NewsSource | string;
  region: NewsRegion;
  cachedAt?: number;
  expiresAt?: number;
  etag?: string;
  lastModified?: string;
}

// Error response helper
function createErrorResponse(message: string, status: 'ok' | 'error' = 'error'): NewsResponse {
  return {
    status,
    totalResults: 0,
    articles: [],
    source: 'rss',
    region: 'global',
    message,
  };
}

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: NewsArticle[];
  source: NewsSource | string;
  region: NewsRegion;
  message?: string;
  cachedAt?: number;
  expiresAt?: number;
}

// API Endpoints
const CURRENTS_API_URL = 'https://api.currentsapi.services/v1/latest-news';
const GUARDIAN_API_URL = 'https://content.guardianapis.com/search';

// Add NewsAPI fetch
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Fetch from Currents API
async function fetchFromCurrents(params: Record<string, string> = {}): Promise<NewsResponse> {
  const currentsApiKey = process.env.CURRENTS_API_KEY;
  if (!currentsApiKey) {
    throw new Error('CURRENTS_API_KEY is not configured');
  }

  const searchParams = new URLSearchParams({
    apiKey: currentsApiKey,
    ...params,
  });

  const response = await fetchWithTimeout(`${CURRENTS_API_URL}?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Currents API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Transform Currents API response to match our NewsResponse type
  return {
    status: 'ok',
    totalResults: data.news?.length || 0,
    articles: (data.news || []).map((item: any) => ({
      source: {
        id: item.id,
        name: item.author || 'Unknown',
      },
      author: item.author || null,
      title: item.title,
      description: item.description || null,
      url: item.url,
      urlToImage: item.image || null,
      publishedAt: item.published,
      content: item.content || null,
    })),
    source: 'currents',
    region: 'global',
  };
}

// Fetch from Guardian API
async function fetchFromGuardian(params: Record<string, string> = {}): Promise<NewsResponse> {
  const guardianApiKey = process.env.GUARDIAN_API_KEY;
  if (!guardianApiKey) {
    throw new Error('GUARDIAN_API_KEY is not configured');
  }

  const searchParams = new URLSearchParams({
    'api-key': guardianApiKey,
    'show-fields': 'all',
    ...params,
  });

  const response = await fetchWithTimeout(`${GUARDIAN_API_URL}?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Guardian API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Transform Guardian API response to match our NewsResponse type
  return {
    status: 'ok',
    totalResults: data.response?.total || 0,
    articles: (data.response?.results || []).map((item: any) => ({
      source: {
        id: item.id,
        name: item.sectionName || 'The Guardian',
      },
      author: item.fields?.byline?.replace('By ', '') || null,
      title: item.webTitle,
      description: item.fields?.trailText || null,
      url: item.webUrl,
      urlToImage: item.fields?.thumbnail || null,
      publishedAt: item.webPublicationDate,
      content: item.fields?.body || null,
    })),
    source: 'guardian',
    region: 'global',
  };
}

// Add NewsAPI fetch
async function fetchFromNewsApi(params: Record<string, string> = {}): Promise<NewsResponse> {
  const newsApiKey = process.env.NEWS_API_KEY;
  if (!newsApiKey) {
    throw new Error('NEWS_API_KEY is not configured');
  }
  const searchParams = new URLSearchParams({
    apiKey: newsApiKey,
    ...params,
  });
  const response = await fetchWithTimeout(`${NEWS_API_URL}?${searchParams.toString()}`);
  if (response.status === 429) throw new Error('NewsAPI quota reached');
  if (!response.ok) throw new Error('NewsAPI returned: ' + response.statusText);
  const data = await response.json();
  return {
    status: 'ok',
    totalResults: data.articles?.length || 0,
    articles: (data.articles || []).map((item: any) => ({
      source: { id: item.source?.id, name: item.source?.name },
      author: item.author,
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.urlToImage,
      publishedAt: item.publishedAt,
      content: item.content,
    })),
    source: 'newsapi',
    region: params.country === 'et' ? 'local' : 'global',
  };
}

// Fetch from RSS feeds with caching
async function fetchFromRssFeeds(region: NewsRegion, sourceId?: string): Promise<NewsResponse> {
  const validRegion = region === 'local' ? 'local' : 'global';
  const cacheKey = `rss_${validRegion}${sourceId ? `_${sourceId}` : ''}`;

  try {
    // Try to get from cache first
    const cached = await getCachedNews({
      feedUrl: sourceId ? undefined : `rss:${validRegion}`,
      source: sourceId || 'rss',
      region: validRegion,
      maxAgeMs: CACHE_MISS_THRESHOLD // Shorter cache miss threshold for RSS
    });

    if (cached) {
      return {
        ...cached,
        source: 'rss',
        region: validRegion
      };
    }

    // If we have a specific source, fetch just that one
    if (sourceId) {
      const { data: feedData } = await supabase
        .from('rss_feeds')
        .select('*')
        .eq('source', sourceId)
        .eq('region', validRegion)
        .single();

      if (!feedData) {
        return createErrorResponse('RSS feed not found');
      }

      const response = await fetch(`/api/rss/${validRegion}/${sourceId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update cache
      await updateCache({
        data: {
          ...data,
          source: 'rss',
          region: validRegion
        },
        feedUrl: feedData.url,
        source: feedData.source as NewsSource,
        region: validRegion,
        etag: response.headers.get('etag'),
        lastModified: response.headers.get('last-modified')
      });

      return data;
    }

    // If no specific source, fetch all feeds for the region
    const { data: feeds } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('region', validRegion)
      .eq('is_active', true);

    if (!feeds?.length) {
      return createErrorResponse('No active RSS feeds found for this region');
    }

    // Fetch all feeds in parallel
    const results = await Promise.allSettled(
      feeds.map((feed: { source: string }) => 
        fetch(`/api/rss/${validRegion}/${feed.source}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      )
    );

    // Combine results
    const articles = results
      .filter((result): result is PromiseFulfilledResult<NewsResponse> => 
        result.status === 'fulfilled' && result.value?.articles?.length > 0
      )
      .flatMap(result => result.value.articles);

    // Cache the combined result
    const response: NewsResponse = {
      status: 'ok',
      totalResults: articles.length,
      articles,
      source: 'rss',
      region: validRegion as NewsRegion
    };

    await updateCache({
      data: response,
      feedUrl: `rss:${validRegion}`,
      source: 'rss',
      region: validRegion
    });

    return response;
  } catch (error) {
    console.error('Error in fetchFromRssFeeds:', error);
    return createErrorResponse('Failed to fetch RSS feeds');
  }
}

/**
 * Get cached news from Supabase if available and not expired
 */
async function getCachedNews({
  feedUrl,
  source,
  region = 'global',
  maxAgeMs = CACHE_TTL_MS
}: {
  feedUrl?: string;
  source?: string;
  region?: NewsRegion;
  maxAgeMs?: number;
}): Promise<NewsResponse | null> {
  try {
    if (!supabase) return null;
    
    const { data, error } = await supabase.rpc<{ 
      data: { articles: NewsArticle[] };
      source: string;
      region: string;
    }>('get_cached_news', {
      p_feed_url: feedUrl || null,
      p_source: source || null,
      max_age_seconds: Math.floor(maxAgeMs / 1000)
    });

    if (error || !data) {
      if (error) console.error('Error fetching from cache:', error);
      return null;
    }

    // Convert the cached data to NewsResponse format
    const response: NewsResponse = {
      status: 'ok',
      totalResults: data.data?.articles?.length || 0,
      articles: data.data?.articles || [],
      source: (data.source as NewsSource) || 'cache',
      region: (data.region as NewsRegion) || region,
    };
    return response;
  } catch (error) {
    console.error('Error in getCachedNews:', error);
    return null;
  }
}

/**
 * Update the cache with new data
 */
async function updateCache({
  data,
  feedUrl,
  source,
  region = 'global',
  etag,
  lastModified
}: {
  data: NewsResponse;
  feedUrl?: string;
  source?: string;
  region?: NewsRegion;
  etag?: string | null;
  lastModified?: string | null;
}): Promise<void> {
  try {
    if (!supabase) return;

    const cacheData = {
      ...data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + CACHE_TTL_MS
    };
    
    await supabase.rpc<{ success: boolean }>('update_news_cache', {
      p_feed_url: feedUrl || null,
      p_source: source || null,
      p_data: cacheData,
      p_etag: etag || null,
      p_last_modified: lastModified || null
    });
  } catch (error) {
    console.error('Error updating cache:', error);
  }
}

// Edit fetchNews to rotate API usage with fallback
export async function fetchNews(params: Record<string, string> = {}): Promise<NewsResponse> {
  const region = (params.region as NewsRegion) || 'global';
  // Check if a specific RSS source was provided
  const source = params.source;
  const query = params.q || '';

  // Build cache key
  const cacheKey = `news_${region}${source ? `_${source}` : ''}${query ? `_${query}` : ''}`;

  try {
    // Try to get from cache first
    const cachedNews = await getCachedNews({
      feedUrl: source ? undefined : `news:${region}`,
      source: source || 'news',
      region,
      maxAgeMs: source ? CACHE_MISS_THRESHOLD : CACHE_TTL_MS
    });
    if (cachedNews) return { ...cachedNews, source: 'cache' };

    let news: NewsResponse | undefined;
    if (region === 'local') {
      // If user picked a source, use RSS
      if (source) {
        news = await fetchFromRssFeeds(region, source);
      } else {
        // Default: Currents API, fallback to Guardian if fails
        try {
          news = await fetchFromCurrents({ ...params, keywords: 'Ethiopia' });
        } catch (err: any) {
          news = await fetchFromGuardian(params);
        }
        // Fallback: RSS if all else fails
        if (!news || !news.articles || news.articles.length === 0) {
          news = await fetchFromRssFeeds(region);
        }
      }
    } else {
      // For global: Try NewsAPI, fallback to Currents, then Guardian, then RSS
      try {
        news = await fetchFromNewsApi(params);
      } catch (e1: any) {
        try {
          news = await fetchFromCurrents(params);
        } catch (e2: any) {
          try {
            news = await fetchFromGuardian(params);
          } catch (e3: any) {
            news = await fetchFromRssFeeds(region);
          }
        }
      }
    }
    // Cache result if found
    if (news && news.status === 'ok' && news.articles && news.articles.length > 0) {
      await updateCache({
        data: news,
        source: source || 'mixed',
        region: region as NewsRegion
      });
    }
    return news || createErrorResponse('No news available');
  } catch (error) {
    console.error('Error in fetchNews:', error);
    return createErrorResponse('Failed to fetch news');
  }
}

// Get a single article by URL
export async function getArticleByUrl(url: string): Promise<NewsArticle | null> {
  try {
    // Try to find in cache first
    const cachedNews = await getCachedNews({
      source: 'mixed',
      region: 'global'
    });
    
    if (cachedNews?.articles) {
      const article = cachedNews.articles.find(a => a.url === url);
      if (article) return article;
    }

    // If not in cache, try to fetch fresh data
    const freshNews = await fetchNews();
    return freshNews.articles.find(a => a.url === url) || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export type NewsApiArticle = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  permalink: string;
  imageUrl: string | null;
  publishedAt: string;
  createdAt?: string;
  content: string | null;
  source: { id: string | null; name: string };
  category?: string | null;
};

export type NewsApiResponse = {
  status: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  data?: any[];
  [key: string]: any; // Allow for additional properties
};

async function doGet(path: string, params: Record<string, unknown> = {}): Promise<NewsApiResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const url = `/api/news${path}?${searchParams.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NewsAPI request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return (await res.json()) as NewsApiResponse;
}

export type TopHeadlinesParams = {
  tenantId?: string;
  categoryId?: string;
  dateGt?: string;
  q?: string;
  search?: string;
  country?: string;
  category?: string;
  sources?: string;
  pageSize?: number;
  page?: number;
};

export async function fetchTopHeadlines(params: TopHeadlinesParams = {}): Promise<NewsApiResponse> {
  return doGet("/top-headlines", params);
}

export type EverythingParams = {
  tenantId?: string;
  categoryId?: string;
  dateGt?: string;
  q?: string;
  search?: string;
  language?: string;
  sortBy?: string;
  domains?: string;
  pageSize?: number;
  page?: number;
};

export async function fetchEverything(params: EverythingParams = {}): Promise<NewsApiResponse> {
  return doGet("/everything", params);
}

export function mapNewsArticleToCard(a: NewsApiArticle) {
  // allow loose access to custom backend fields
  const aAny = a as any;
  
  // Extract title with fallbacks
  const title = a.title || aAny.Title || aAny.title || 'Untitled';
  
  // Extract description with multiple fallbacks
  let description = a.description || '';
  if (!description) {
    if (Array.isArray(aAny.content)) {
      description = aAny.content
        .map((paragraph: any) =>
          Array.isArray(paragraph?.children)
            ? paragraph.children.map((child: any) => child.text || '').join(' ').trim()
            : ''
        )
        .filter((text: string) => text)
        .join('\n\n');
    } else if (typeof aAny.content === 'string') {
      description = aAny.content;
    }
  }
  
  // Final fallbacks for description
  description = description || aAny.Summary || aAny.summary || aAny.Content || '';
  
  // Ensure we have a valid source name
  const sourceName = 
    (a.source?.name || aAny.source?.name || 
     aAny.Source?.name || aAny.source || 'Unknown').toString();
  
  // Format the date
  const date = a.publishedAt || aAny.publishedAt || aAny.Date;
  const formattedDate = date ? new Date(date).toLocaleString() : '';
  
  // Get category with fallback
  const category = a.category || aAny.Category || aAny.category || 'News';
  
  // Get image URL with fallback
  const imageUrl = a.imageUrl || aAny.Image?.url || aAny.imageUrl || '';
  
  // Ensure we have a valid URL
  const url = a.permalink || a.url || `/article/${encodeURIComponent(a.id)}`;

  return {
    id: a.id || String(Math.random()),
    title: title,
    description: description.toString(),
    source: sourceName,
    date: formattedDate,
    category: category,
    readTime: undefined,
    views: undefined,
    image: imageUrl,
    isBreaking: false,
    url: url,
  };
}

export class NewsApiClient {
  basePath = "/api/news";

  async topHeadlines(params: TopHeadlinesParams = {}) {
    return fetchTopHeadlines(params);
  }

  async everything(params: EverythingParams = {}) {
    return fetchEverything(params);
  }

  // Returns the first matching article or null
  async getArticleByUrl(url: string) {
    const res = await doGet("/article", { url });
    return res.articles && res.articles.length > 0 ? res.articles[0] : null;
  }
}



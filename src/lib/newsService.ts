import {
  fetchCategories,
  fetchNewsByCategory,
  fetchNewsById,
  fetchNewsByTenant,
  fetchNewsList,
  fetchTenants,
  type LedNewsItem,
} from "./ledNewsApi";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type NewsSource = "led" | "category" | "tenant" | "cache";

export interface ContentBlock {
  type: string;
  children: Array<{ text: string }>;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  permalink: string;
  imageUrl: string | null;
  publishedAt: string;
  content: string | ContentBlock[] | null;
  source: {
    id: string | null;
    name: string;
  };
  category?: string | null;
}

export interface NewsResponse {
  status: "ok" | "error";
  totalResults: number;
  articles: NewsArticle[];
  source: NewsSource | string;
  message?: string;
}

export type FetchNewsParams = {
  tenantId?: string | number;
  categoryId?: string | number;
  dateGt?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

type CacheEntry = {
  data: NewsResponse;
  expiresAt: number;
};

const newsCache = new Map<string, CacheEntry>();

function getCache(key: string): NewsResponse | null {
  const entry = newsCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    newsCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: NewsResponse) {
  newsCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function normalizeText(...values: Array<string | undefined | null>): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    } else if (value !== null && value !== undefined && typeof value !== 'object') {
      // e.g. numbers, booleans
      const asStr = String(value).trim();
      if (asStr.length > 0) return asStr;
    }
    // skip objects/arrays
  }
  return null;
}

function extractImage(item: LedNewsItem): string | null {
  const possibleImages = [
    item.Image?.url,
    item.image?.url,
    item.cover?.url,
    item.thumbnail?.url,
  ];

  for (const img of possibleImages) {
    if (img) return img.startsWith("http") ? img : `http://led.weytech.et:1338${img}`;
  }

  const formats = item.Image?.formats || item.image?.formats;
  if (formats) {
    for (const format of Object.values(formats)) {
      if (format?.url) {
        return format.url.startsWith("http") ? format.url : `http://led.weytech.et:1338${format.url}`;
      }
    }
  }

  return null;
}

function extractSource(item: LedNewsItem): { id: string | null; name: string } {
  const tenant = (item.tenant || item.Tenant) as LedNewsItem["tenant"] | undefined;
  const tenantName = tenant?.name || tenant?.Name || "News Source";
  return {
    id: tenant?.documentId || (tenant?.id ? String(tenant.id) : null),
    name: tenantName,
  };
}

function mapLedNewsToArticle(item: LedNewsItem): NewsArticle {
  const title =
    normalizeText(item.Title, item.title, item.name, `News Item #${item.id}`) ?? `News Item #${item.id}`;
  const description = normalizeText(item.Summary, item.summary, item.description, item.Content, item.content);
  const content = normalizeText(item.Content, item.content, item.body);
  const publishedAt =
    item.Date || item.publishedAt || item.createdAt || new Date().toISOString();
  const imageUrl = extractImage(item);
  const slug = item.slug || item.documentId || `news-${item.id}`;
  const permalink = `/article/${encodeURIComponent(String(slug))}`;
  const externalUrl = normalizeText(
    item.Link,
    item.link,
    item.Url,
    item.url,
    item.SourceLink,
    item.sourceLink,
    item.permalink
  );
  const categoryData = (item.category || item.Category) as LedNewsItem["category"] | undefined;
  const category = normalizeText(
    categoryData?.Name,
    categoryData?.name
  );

  return {
    id: String(item.documentId || item.id),
    title,
    description,
    url: externalUrl,
    permalink,
    imageUrl,
    publishedAt,
    content,
    source: extractSource(item),
    category,
  };
}

function createErrorResponse(message: string): NewsResponse {
      return {
    status: "error",
    totalResults: 0,
    articles: [],
    source: "led",
    message,
  };
}

function buildQueryParams(params: FetchNewsParams): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (params.dateGt) {
    query["filters[Date][$gt]"] = params.dateGt;
  }
  if (params.search) {
    query["filters[Title][$containsi]"] = params.search;
  }
  if (params.page) {
    query["pagination[page]"] = params.page;
  }
  if (params.pageSize) {
    query["pagination[pageSize]"] = params.pageSize;
  }
  return query;
}

export async function fetchNews(params: FetchNewsParams = {}): Promise<NewsResponse> {
  const cacheKey = JSON.stringify(params);
  const cached = getCache(cacheKey);
  if (cached) {
    return { ...cached, source: "cache" };
  }

  try {
    let responseData;
    let source: NewsSource | string = "led";

    const query = buildQueryParams(params);

    if (params.tenantId) {
      responseData = await fetchNewsByTenant(params.tenantId, {
        ...query,
      });
      source = `tenant:${params.tenantId}`;
    } else if (params.categoryId) {
      responseData = await fetchNewsByCategory(params.categoryId, {
        ...query,
      });
      source = `category:${params.categoryId}`;
    } else {
      try {
        // Try to get from cache first
        const cacheKey = JSON.stringify(params);
        const cached = getCache(cacheKey);
        if (cached) return cached;

        // If not in cache, fetch from API
        const response = await fetchNewsList(query);

        // Handle the case where the response is already in the expected format
        if (Array.isArray(response)) {
          const articles = response.map(mapLedNewsToArticle);
          const result: NewsResponse = {
            status: "ok",
            totalResults: articles.length,
            articles,
            source: "led",
          };
          setCache(cacheKey, result);
          return result;
        }

        // Handle the case where the response has a data property
        if (response.data) {
          const articles = Array.isArray(response.data) 
            ? response.data.map(mapLedNewsToArticle)
            : [];
          
          const result: NewsResponse = {
            status: "ok",
            totalResults: response.meta?.pagination?.total || articles.length,
            articles,
            source: "led",
          };
          
          setCache(cacheKey, result);
          return result;
        }

        return createErrorResponse("No data available");
      } catch (error) {
        console.error("Error fetching news from LED API:", error);
        return createErrorResponse("Failed to fetch news");
      }
    }

    const articles = (responseData?.data || []).map(mapLedNewsToArticle);
    const result: NewsResponse = {
      status: "ok",
      totalResults: articles.length,
      articles,
      source,
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error fetching news from LED API:", error);
    return createErrorResponse("Failed to fetch news");
  }
}

export async function getArticleById(id: string | number): Promise<NewsArticle | null> {
  try {
    // First try the direct ID-based endpoint
    try {
      const response = await fetchNewsById(id);
      if (response.data) {
        const article = mapLedNewsToArticle(response.data);
        // Ensure content is in the correct format
        if (article && !article.content) {
          article.content = [{
            type: 'paragraph',
            children: [{ text: article.description || 'No content available' }]
          }];
        }
        return article;
      }
    } catch (e) {
      console.warn("Direct ID fetch failed, trying list endpoint");
    }
    
    // If direct fetch fails, try fetching from the list and filter by ID
    const listResponse = await fetchNewsList();
    if (listResponse.data) {
      // Try to find by documentId first, then by id
      const articleData = listResponse.data.find(
        (item: any) => 
          String(item.documentId) === String(id) || 
          String(item.id) === String(id)
      );
      
      if (articleData) {
        const article = mapLedNewsToArticle(articleData);
        // Ensure content is in the correct format
        if (article && !article.content) {
          article.content = [{
            type: 'paragraph',
            children: [{ text: article.description || 'No content available' }]
          }];
        }
        return article;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching news article:", error);
    return null;
  }
}

export async function getSources() {
  const [tenants, categories] = await Promise.all([fetchTenants(), fetchCategories()]);
  return {
    tenants: tenants.data || [],
    categories: categories.data || [],
  };
}

export type NewsApiArticle = {
  articles: any;
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string; // ISO
  content: string | null;
};

export type NewsApiResponse = {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
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
  country?: string; 
  category?: string; // business, entertainment, general, health, science, sports, technology
  q?: string;
  pageSize?: number;
  page?: number;
  sources?: string; 
};

export async function fetchTopHeadlines(params: TopHeadlinesParams = {}): Promise<NewsApiResponse> {
  return doGet("/top-headlines", params);
}

export type EverythingParams = {
  q?: string; // keywords or phrases
  qInTitle?: string;
  searchIn?: string; // title,description,content
  sources?: string;
  domains?: string;
  excludeDomains?: string;
  from?: string; // ISO date
  to?: string; // ISO date
  language?: string; // en, es, etc
  sortBy?: "relevancy" | "popularity" | "publishedAt";
  pageSize?: number;
  page?: number;
};

export async function fetchEverything(params: EverythingParams = {}): Promise<NewsApiResponse> {
  return doGet("/everything", params);
}

export function mapNewsArticleToCard(a: NewsApiArticle) {
  return {
    id: a.url, // use url as unique id
    title: a.title,
    description: a.description ?? "",
    source: a.source?.name ?? "Unknown",
    date: new Date(a.publishedAt).toLocaleString(),
    category: "News",
    readTime: undefined,
    views: undefined,
    image: a.urlToImage || "",
    isBreaking: false,
    url: a.url,
  };
}

// Add a minimal NewsApiClient so imports expecting it work.
// This wraps the existing functions and provides a getArticleByUrl helper.
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



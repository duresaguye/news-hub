export type NewsApiArticle = {
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

const BASE_URL = "https://newsapi.org/v2";

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("Missing VITE_NEWS_API_KEY. Add it to your .env file.");
  }
  return apiKey;
}

function toQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    usp.set(key, String(value));
  });
  return usp.toString();
}

async function doGet(path: string, params: Record<string, unknown> = {}): Promise<NewsApiResponse> {
  const apiKey = getApiKey();
  const query = toQuery({ ...params, apiKey });
  const url = `${BASE_URL}${path}?${query}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NewsAPI request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return (await res.json()) as NewsApiResponse;
}

export type TopHeadlinesParams = {
  country?: string; // e.g., 'us'
  category?: string; // business, entertainment, general, health, science, sports, technology
  q?: string;
  pageSize?: number;
  page?: number;
  sources?: string; // comma separated source ids
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



export interface RssFeedItem {
  title: string;
  link: string;
  pubDate: string;
  image?: string;
  source: string;
  description?: string;
  author?: string;
  categories?: string[];
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
}

export interface RssFeed {
  items: RssFeedItem[];
  title?: string;
  description?: string;
  link?: string;
  language?: string;
  image?: {
    link?: string;
    url: string;
    title?: string;
  };
  copyright?: string;
  lastBuildDate?: string;
  updated?: string;
  generator?: string;
  feedUrl?: string;
  paginationLinks?: {
    self?: string;
    first?: string;
    last?: string;
    next?: string;
  };
  itunes?: {
    [key: string]: any;
  };
}

// Type definitions
type LocalSource = 'fanabc' | 'addis-standard' | 'reporter-ethiopia' | 'ethiopian-monitor' | 'ena';
type GlobalSource = 'bbc' | 'cnn' | 'aljazeera' | 'reuters' | 'ap' | 'dw';
type Scope = 'local' | 'global';

interface RssFeeds {
  local: Partial<Record<LocalSource, string>>;
  global: Record<GlobalSource, string>;
}

// RSS Feed URLs
export const rssFeeds: RssFeeds = {
  local: {
    'fanabc': 'https://www.fanabc.com/feed/',
    'addis-standard': 'https://addisstandard.com/feed/',
    'reporter-ethiopia': 'https://www.thereporterethiopia.com/feed/',
    'ethiopian-monitor': 'https://ethiopianmonitor.com/feed/',
    'ena': 'https://www.ena.et/feed/'
  },
  global: {
    bbc: "https://feeds.bbci.co.uk/news/rss.xml",
    cnn: "http://rss.cnn.com/rss/edition.rss",
    aljazeera: "https://www.aljazeera.com/xml/rss/all.xml",
    reuters: "http://feeds.reuters.com/reuters/topNews",
    ap: "http://feeds.apnews.com/apf-topnews",
    dw: "https://rss.dw.com/rdf/rss-en-all"
  }
};

// Alternative feed URLs for fallback
export const alternativeFeeds: Record<string, string[]> = {
  'fanabc': ['https://www.fanabc.com/rss/'],
  'addis-standard': ['https://addisstandard.com/rss/'],
  'reporter-ethiopia': ['https://www.thereporterethiopia.com/rss/'],
  'ethiopian-monitor': ['https://ethiopianmonitor.com/rss/'],
  'ena': ['https://www.ena.et/rss/'],
  'cnn': [
    'http://rss.cnn.com/rss/edition_world.rss',
    'https://rss.cnn.com/rss/edition.rss'
  ],
  'reuters': [
    'http://feeds.reuters.com/reuters/worldNews',
    'https://feeds.reuters.com/reuters/topNews'
  ],
  'ap': [
    'http://feeds.apnews.com/apf-internationalnews',
    'https://rss.ap.org/rss/topnews.xml'
  ]
};

// Helper functions
function extractFirstImageFromHtml(html: string | undefined): string | undefined {
  if (!html) return undefined;
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : undefined;
}

function sanitizeDescription(desc: string | undefined): string {
  if (!desc) return '';
  return desc
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200);
}

export function formatSourceName(source: string): string {
  const nameMap: Record<string, string> = {
    'fanabc': 'Fana BC',
    'addis-standard': 'Addis Standard',
    'reporter-ethiopia': 'Reporter Ethiopia',
    'ethiopian-monitor': 'Ethiopian Monitor',
    'ena': 'Ethiopian News Agency',
    'bbc': 'BBC News',
    'cnn': 'CNN',
    'aljazeera': 'Al Jazeera',
    'reuters': 'Reuters',
    'ap': 'Associated Press',
    'dw': 'Deutsche Welle'
  };
  return nameMap[source] || source.charAt(0).toUpperCase() + source.slice(1).replace(/-/g, ' ');
}

// Fetch RSS feed (client-side)
export async function fetchRssFeed<T extends Scope>(
  scope: T,
  source: T extends 'local' ? LocalSource : GlobalSource
): Promise<RssFeed> {
  const response = await fetch(`/api/rss/${scope}/${source}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${source} news. Please try again later.`);
  }
  return response.json();
}

// Fetch and parse RSS feed (server-side)
export async function fetchRssFeedServer<T extends Scope>(
  scope: T,
  source: T extends 'local' ? LocalSource : GlobalSource
): Promise<RssFeed> {
  const Parser = (await import('rss-parser')).default;
  const parser = new Parser({
    timeout: 15000,
    requestOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache'
      },
      rejectUnauthorized: false
    }
  });

  const primaryUrl = rssFeeds[scope][source as keyof RssFeeds[T]];
  const alternatives = alternativeFeeds[source as string] || [];
  const urlsToTry = [primaryUrl, ...alternatives].filter(Boolean) as string[];

  let lastError: Error | null = null;
  
  for (const url of urlsToTry) {
    try {
      const feed = await parser.parseURL(url);
      return {
        ...feed,
        items: (feed.items || []).map(item => ({
          title: item.title?.trim() || 'No title',
          link: item.link?.trim() || '#',
          pubDate: item.pubDate?.trim() || item.isoDate || new Date().toISOString(),
          image: extractFirstImageFromHtml(item.content || item['content:encoded'] || ''),
          source: formatSourceName(source as string),
          description: sanitizeDescription(item.contentSnippet || item.description || item.summary),
          author: item.creator || item.author || item['dc:creator'] || '',
          categories: item.categories || [],
          content: item.content || item['content:encoded'],
          contentSnippet: item.contentSnippet,
          guid: item.guid || item.link,
          isoDate: item.isoDate || item.pubDate
        }))
      };
    } catch (error) {
      lastError = error as Error;
      console.warn(`Failed to fetch from ${url}:`, error);
      continue;
    }
  }

  throw lastError || new Error(`Failed to fetch ${source} feed from any available source`);
}

// Get available sources for a scope
export function getAvailableSources(scope: Scope): { id: string; name: string }[] {
  const sources = scope === 'local' ? 
    Object.keys(rssFeeds.local) : 
    Object.keys(rssFeeds.global);
    
  return sources.map(source => ({
    id: source,
    name: formatSourceName(source)
  }));
}

// Export types
export type { LocalSource, GlobalSource, Scope };

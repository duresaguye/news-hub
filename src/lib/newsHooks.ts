import { useEffect, useMemo, useState } from "react";
import { fetchEverything, fetchTopHeadlines, mapNewsArticleToCard, type EverythingParams, type TopHeadlinesParams, type NewsApiArticle } from "./newsApi";

export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Define a type for the Strapi article response
interface StrapiArticle {
  id: number;
  attributes: {
    Title?: string;
    title?: string; // Some APIs might use lowercase 'title'
    content?: Array<{
      children: Array<{
        text: string;
      }>;
    }>;
    publishedAt?: string;
    image?: {
      data?: {
        attributes?: {
          url?: string;
        };
      };
    };
    source?: string;
    category?: {
      data?: {
        attributes?: {
          name?: string;
        };
      };
    };
  };
}

export function useTopHeadlines(params: TopHeadlinesParams) {
  const [state, setState] = useState<FetchState<ReturnType<typeof mapNewsArticleToCard>[]>>({ 
    data: [], 
    loading: false, 
    error: null 
  });

  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  useEffect(() => {
    let cancelled = false;
    
    async function run() {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // First try the Strapi API directly
        const strapiResponse = await fetch('http://led.weytech.et:1338/api/newsses');
        if (!strapiResponse.ok) {
          throw new Error(`HTTP error! status: ${strapiResponse.status}`);
        }
        
        const strapiData = await strapiResponse.json();
        let articles: NewsApiArticle[] = [];
        
        // Handle Strapi response format
        if (strapiData.data && Array.isArray(strapiData.data)) {
          articles = strapiData.data.map((item: any) => {
            console.log('Processing article:', item); // Debug log
            
            // Extract content text for description
            let description = 'No description available';
            if (Array.isArray(item.content)) {
              description = item.content
                .map((block: any) => {
                  if (block?.children) {
                    return block.children
                      .map((child: any) => child.text || '')
                      .join(' ')
                      .trim();
                  }
                  return '';
                })
                .filter(Boolean)
                .join('\n\n') || 'No description available';
            }
            
            const article = {
              id: String(item.id),
              title: item.Title || 'No title',
              description: description,
              url: null,
              permalink: `/article/${item.id}`,
              imageUrl: item.image?.url || null,
              publishedAt: item.publishedAt || item.Date || new Date().toISOString(),
              content: item.content || null,
              source: {
                id: null,
                name: item.source || 'News Source'
              },
              category: item.category || 'General'
            };
            
            console.log('Mapped article:', article); // Debug log
            return article;
          });
        }
        
        // Fallback to the original API if no data from Strapi
        if (articles.length === 0) {
          const res = await fetchTopHeadlines(stableParams);
          
          if (Array.isArray(res)) {
            articles = res;
          } else if (res.data && Array.isArray(res.data)) {
            articles = res.data;
          } else if (res.articles && Array.isArray(res.articles)) {
            articles = res.articles;
          }
        }
        
        if (!cancelled) {
          const mappedArticles = articles.map(article => mapNewsArticleToCard(article as NewsApiArticle));
          setState({ 
            data: mappedArticles, 
            loading: false, 
            error: mappedArticles.length === 0 ? 'No articles found' : null 
          });
        }
      } catch (e: any) {
        console.error('Error in useTopHeadlines:', e);
        if (!cancelled) {
          setState({ 
            data: null, 
            loading: false, 
            error: e?.message ?? "Failed to fetch news" 
          });
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [stableParams]);

  return state;
}

export function useEverything(params: EverythingParams) {
  const [state, setState] = useState<FetchState<ReturnType<typeof mapNewsArticleToCard>[]>>({ data: null, loading: false, error: null });
  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetchEverything(stableParams);
        // Defensive: use [] if res.data is missing
        const mapped = ((res as any).data || []).map(mapNewsArticleToCard);
        if (!cancelled) setState({ data: mapped, loading: false, error: null });
      } catch (e: any) {
        if (!cancelled) setState({ data: null, loading: false, error: e?.message ?? "Failed to fetch news" });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [stableParams]);

  return state;
}



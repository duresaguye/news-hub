-- Create rss_feeds table
CREATE TABLE IF NOT EXISTS public.rss_feeds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  category TEXT,
  region TEXT NOT NULL DEFAULT 'global',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on source and region for faster lookups
CREATE INDEX IF NOT EXISTS idx_rss_feeds_source ON public.rss_feeds(source);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_region ON public.rss_feeds(region);

-- Seed initial data
INSERT INTO public.rss_feeds (name, url, source, category, region) VALUES
-- Local Ethiopian News
('Fana BC', 'https://www.fanabc.com/feed/', 'fanabc', 'Broadcast', 'local'),
('Addis Standard', 'https://addisstandard.com/feed/', 'addis-standard', 'News', 'local'),
('The Reporter Ethiopia', 'https://www.thereporterethiopia.com/feed/', 'reporter-ethiopia', 'News', 'local'),
('Ethiopian Monitor', 'https://ethiopianmonitor.com/feed/', 'ethiopian-monitor', 'News', 'local'),
('ENA', 'https://www.ena.et/feed/', 'ena', 'Official', 'local'),

-- International News
('BBC News', 'https://feeds.bbci.co.uk/news/rss.xml', 'bbc', 'International', 'global'),
('CNN', 'https://rss.cnn.com/rss/edition.rss', 'cnn', 'International', 'global'),
('Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml', 'aljazeera', 'International', 'global'),
('Reuters', 'https://feeds.reuters.com/reuters/topNews', 'reuters', 'Wire Service', 'global'),
('Associated Press', 'https://feeds.apnews.com/apf-topnews', 'ap', 'Wire Service', 'global'),
('Deutsche Welle', 'https://rss.dw.com/rdf/rss-en-all', 'dw', 'International', 'global')
ON CONFLICT (url) DO NOTHING;

-- Update the update_news_cache function to handle feed updates
CREATE OR REPLACE FUNCTION public.update_news_cache(
    p_feed_url TEXT,
    p_source TEXT,
    p_data JSONB,
    p_etag TEXT DEFAULT NULL,
    p_last_modified TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
BEGIN
    -- Update the feed's last updated time
    UPDATE public.rss_feeds 
    SET updated_at = NOW() 
    WHERE url = p_feed_url;
    
    -- Update or insert the cache
    INSERT INTO public.news_cache (
        feed_url,
        source,
        data,
        updated_at,
        etag,
        last_modified
    ) VALUES (
        p_feed_url,
        p_source,
        p_data,
        (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
        p_etag,
        p_last_modified
    )
    ON CONFLICT (feed_url) 
    DO UPDATE SET
        data = EXCLUDED.data,
        source = EXCLUDED.source,
        updated_at = EXCLUDED.updated_at,
        etag = EXCLUDED.etag,
        last_modified = EXCLUDED.last_modified
    RETURNING data;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

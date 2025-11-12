-- Add feed_url and source columns to news_cache
ALTER TABLE public.news_cache
ADD COLUMN IF NOT EXISTS feed_url TEXT,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS etag TEXT,
ADD COLUMN IF NOT EXISTS last_modified TEXT;

-- Create index on feed_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_news_cache_feed_url ON public.news_cache(feed_url);

-- Create index on source for faster lookups
CREATE INDEX IF NOT EXISTS idx_news_cache_source ON public.news_cache(source);

-- Update the get_cached_news function to support feed_url
CREATE OR REPLACE FUNCTION public.get_cached_news(
    p_feed_url TEXT DEFAULT NULL,
    p_source TEXT DEFAULT NULL,
    max_age_seconds INTEGER DEFAULT 1800 -- 30 minutes default
)
RETURNS JSONB AS $$
DECLARE
    cache_record RECORD;
    query TEXT := 'SELECT * FROM public.news_cache WHERE ';
    where_conditions TEXT[] := ARRAY[]::TEXT[];
    params TEXT[] := ARRAY[]::TEXT[];
    param_count INTEGER := 0;
BEGIN
    IF p_feed_url IS NOT NULL THEN
        param_count := param_count + 1;
        where_conditions := array_append(where_conditions, 'feed_url = $' || param_count);
        params := array_append(params, p_feed_url);
    END IF;
    
    IF p_source IS NOT NULL THEN
        param_count := param_count + 1;
        where_conditions := array_append(where_conditions, 'source = $' || param_count);
        params := array_append(params, p_source);
    END IF;
    
    IF array_length(where_conditions, 1) = 0 THEN
        RETURN NULL;
    END IF;
    
    query := query || array_to_string(where_conditions, ' AND ');
    query := query || ' ORDER BY updated_at DESC LIMIT 1';
    
    EXECUTE query USING params[1], params[2] 
    INTO cache_record;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Check if cache is still valid
    IF EXTRACT(EPOCH FROM (NOW() - to_timestamp(cache_record.updated_at/1000))) < max_age_seconds THEN
        RETURN jsonb_build_object(
            'data', cache_record.data,
            'etag', cache_record.etag,
            'last_modified', cache_record.last_modified
        );
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create or replace update_news_cache function
CREATE OR REPLACE FUNCTION public.update_news_cache(
    p_feed_url TEXT,
    p_source TEXT,
    p_data JSONB,
    p_etag TEXT DEFAULT NULL,
    p_last_modified TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
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
        last_modified = EXCLUDED.last_modified;
END;
$$ LANGUAGE plpgsql;

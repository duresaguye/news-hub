-- Create news_cache table
CREATE TABLE IF NOT EXISTS public.news_cache (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at BIGINT NOT NULL
);

-- Create index on updated_at for faster lookups
CREATE INDEX IF NOT EXISTS idx_news_cache_updated_at ON public.news_cache(updated_at);

-- Create a function to get cached news if not expired
CREATE OR REPLACE FUNCTION public.get_cached_news(cache_key INTEGER, max_age_seconds INTEGER)
RETURNS JSONB AS $$
DECLARE
    cache_record RECORD;
BEGIN
    SELECT * INTO cache_record 
    FROM public.news_cache 
    WHERE id = cache_key 
    LIMIT 1;

    IF FOUND AND (EXTRACT(EPOCH FROM NOW()) * 1000 - cache_record.updated_at) < (max_age_seconds * 1000) THEN
        RETURN cache_record.data;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to update the cache
CREATE OR REPLACE FUNCTION public.update_news_cache(cache_key INTEGER, cache_data JSONB)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.news_cache (id, data, updated_at)
    VALUES (cache_key, cache_data, EXTRACT(EPOCH FROM NOW()) * 1000)
    ON CONFLICT (id) 
    DO UPDATE SET 
        data = EXCLUDED.data,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

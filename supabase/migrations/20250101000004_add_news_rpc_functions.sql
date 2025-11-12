-- Create or replace the get_cached_news function
CREATE OR REPLACE FUNCTION public.get_cached_news(
    cache_key TEXT,
    max_age_seconds INTEGER DEFAULT 3600
) RETURNS JSONB AS $$
DECLARE
    cache_record RECORD;
BEGIN
    SELECT * INTO cache_record 
    FROM public.news_cache 
    WHERE id = cache_key::integer
    LIMIT 1;

    IF FOUND AND (EXTRACT(EPOCH FROM NOW()) * 1000 - cache_record.updated_at) < (max_age_seconds * 1000) THEN
        RETURN cache_record.data;
    END IF;
    
    RETURN NULL::JSONB;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the update_news_cache function
CREATE OR REPLACE FUNCTION public.update_news_cache(
    cache_key TEXT,
    cache_data JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.news_cache (id, data, updated_at)
    VALUES (cache_key::integer, cache_data, EXTRACT(EPOCH FROM NOW()) * 1000)
    ON CONFLICT (id) 
    DO UPDATE SET 
        data = EXCLUDED.data,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to handle news caching
CREATE OR REPLACE FUNCTION public.handle_news_cache(
    cache_key TEXT,
    max_age_seconds INTEGER DEFAULT 3600,
    fetch_function TEXT DEFAULT NULL,
    fetch_params JSONB DEFAULT '{}'::JSONB
) RETURNS JSONB AS $$
DECLARE
    cached_data JSONB;
    fresh_data JSONB;
    result JSONB;
    query_text TEXT;
BEGIN
    -- Try to get cached data first
    SELECT public.get_cached_news(cache_key, max_age_seconds) INTO cached_data;
    
    IF cached_data IS NOT NULL THEN
        RETURN jsonb_build_object('status', 'cached', 'data', cached_data);
    END IF;
    
    -- If no valid cache, fetch fresh data
    IF fetch_function IS NOT NULL THEN
        query_text := format('SELECT * FROM %I(%L::JSONB)', fetch_function, fetch_params);
        EXECUTE query_text INTO fresh_data;
        
        -- Update cache
        IF fresh_data IS NOT NULL THEN
            PERFORM public.update_news_cache(cache_key, fresh_data);
            RETURN jsonb_build_object('status', 'fresh', 'data', fresh_data);
        END IF;
    END IF;
    
    -- If we got here, something went wrong
    RETURN jsonb_build_object('status', 'error', 'message', 'Failed to fetch data');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

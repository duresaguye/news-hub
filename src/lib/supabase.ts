
import { createClient } from './supabase-client';

// Define the Supabase client type with RPC method
interface SupabaseClient {
  rpc<T = any, U = any>(
    fn: string, 
    params?: Record<string, any>
  ): Promise<{ data: T | null; error: U | null }>;
  // Add other Supabase client methods as needed
  from: (table: string) => {
    select: (columns?: string) => any;
    insert: (values: any) => any;
    update: (values: any) => any;
    delete: () => any;
    single: () => Promise<{ data: any; error: any }>;
  };
  // Add any other methods you use from the Supabase client
}

// Extract the Supabase URL from the DATABASE_URL
const getSupabaseUrl = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  if (!dbUrl) return '';
  
  try {
    const url = new URL(dbUrl);
    // Convert postgres:// to https:// and remove port if it's the default 5432
    return `https://${url.hostname}`;
  } catch (e) {
    console.error('Error parsing DATABASE_URL:', e);
    return '';
  }
};

const supabaseUrl = getSupabaseUrl();
const supabaseDirectUrl = process.env.DIRECT_URL || '';

// Initialize Supabase client with type assertion
const supabaseClient = createClient(supabaseUrl, supabaseDirectUrl);

// Cast to our SupabaseClient type
export const supabase = supabaseClient as unknown as SupabaseClient;

export const TABLE_NAMES = {
  NEWS_CACHE: 'news_cache',
} as const;

// Simple in-memory cache as a fallback
const memoryCache = {
  data: null as any,
  lastUpdated: 0,
  ttl: 30 * 60 * 1000, // 30 minutes
};

export async function setupNewsCacheTable() {
  try {
    // Skip if we don't have Supabase credentials
    if (!supabaseUrl || !supabaseDirectUrl) {
      console.warn('Skipping news cache table setup - missing Supabase credentials');
      return { error: new Error('Missing Supabase credentials') };
    }
    
    // Only run this on the server side
    if (typeof window !== 'undefined') {
      return { error: new Error('Should only run on server') };
    }
    
    const { error } = await supabase.rpc('create_news_cache_table_if_not_exists');
    if (error) {
      console.error('Error setting up news cache table:', error);
    }
    return { error };
  } catch (error) {
    console.error('Error in setupNewsCacheTable:', error);
    return { error };
  }
}

// Initialize the cache table on server start
if (process.env.NODE_ENV !== 'test') {
  // Only run this on the server side
  if (typeof window === 'undefined') {
    setupNewsCacheTable().catch(console.error);
  }
}

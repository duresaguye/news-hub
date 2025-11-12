// Local Supabase client implementation for server-side operations

/**
 * Create a Supabase client instance
 * @param {string} supabaseUrl - The Supabase project URL (from DATABASE_URL)
 * @param {string} supabaseKey - The Supabase service key (from DIRECT_URL)
 * @returns {Object} A client object with RPC capabilities
 */
export function createClient(supabaseUrl, supabaseKey) {
  // If we don't have the required URLs, return a mock client
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or key not provided, using mock client');
    return {
      rpc: async () => {
        throw new Error('Supabase client not properly configured');
      }
    };
  }

  return {
    /**
     * Call a Supabase RPC function
     * @param {string} fnName - The name of the PostgreSQL function to call
     * @param {Object} params - Parameters to pass to the function
     * @returns {Promise<Object>} The result of the RPC call
     */
    rpc: async (fnName, params = {}) => {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${fnName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify(params)
        });
        
        if (!response.ok) {
          let errorMessage = `Supabase RPC error: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            // Ignore JSON parse errors
          }
          throw new Error(errorMessage);
        }
        
        // Handle empty responses
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      } catch (error) {
        console.error('Supabase RPC error:', error);
        throw error;
      }
    },
    
    // Add other Supabase methods as needed
    from: (tableName) => ({
      select: async (columns = '*') => {
        const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}?select=${columns}`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch from ${tableName}`);
        }
        
        return response.json();
      }
    })
  };
}

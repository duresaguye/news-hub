import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

async function initDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for migrations

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or service role key in environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '../prisma/migrations/20250101000001_add_news_cache_table.sql');
    const sql = readFileSync(migrationPath, 'utf8');

    // Execute the SQL
    const { data, error } = await supabase.rpc('pgmigrate', {
      query: sql,
    });

    if (error) {
      console.error('Error executing migration:', error);
      process.exit(1);
    }

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();

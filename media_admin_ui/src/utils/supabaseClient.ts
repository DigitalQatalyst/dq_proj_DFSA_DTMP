import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
// Try to load from environment variables first, fall back to hardcoded values if needed
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://faqystypjlxqvgkhnbyq.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcXlzdHlwamx4cXZna2huYnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTIxMjIsImV4cCI6MjA3NDg4ODEyMn0.F6oqxmEQOIfWpqX9R3syTn6ysHrtzKuZAwA7K8SErtE';
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
// Log Supabase configuration status on initialization
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  isConfigured: isSupabaseConfigured(),
  usingEnvVars: Boolean(import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY)
});
// Initialize database tables if they don't exist
export const initializeDatabase = async () => {
  try {
    console.log('Checking if media_items table exists...');
    // Check if the media_items table exists by trying to select from it
    const {
      error: checkError
    } = await supabase.from('media_items').select('id').limit(1);
    if (checkError) {
      console.log('Table media_items does not exist or cannot be accessed. Error:', checkError.message);
      console.log('Creating tables...');
      // Try to create tables using SQL directly
      const {
        error: sqlError
      } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS media_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            slug TEXT NOT NULL,
            summary TEXT NOT NULL,
            body TEXT,
            type TEXT NOT NULL,
            status TEXT NOT NULL,
            visibility TEXT NOT NULL,
            language TEXT NOT NULL,
            published_at TIMESTAMP WITH TIME ZONE,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            seo_title TEXT,
            seo_description TEXT,
            canonical_url TEXT
          );
          CREATE TABLE IF NOT EXISTS media_assets (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            media_id UUID NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
            storage_path TEXT NOT NULL,
            public_url TEXT NOT NULL,
            mime TEXT NOT NULL,
            size_bytes INTEGER NOT NULL,
            width INTEGER,
            height INTEGER,
            duration_sec NUMERIC,
            checksum TEXT NOT NULL,
            kind TEXT,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
          );
        `
      });
      if (sqlError) {
        console.error('Failed to create tables directly:', sqlError);
        // If SQL execution fails, try creating tables with individual queries
        console.log('Attempting to create tables individually...');
        const {
          error: createMediaItemsError
        } = await supabase.rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS media_items (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              title TEXT NOT NULL,
              slug TEXT NOT NULL,
              summary TEXT NOT NULL,
              body TEXT,
              type TEXT NOT NULL,
              status TEXT NOT NULL,
              visibility TEXT NOT NULL,
              language TEXT NOT NULL,
              published_at TIMESTAMP WITH TIME ZONE,
              updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
              created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
              seo_title TEXT,
              seo_description TEXT,
              canonical_url TEXT
            );
          `
        });
        if (createMediaItemsError) {
          console.error('Failed to create media_items table:', createMediaItemsError);
        } else {
          console.log('media_items table created successfully');
          // Try to create the assets table after the items table
          const {
            error: createAssetsError
          } = await supabase.rpc('execute_sql', {
            sql_query: `
              CREATE TABLE IF NOT EXISTS media_assets (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                media_id UUID NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
                storage_path TEXT NOT NULL,
                public_url TEXT NOT NULL,
                mime TEXT NOT NULL,
                size_bytes INTEGER NOT NULL,
                width INTEGER,
                height INTEGER,
                duration_sec NUMERIC,
                checksum TEXT NOT NULL,
                kind TEXT,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
              );
            `
          });
          if (createAssetsError) {
            console.error('Failed to create media_assets table:', createAssetsError);
          } else {
            console.log('media_assets table created successfully');
          }
        }
      } else {
        console.log('Tables created successfully');
      }
    } else {
      console.log('Table media_items exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
// Call initialization on import
initializeDatabase().catch(console.error);
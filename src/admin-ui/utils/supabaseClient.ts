import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const rawUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL
const rawKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = typeof rawUrl === 'string' ? rawUrl.trim() : 'https://faqystypjlxqvgkhnbyq.supabase.co'
const SUPABASE_ANON_KEY = typeof rawKey === 'string' ? rawKey.trim() : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcXlzdHlwamx4cXZna2huYnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTIxMjIsImV4cCI6MjA3NDg4ODEyMn0.F6oqxmEQOIfWpqX9R3syTn6ysHrtzKuZAwA7K8SErtE'

let _client: SupabaseClient<Database> | null = null

export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL && /^https?:\/\//i.test(SUPABASE_URL) && SUPABASE_ANON_KEY)

export function getSupabase(): SupabaseClient<Database> {
  if (_client) return _client
  if (!isSupabaseConfigured()) {
    const msg = `Supabase not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (current url: "${SUPABASE_URL || 'undefined'}"). Restart the dev server after changes.`
    throw new Error(msg)
  }
  _client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  return _client
}

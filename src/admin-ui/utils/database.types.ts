export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      media_items: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string
          body: string
          body_html: string | null
          body_json: Json | null
          type: string
          category: string | null
          status: string
          visibility: string
          language: string
          published_at: string | null
          updated_at: string
          created_at: string
          seo_title: string | null
          seo_description: string | null
          canonical_url: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary: string
          body?: string
          body_html?: string | null
          body_json?: Json | null
          type: string
          category?: string | null
          status: string
          visibility: string
          language: string
          published_at?: string | null
          updated_at?: string
          created_at?: string
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          tags?: string[]
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string
          body?: string
          body_html?: string | null
          body_json?: Json | null
          type?: string
          category?: string | null
          status?: string
          visibility?: string
          language?: string
          published_at?: string | null
          updated_at?: string
          created_at?: string
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          tags?: string[]
        }
      }
    }
  }
}


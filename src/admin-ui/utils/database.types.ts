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
          thumbnail_url: string | null
          video_url: string | null
          podcast_url: string | null
          document_url: string | null
          duration_sec: number | null
          file_size_bytes: number | null
          event_date: string | null
          event_time: string | null
          event_location: string | null
          event_location_details: string | null
          event_registration_info: string | null
          event_agenda: Json | null
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
          tags?: string[] | null
          thumbnail_url?: string | null
          video_url?: string | null
          podcast_url?: string | null
          document_url?: string | null
          duration_sec?: number | null
          file_size_bytes?: number | null
          event_date?: string | null
          event_time?: string | null
          event_location?: string | null
          event_location_details?: string | null
          event_registration_info?: string | null
          event_agenda?: Json | null
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
          tags?: string[] | null
          thumbnail_url?: string | null
          video_url?: string | null
          podcast_url?: string | null
          document_url?: string | null
          duration_sec?: number | null
          file_size_bytes?: number | null
          event_date?: string | null
          event_time?: string | null
          event_location?: string | null
          event_location_details?: string | null
          event_registration_info?: string | null
          event_agenda?: Json | null
        }
        Relationships: []
      }
      ,
      media_assets: {
        Row: {
          id: string
          media_id: string
          kind: 'Image' | 'Video' | 'Audio' | 'Doc' | string | null
          public_url: string
          storage_path: string
          mime: string | null
          size_bytes: number | null
          duration_sec: number | null
          checksum: string | null
          created_at: string
        }
        Insert: {
          id?: string
          media_id: string
          kind?: 'Image' | 'Video' | 'Audio' | 'Doc' | string | null
          public_url: string
          storage_path: string
          mime?: string | null
          size_bytes?: number | null
          duration_sec?: number | null
          checksum?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          media_id?: string
          kind?: 'Image' | 'Video' | 'Audio' | 'Doc' | string | null
          public_url?: string
          storage_path?: string
          mime?: string | null
          size_bytes?: number | null
          duration_sec?: number | null
          checksum?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

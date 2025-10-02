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
          type: string
          status: string
          visibility: string
          language: string
          published_at: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary: string
          body?: string
          type: string
          status: string
          visibility: string
          language: string
          published_at?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string
          body?: string
          type?: string
          status?: string
          visibility?: string
          language?: string
          published_at?: string | null
          updated_at?: string
          created_at?: string
        }
      }
    }
  }
}


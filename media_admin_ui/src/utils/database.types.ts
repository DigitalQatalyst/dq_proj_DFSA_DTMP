export type Json = string | number | boolean | null | {
  [key: string]: Json | undefined;
} | Json[];
export interface Database {
  public: {
    Tables: {
      media_items: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string;
          body: string;
          type: string;
          status: string;
          visibility: string;
          language: string;
          published_at: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary: string;
          body?: string;
          type: string;
          status: string;
          visibility: string;
          language: string;
          published_at?: string | null;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          body?: string;
          type?: string;
          status?: string;
          visibility?: string;
          language?: string;
          published_at?: string | null;
          updated_at?: string;
          created_at?: string;
        };
      };
      media_assets: {
        Row: {
          id: string;
          media_id: string;
          storage_path: string;
          public_url: string;
          mime: string;
          size_bytes: number;
          width: number | null;
          height: number | null;
          duration_sec: number | null;
          checksum: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          media_id: string;
          storage_path: string;
          public_url: string;
          mime: string;
          size_bytes: number;
          width?: number | null;
          height?: number | null;
          duration_sec?: number | null;
          checksum: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          media_id?: string;
          storage_path?: string;
          public_url?: string;
          mime?: string;
          size_bytes?: number;
          width?: number | null;
          height?: number | null;
          duration_sec?: number | null;
          checksum?: string;
          created_at?: string;
        };
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
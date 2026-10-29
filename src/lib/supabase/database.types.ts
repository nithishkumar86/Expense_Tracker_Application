/**
 * Hand-written to match the shape `supabase gen types` would produce for
 * `supabase/migrations/0001_profiles.sql`. The Supabase MCP and CLI are not
 * linked on this account, so types can't be generated automatically.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

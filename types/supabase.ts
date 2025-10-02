// This file contains the TypeScript types for your Supabase database.
// You can generate these types using the Supabase CLI.
// Run: npx supabase gen types typescript --project-id your-project-ref > types/supabase.ts

type JsonValue = string | number | boolean | null | undefined | JsonObject | JsonArray
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]

export type Json = JsonValue | JsonObject | JsonArray

export interface Database {
  public: {
    Tables: {
      // Define your database tables here
      // Example:
      // profiles: {
      //   Row: { id: string; created_at: string; updated_at: string; username: string }
      //   Insert: { id?: string; created_at?: string; updated_at?: string; username: string }
      //   Update: { id?: string; created_at?: string; updated_at?: string; username?: string }
      // }
    } & Record<string, unknown>
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
    CompositeTypes: Record<string, unknown>
  }
}

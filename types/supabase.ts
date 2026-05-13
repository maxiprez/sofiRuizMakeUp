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
      availability: {
        Row: {
          id: string
          day_of_week: number
          enabled: boolean
          start_time: string
          end_time: string
          break_start: string | null
          break_end: string | null
        }
        Insert: {
          id?: string
          day_of_week: number
          enabled?: boolean
          start_time: string
          end_time: string
          break_start?: string | null
          break_end?: string | null
        }
        Update: {
          id?: string
          day_of_week?: number
          enabled?: boolean
          start_time?: string
          end_time?: string
          break_start?: string | null
          break_end?: string | null
        }
      }
    } & Record<string, unknown>
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
    CompositeTypes: Record<string, unknown>
  }
}

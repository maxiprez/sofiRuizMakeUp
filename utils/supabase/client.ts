import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('La variable de entorno NEXT_PUBLIC_SUPABASE_URL no está definida.');
}

if (!supabaseAnonKey) {
  throw new Error('La variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
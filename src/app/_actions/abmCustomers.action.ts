"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface Customer {
  id: string;
  name: string;
  tel: string;
  email?: string;
  is_verified?: boolean;
  role?: string;
}

export async function getCustomers(q?: string) {
  let query = supabase
    .from("users")
    .select("*")
    .eq("role", "user");

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,email.ilike.%${q}%,tel.ilike.%${q}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al buscar clientes:", error);
    return { error: "Error al buscar clientes." };
  }

  return { data };
}


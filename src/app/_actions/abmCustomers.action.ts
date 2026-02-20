"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface Customers {
  data: Customer[];
  count: number;
}
interface Customer {
  id: string;
  name: string;
  tel: string;
  email?: string;
  is_verified?: boolean;
  role?: string;
}

export async function getCustomers(q?: string, page: number = 1, pageSize: number = 8) {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("users")
      .select("*", { count: 'exact' })
      .eq("role", "user");

    if (q && q.trim() !== "") {
      const searchStr = `%${q.trim()}%`;
      query = query.or(`name.ilike.${searchStr},email.ilike.${searchStr},tel.ilike.${searchStr}`);
    }

    const { data, error, count } = await query
      .order('name', { ascending: true })
      .range(from, to);

    if (error) {
      console.error("Supabase Error:", error.message, error.details);
      return { error: error.message, data: [], count: 0 };
    }

    return { 
      data: (data as Customer[]) || [], 
      count: count || 0 
    };
   
  } catch (err) {
    console.error("Critical Error:", err);
    return { error: "Error interno del servidor", data: [], count: 0 };
  }
}


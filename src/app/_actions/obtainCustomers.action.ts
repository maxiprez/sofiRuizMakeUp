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
    let query = supabase
      .from("users")
      .select("*", { count: 'exact' })
      .eq("role", "user");

    let allDataQuery = supabase
      .from("users")
      .select("*")
      .eq("role", "user");

    if (q && q.trim() !== "") {
      const searchStr = `%${q.trim()}%`;
      query = query.or(`name.ilike.${searchStr},email.ilike.${searchStr},tel.ilike.${searchStr}`);
      allDataQuery = allDataQuery.or(`name.ilike.${searchStr},email.ilike.${searchStr},tel.ilike.${searchStr}`);
    }

    const { data: allData, error: allDataError } = await allDataQuery.order('name', { ascending: true });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query
      .order('name', { ascending: true })
      .range(from, to);

    if (error || allDataError) {
      console.error("Supabase Error:", error?.message || allDataError?.message);
      return { error: error?.message || "Error obteniendo datos", data: [], count: 0, allData: [] };
    }

    return { 
      data: (data as Customer[]) || [], 
      count: count || 0,
      allData: (allData as Customer[]) || []
    };
   
  } catch (err) {
    console.error("Critical Error:", err);
    return { error: "Error interno del servidor", data: [], count: 0, allData: [] };
  }
}


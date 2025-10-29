"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function searchDates() {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("bookings")
    .select(`*, users:users(*), services:services(*)`)
    .gte("date", todayISO)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    console.error("Error al buscar citas:", error);
    return { error: "Error al buscar citas." };
  }

  return { data };
}

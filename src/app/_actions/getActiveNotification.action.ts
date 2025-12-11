"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface Notification {
  id: string;
  title: string;
  message: string;
  start_date: string;
  end_date?: string | null;
}

export async function getActiveNotification(): Promise<Notification | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("site_notifications")
    .select("*")
    .eq("is_active", true)
    .lte("start_date", now)
    .or(
      `end_date.is.null,end_date.gt.${now}`
    )
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching popup notification:", error);
    return null;
  }

  return data ?? null;
}
"use server";

import { createClient } from "@supabase/supabase-js";
import { Trend } from "types/entities";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function getTrend(today: number, yesterday: number): Trend {
  if (today > yesterday) return "up";
  if (today < yesterday) return "down";
  return "same";
}

export async function getDailyCancelledBookingsComparison() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(now);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const yesterdayEnd = new Date(todayStart);
  yesterdayEnd.setMilliseconds(-1);

  const [todayRes, yesterdayRes] = await Promise.all([
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", false)
      .gte("date", todayStart.toISOString())
      .lte("date", todayEnd.toISOString()),

    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", false)
      .gte("date", yesterdayStart.toISOString())
      .lte("date", yesterdayEnd.toISOString()),
  ]);

  const today = todayRes.count ?? 0;
  const yesterday = yesterdayRes.count ?? 0;
  const difference = today - yesterday;

  return {
    today,
    yesterday,
    difference,
    trend: getTrend(today, yesterday),
  };
}

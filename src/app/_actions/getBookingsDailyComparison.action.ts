"use server";

import { createClient } from "@supabase/supabase-js";
import { Trend } from "types/entities";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function getDailyBookingsComparison() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const format = (d: Date) => d.toISOString().split("T")[0];

  const todayStr = format(today);
  const yesterdayStr = format(yesterday);

  const { data, error } = await supabase
    .from("bookings")
    .select("date")
    .in("date", [todayStr, yesterdayStr]);

  if (error || !data) {
    return {
      today: 0,
      yesterday: 0,
      difference: 0,
      trend: "same" as Trend,
    };
  }

  const todayCount = data.filter(b => b.date === todayStr).length;
  const yesterdayCount = data.filter(b => b.date === yesterdayStr).length;
  const difference = todayCount - yesterdayCount;
  const trend: Trend = difference > 0 ? "up" : difference < 0 ? "down" : "same";

  return {
    today: todayCount,
    yesterday: yesterdayCount,
    difference,
    trend,
  };
}

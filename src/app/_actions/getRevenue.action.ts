"use server";

import { createClient } from "@supabase/supabase-js";
import { Trend } from "types/entities";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export interface MonthlyRevenueResult {
  currentTotal: string;
  previousTotal: string;
  percentageChange: number;
  trend: Trend;
}

async function getRevenueByRange(start: Date, end: Date): Promise<number> {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      services:service_id (
        price
      )
    `)
    .eq("status", true)
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (error || !data) return 0;

  return data.reduce((sum, b) => {
    const service = Array.isArray(b.services) ? b.services[0] : b.services;
    return sum + (service?.price ?? 0);
  }, 0);
}

export async function getMonthlyRevenueComparison(): Promise<MonthlyRevenueResult> {
  "use server";

  const now = new Date();

  const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const currentTotal = await getRevenueByRange(currentStart, currentEnd);
  const previousTotal = await getRevenueByRange(previousStart, previousEnd);

  let percentageChange = 0;

  if (previousTotal === 0 && currentTotal > 0) {
    percentageChange = 100;
  } else if (previousTotal > 0) {
    percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
  }

  const formatARS = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
  }).format(value);

  return {
    currentTotal: formatARS(currentTotal),
    previousTotal: formatARS(previousTotal),
    percentageChange: Number(percentageChange.toFixed(2)),
    trend: percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "same"
  };
}

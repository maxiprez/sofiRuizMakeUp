"use server";

import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    const { data, error } = await supabase
      .from("bookings")
      .select("date")
      .in("date", [yesterdayStr, todayStr])
      .order("date", { ascending: true });

    if (error) {
      console.error("[BOOKINGS] Error en consulta:", error.message);
      return res.status(500).json({ error: error.message });
    }

    const grouped = {
      yesterday: data.filter((b) => b.date === yesterdayStr).length,
      today: data.filter((b) => b.date === todayStr).length,
    };
    res.status(200).json(grouped);
  } catch (error) {
    console.error("[BOOKINGS] Error general:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
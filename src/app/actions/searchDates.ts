"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const today = new Date();
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

export async function searchDates() {
    const { data, error } = await supabase
    .from('bookings')
    .select(`*, users:users(*), services:services(*)`)
    .gte('date', tomorrow.toISOString())
    .order('date', { ascending: true });

    if(error){
        console.error("Error al buscar citas:", error);
        return { error: "Error al buscar citas." };
    }
    return { data };
}
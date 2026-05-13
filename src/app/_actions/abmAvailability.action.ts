"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface Availability {
    id: string;
    day_of_week: number;
    enabled: boolean;
    start_time: string;
    end_time: string;
    break_start: string | null;
    break_end: string | null;
}

export type AvailabilityInput = Omit<Availability, 'id'> & { id?: string };

export async function getAvailability() {
    const { data, error } = await supabase
    .from('availability')
    .select('*')
    .order('day_of_week', { ascending: true })

    if(error){
        console.error("Error al obtener disponibilidad:", error);
        return { error: "Error al obtener disponibilidad." };
    }

    return { data };
}

export async function updateAvailability(entries: AvailabilityInput[]) {
    const { data, error } = await supabase
    .from('availability')
    .upsert(entries, { onConflict: 'day_of_week' })
    .select()
    .order('day_of_week', { ascending: true })

    if(error){
        console.error("Error al actualizar disponibilidad:", error);
        return { error: "Error al actualizar disponibilidad." };
    }

    return { data };
}

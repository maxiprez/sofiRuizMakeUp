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

    if (!data || data.length === 0) {
        const defaultAvailability = [
            { day_of_week: 0, enabled: false, start_time: '09:00', end_time: '18:00', break_start: null, break_end: null }, // Domingo
            { day_of_week: 1, enabled: true, start_time: '09:00', end_time: '18:00', break_start: '13:00', break_end: '14:00' },  // Lunes
            { day_of_week: 2, enabled: true, start_time: '09:00', end_time: '20:00', break_start: '13:00', break_end: '14:00' },  // Martes
            { day_of_week: 3, enabled: true, start_time: '09:00', end_time: '18:00', break_start: '13:00', break_end: '14:00' },  // Miércoles
            { day_of_week: 4, enabled: true, start_time: '09:00', end_time: '18:00', break_start: '13:00', break_end: '14:00' },  // Jueves
            { day_of_week: 5, enabled: true, start_time: '09:00', end_time: '18:00', break_start: '13:00', break_end: '14:00' },  // Viernes
            { day_of_week: 6, enabled: false, start_time: '09:00', end_time: '18:00', break_start: null, break_end: null }, // Sábado
        ];

        const { data: insertedData, error: insertError } = await supabase
            .from('availability')
            .insert(defaultAvailability)
            .select('*')
            .order('day_of_week', { ascending: true });

        if (insertError) {
            console.error("Error al crear disponibilidad por defecto:", insertError);
            return { error: "Error al crear disponibilidad por defecto." };
        }

        return { data: insertedData };
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

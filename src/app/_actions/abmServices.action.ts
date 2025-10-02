"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface Service {
    id: string;
    name: string;
    price: number;
    duration?: number;
    status?: boolean;
}

type ServiceResponse = {
    data?: Service;
    error?: string;
}

export async function getServices() {
    const { data, error } = await supabase
    .from('services')
    .select('*')

    if(error){
        console.error("Error al buscar servicios:", error);
        return { error: "Error al buscar servicios." };
    }

    return { data };
}

export async function createService(service: Omit<Service, 'id'>): Promise<ServiceResponse> {
    const { data, error } = await supabase
    .from('services')
    .insert([service])

    if(error){
        console.error("Error al crear servicio:", error);
        return { error: "Error al crear servicio." };
    }

    return { data: data?.[0] };
}

export async function pauseService(id: string): Promise<ServiceResponse> {
    const { data, error } = await supabase
    .from('services')
    .update({ status: false })
    .eq('id', id)

    if(error){
        console.error("Error al pausar servicio:", error);
        return { error: "Error al pausar servicio." };
    }

    return { data: data?.[0] };
}

export async function resumeService(id: string): Promise<ServiceResponse> {
    const { data, error } = await supabase
    .from('services')
    .update({ status: true })
    .eq('id', id)

    if(error){
        console.error("Error al reanudar servicio:", error);
        return { error: "Error al reanudar servicio." };
    }

    return { data: data?.[0] };
}

export async function editPriceDurationService(id: string, price: number, duration: number): Promise<ServiceResponse> {
    const { data, error } = await supabase
    .from('services')
    .update({ price, duration })
    .eq('id', id)

    if(error){
        console.error("Error al editar precio:", error);
        return { error: "Error al editar precio." };
    }

    return { data: data?.[0] };
}


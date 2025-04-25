"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BookingData {
  service: string;
  date: string;
  time: string;
}

export async function createBooking(bookingData: BookingData) {
  const session = await auth();
  const userId = session?.user?.id;

  if(!userId){
    return {error: "No se ha encontrado un usuario autenticado."};
  }

  const {service, date, time} = bookingData;

  try {
    const {data, error: insertError} = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      service,
      date,
      time
    })
    .select();

  if(insertError){
    console.error("Error al crear la cita:", insertError);
    return {error: "Ocurrió un error al crear la cita."};
  }

    revalidatePath("/bookings");
    console.log("Cita creada exitosamente.");
    return {success: true, data};
  } catch (error){
    console.error("Error inesperado durante al crear la reserva: ", error);
    return { error: "Ocurrió un error inesperado." };
  }
}
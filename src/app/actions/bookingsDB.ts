"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import ConfirmationEmail from "@/app/components/emails/ConfirmationEmail";
 
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
  const userMail = session?.user?.email;
  const userFullName = session?.user?.name;


  if(!userId || !userMail){
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
      time,
      status: true
    })
    .select()
    .single();

  if(insertError){
    console.error("Error al crear la cita:", insertError);
    return {error: "Ocurrió un error al crear la cita."};
  }

  const subject = "Confirmación de turno";

  const dateEmail = new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const htmlContent = ConfirmationEmail({ userFullName, service, date: dateEmail, time });

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toEmail: userMail,
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      console.error('Error al enviar el correo de confirmación');
      return { success: false, error: 'Error al enviar el correo de confirmación' };
    } else {
      console.log('Email enviado con éxito');
    }

    revalidatePath("/");
    console.log("Cita creada exitosamente.");
    return { success: true, data };
  } catch (error) {
    console.error("Error inesperado durante al crear la reserva: ", error);
    return { error: "Ocurrió un error inesperado." };
  }
}
"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "auth";
import { revalidatePath } from "next/cache";
import { NEXTAUTH_URL } from "@/utils/urls";
import { ConfirmationEmail } from "@/app/components/emails/ConfirmationEmail";
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
interface BookingData {
  service_id: string;
  date: string;
  time: string;
  user_id?: string;
}

export async function createBooking(bookingData: BookingData) {
  const session = await auth();
  const targetUserId = bookingData.user_id || session?.user?.id;
  const userMail = bookingData.user_id ? null : session?.user?.email;
  const userFullName = bookingData.user_id ? null : session?.user?.name;
  const userTel = bookingData.user_id ? null : session?.user?.tel;

  if(!session || !targetUserId) {
    return {error: "Error de autenticación al crear la cita.", success: false, login: false};
  }

  if(!bookingData.user_id && !userTel) {
    return {error: "Tenés que completar tu número de teléfono para crear una cita.", success: false, tel: false};
  }

  const {service_id, date, time} = bookingData;

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, name, duration, price")
    .eq("id", service_id)
    .single();

  if (serviceError) {
    console.error("Error al obtener el servicio:", serviceError);
    return { error: "Error al obtener el servicio." };
  }

  try {
    const { data: existingBooking, error: existingBookingError } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("user_id", targetUserId)
      .eq("date", date);

    if (existingBookingError) {
        console.error("Error al verificar reservas existentes:", existingBookingError);
        return { error: "Error al verificar reservas existentes.", success: false };
    }

    if (existingBooking && existingBooking.length > 0 && existingBooking[0].status) {
        return { error: "Ya tienes una reserva para este día.", success: false };
    }
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: targetUserId,
          date,
          time,
          service_id,
          status: true,
          google_event_id: ""
        }
      ])
      .select(`*, services(*)`)
      .single();


    if(error){
      console.error("Error al crear la cita:", error);
      return {error: "Ocurrió un error al crear la cita."};
    }

    let targetUserEmail = userMail;
    let targetUserName = userFullName;
    
    if (bookingData.user_id && !userMail) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', targetUserId)
        .single();
      
      if (userError) {
        console.error('Error al obtener el email del usuario:', userError);
      } else if (userData) {
        targetUserEmail = userData.email;
        targetUserName = userData.name || targetUserName;
      }
    }

    if (targetUserEmail) {
      const subject = "Confirmación de turno";
      const formatter = new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires',
      });

      const dateEmail = formatter.format(new Date(`${date}T${time}:00-03:00`));

      const htmlContent = ConfirmationEmail({
        userFullName: targetUserName,
        serviceName: service.name,
        date: dateEmail,
        time,
      });

      const response = await fetch(`${NEXTAUTH_URL}/api/sendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: targetUserEmail,
          subject,
          htmlContent,
        }),
      });

      if (!response.ok) {
        console.error('Error al enviar el correo de confirmación');
      }
    }
    const startDateTime = new Date(`${date}T${time}:00-03:00`);
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000);
    const calendarEvent = {
      summary: `Turno: ${service.name}`,
      description: `Turno reservado para ${userFullName}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires',
      },
    };

    const calendarResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/createCalendarEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(calendarEvent),
    });

    if (!calendarResponse.ok) {
      console.error('Error al crear el evento en Google Calendar');
      return { success: false, error: 'Error al crear el evento en Google Calendar' };
    }

    const calendarData = await calendarResponse.json();
    const eventId = calendarData?.event?.id;

    if (eventId && data?.id) {
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ google_event_id: eventId })
        .eq("id", data.id);

      if (updateError) {
        console.error("Error al guardar el eventId en la base de datos:", updateError);
        return { success: false, error: "Error al guardar el ID del evento en la base de datos" };
      }
    }

    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    console.error("Error inesperado durante al crear la reserva: ", error);
    return { error: "Ocurrió un error inesperado." };
  }
}
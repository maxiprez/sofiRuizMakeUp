"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import ConfirmationEmail from "@/app/components/emails/ConfirmationEmail";
// import deleteEvent from "../../../pages/api/deleteCalendarEvent";
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BookingData {
  service_id: string;
  date: string;
  time: string;
}

export async function createBooking(bookingData: BookingData) {
  const session = await auth();
  const userId = session?.user?.id;
  const userMail = session?.user?.email;
  const userFullName = session?.user?.name;
  const userTel = session?.user?.tel;

  if(!session || !userId || !userMail){
    return {error: "Tenés que iniciar sesión para crear una cita.", success: false, login: false};
  }

  if(!userTel){
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
      .eq("user_id", userId)
      .eq("date", date);

    if (existingBookingError) {
        console.error("Error al verificar reservas existentes:", existingBookingError);
        return { error: "Error al verificar reservas existentes.", success: false };
    }

    if (existingBooking && existingBooking.length > 0 && existingBooking[0].status) {
        return { error: "Ya tienes una reserva para este día.", success: false };
    }
    const {data, error: insertError} = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      date,
      time,
      service_id,
      status: true,
      google_event_id: ""
    })
    .select(`*, services(*)`)
    .single();


    if(insertError){
      console.error("Error al crear la cita:", insertError);
      return {error: "Ocurrió un error al crear la cita."};
    }

    const subject = "Confirmación de turno";
    const formatter = new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires',
    });
    const dateEmail = formatter.format(new Date(`${date}T${time}:00-03:00`));
    const htmlContent = ConfirmationEmail({ userFullName, serviceName: service.name, date: dateEmail, time });

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


    const startDateTime = new Date(`${date}T${time}:00-03:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60000); // 1 hora después
    const calendarEvent = {
      summary: `Turno: ${service_id}`,
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
    console.log("Cita creada exitosamente.");
    return { success: true, data };
  } catch (error) {
    console.error("Error inesperado durante al crear la reserva: ", error);
    return { error: "Ocurrió un error inesperado." };
  }
}
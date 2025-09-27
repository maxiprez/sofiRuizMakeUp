//@ts-expect-error no es un error
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

//@ts-expect-error no es un error
const SUPABASE_URL = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!;
//@ts-expect-error no es un error
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_KEY")!;
//@ts-expect-error no es un error
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);  
  
// Función que construye el HTML del email (similar al que ya tenés)
function generateReminderEmail(userName: string, serviceName: string, date: string, time: string) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><title>Recordatorio de Turno</title></head>
    <body>
      <h1>Hola ${userName}!</h1>
      <p>Te recordamos que tenés un turno programado para mañana:</p>
      <ul>
        <li>Servicio: ${serviceName}</li>
        <li>Día: ${date}</li>
        <li>Hora: ${time}hs</li>
      </ul>
      <p>¡Nos vemos pronto!</p>
    </body>
    </html>
  `;
}

// Función principal
serve(async (req: Request) => {
  // Validación del header Authorization
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${SUPABASE_SERVICE_KEY}`) {
    return new Response(JSON.stringify({ code: 401, message: "Missing authorization header" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Obtenemos reservas para mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id,
        date,
        time,
        status,
        users!inner(id, email, name),
        services!inner(name)
      `)
      .eq("date", dateStr)
      .eq("status", true);

    if (error) throw error;

    // Enviar email a cada reserva
    for (const booking of bookings) {
      const emailHtml = generateReminderEmail(
        booking.users[0].name,
        booking.services[0].name,
        booking.date,
        booking.time
      );

      // Llamada a Brevo
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: "Sofi Ruiz Makeup", email: "sofiadalilaruiz@gmail.com" },
          to: [{ email: booking.users[0].email, name: booking.users[0].name }],
          subject: "Recordatorio de tu turno de mañana",
          htmlContent: emailHtml,
        }),
      });
    }

    return new Response(JSON.stringify({ success: true, sent: bookings.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

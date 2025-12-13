import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { createClient } from '@supabase/supabase-js';
import { deleteEvent } from '../../../../../../pages/api/calendarUtils';
import { CancelationEmail } from '@/app/components/emails/CancelationEmail';
import { resend } from '@/lib/resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  const session = await auth();
  const userRole = session?.user?.role;

  if (!session || userRole !== 'admin') {
    return new NextResponse(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return new NextResponse(
        JSON.stringify({ error: 'ID de reserva inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, users:users(*), services:services(*)')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return new NextResponse(
        JSON.stringify({ error: 'No se encontró la reserva' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (booking.google_event_id) {
      try {
        await deleteEvent(booking.google_event_id);
      } catch (error) {
        console.error('Error al borrar el evento de Google Calendar:', error);
      }
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: false })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error al cancelar la reserva:', updateError);
      return new NextResponse(
        JSON.stringify({ error: 'Error al cancelar la reserva' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const recipientEmail = booking.users?.email ?? process.env.EMAIL_FALLBACK ?? process.env.EMAIL_SENDER;
      if (recipientEmail) {
        const recipientName = booking.users?.name ?? 'Cliente';
        const formattedDate = new Date(`${booking.date}T${booking.time}`).toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).replace(/\//g, '-');
        const formattedTime = booking.time?.slice(0, 5) ?? '--:--';

        const htmlContent = CancelationEmail({
          userFullName: recipientName,
          service: booking.services?.name ?? booking.service ?? 'Servicio',
          date: formattedDate,
          time: formattedTime
        });

        await resend.emails.send({
          from: `Sofi Ruiz <${process.env.EMAIL_SENDER!}>`,
          to: [recipientEmail],
          cc: process.env.EMAIL_CC ? [process.env.EMAIL_CC] : [],
          subject: 'Cancelación de turno',
          html: htmlContent,
        });
      }
    } catch (emailError) {
      console.error('Error al enviar el correo de cancelación (admin):', emailError);
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error inesperado al cancelar la reserva:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error inesperado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

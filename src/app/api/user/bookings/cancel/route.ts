import { createClient } from '@supabase/supabase-js';
import { auth } from 'auth';
import { NextResponse } from 'next/server';
import { deleteEvent } from 'pages/api/calendarUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
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

    // Obtener reserva
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !booking) {
      return new NextResponse(
        JSON.stringify({ error: 'No se encontró la reserva' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Eliminar evento Google si tiene
    if (booking.google_event_id) {
      try {
        await deleteEvent(booking.google_event_id);
      } catch (error) {
        console.error('Error al borrar el evento de Google Calendar:', error);
        // Decide si quieres bloquear o no la cancelación aquí
      }
    }

    // Marcar reserva como cancelada
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: false })
      .eq('id', bookingId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error al cancelar la reserva:', updateError);
      return new NextResponse(
        JSON.stringify({ error: 'Error al cancelar la reserva' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error inesperado al cancelar la reserva:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error inesperado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
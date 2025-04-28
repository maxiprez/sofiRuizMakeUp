import { createClient } from '@supabase/supabase-js';
import { auth } from '../../../../../../auth';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return new NextResponse(JSON.stringify({ error: 'ID de reserva inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: false })
        .eq('id', bookingId)
        .eq('user_id', userId);

    if (updateError) {
      console.error('Error al cancelar la reserva:', updateError);
      return new NextResponse(JSON.stringify({ error: 'Error al cancelar la reserva' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!updateError) {
      return new NextResponse(null, { status: 204 });
    } else {
      return new NextResponse(JSON.stringify({ error: 'No se encontró la reserva para cancelar' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error inesperado al cancelar la reserva:', error);
    return new NextResponse(JSON.stringify({ error: 'Error inesperado' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
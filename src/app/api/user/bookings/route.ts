import { createClient } from '@supabase/supabase-js';
import { auth } from 'auth';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`*, services(*)`)
      .eq('user_id', userId)
      .eq('status', true)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error al obtener los turnos del usuario:', error);
      return new NextResponse(JSON.stringify({ error: 'Error al obtener los turnos' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error inesperado al obtener los turnos:', error);
    return new NextResponse(JSON.stringify({ error: 'Error inesperado' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
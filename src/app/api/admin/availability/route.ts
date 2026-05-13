import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  const session = await auth();
  const userRole = session?.user?.role;

  if (!session || userRole !== 'admin') {
    return new NextResponse(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (error) {
      console.error('Error al obtener disponibilidad:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Error al obtener disponibilidad' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error inesperado:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error inesperado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  const userRole = session?.user?.role;

  if (!session || userRole !== 'admin') {
    return new NextResponse(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const entries = Array.isArray(body) ? body : [body];

    const { data, error } = await supabase
      .from('availability')
      .upsert(entries, { onConflict: 'day_of_week' })
      .select()
      .order('day_of_week', { ascending: true });

    if (error) {
      console.error('Error al actualizar disponibilidad:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Error al actualizar disponibilidad' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error inesperado:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error inesperado' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('turnos')
    .update({
      status_new: 'confirmed',
    })
    .eq('confirmation_token', token)
    .eq('status_new', 'pending')
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Error al confirmar' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ status: 'already_confirmed' })
  }

  return NextResponse.json({ status: 'confirmed' })
}
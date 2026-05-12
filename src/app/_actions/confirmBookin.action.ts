'use server'

import { createClient } from '@supabase/supabase-js'

export async function confirmBooking(token: string) {
  if (!token) {
    return { status: 'error' }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('bookings')
    
    .update({ 
      status_new: 'confirmed',
      confirmation_token: null
    })
    .eq('confirmation_token', token)
    .eq('status_new', 'pending')
    .select()
    .single()

  if (error) {
    return { status: 'error' }
  }

  if (!data) {
    return { status: 'already_confirmed' }
  }

  return { status: 'confirmed', turno: data }
}
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { RememberEmail } from '@/app/components/emails/RememberEmail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const next24hUTC = new Date(nowUTC.getTime() + 24 * 60 * 60 * 1000);
    
    const nowISODate = nowUTC.toISOString().slice(0, 10);
    const nextISODate = next24hUTC.toISOString().slice(0, 10);

    const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, user_id, service_id, date, time')
    .eq('status', true)
    .gte('date', nowISODate)
    .lte('date', nextISODate);

    if (bookingsError) throw bookingsError;
    
    const finalBookings = bookings.filter(b => {
        const [year, month, day] = b.date.split('-').map(Number);
        const [hour, minute, second] = b.time.split(':').map(Number);
        const bookingDateTimeUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
        
        return bookingDateTimeUTC >= nowUTC && bookingDateTimeUTC <= next24hUTC;
    });

    if (!finalBookings || finalBookings.length === 0) {
      return NextResponse.json({ success: true, message: 'No hay turnos próximos.' });
    }

    const userIds = finalBookings.map(b => b.user_id);
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', userIds);

    if (usersError) throw usersError;

    const serviceIds = finalBookings.map(b => b.service_id);
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, name')
      .in('id', serviceIds);

    if (servicesError) throw servicesError;

    const userMap = Object.fromEntries(users.map(u => [u.id, { name: u.name, email: u.email }]));
    const serviceMap = Object.fromEntries(services.map(s => [s.id, s.name]));

    let sentEmails = 0;
    for (const booking of finalBookings) {
      const user = userMap[booking.user_id];
      const serviceName = serviceMap[booking.service_id];
      if (!user?.email) continue;

      const [year, month, day] = booking.date.split('-');
      const [hour, minute] = booking.time.split(':');
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = `${hour}:${minute}`;

      await resend.emails.send({
        from: 'no-reply@sofiruiz.com.ar',
        to: user.email,
        cc: process.env.EMAIL_CC ? [process.env.EMAIL_CC!] : [],
        subject: 'Recordatorio de tu turno',
        html: RememberEmail({
          userFullName: user.name,
          serviceName,
          date: formattedDate,
          time: formattedTime,
        }),
      });

      sentEmails++;
    }

    return NextResponse.json({ success: true, sentEmails });
  } catch (error) {
    console.error('Error enviando recordatorios:', error);
    return NextResponse.json(
      { error: 'No se pudieron enviar los recordatorios' },
      { status: 500 }
    );
  }
}
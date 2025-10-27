import { NextApiRequest, NextApiResponse } from 'next';
import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { date: queryDate, duration } = req.query;
  const durationInMinutes = Number(duration);

  let date = '';
  if (typeof queryDate === 'string' && queryDate.trim() !== '') {
    date = queryDate.trim();
  } else if (Array.isArray(queryDate) && queryDate.length > 0 && queryDate[0].trim() !== '') {
    date = queryDate[0].trim();
  } else {
    return res.status(400).json({ error: 'La fecha es requerida.' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  const diffInDays = (selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diffInDays < 0 || diffInDays > 45) {
    return res.status(200).json({ availableTimes: [] });
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const client = (await auth.getClient()) as JWT;
    const calendar = google.calendar({ version: 'v3', auth: client });

    const [year, month, day] = date.split('-').map(Number);
    const timeMin = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const timeMax = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const eventsResponse = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'America/Argentina/Buenos_Aires',
    });

    const events = eventsResponse.data?.items || [];
    const selectedDate = new Date(date);
    const availableTimes = extractAvailableTimes(events, selectedDate, durationInMinutes);

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).json({ availableTimes });

  } catch (error) {
    res.status(500).json({ error: `Error al obtener la disponibilidad del calendario: ${error}` });
  }
}

function extractAvailableTimes(events: calendar_v3.Schema$Event[], selectedDate: Date, duration: number) {
  const localDate = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()));
  const startTime = 9;
  const endTime = 19;
  const stepMinutes = 30;
  const availableTimes: string[] = [];

  if (localDate.getUTCDay() === 0 || localDate.getUTCDay() === 6) return [];

  const occupiedSlots = new Set<number>();

  events.forEach(event => {
    const start = new Date(event.start?.dateTime || event.start?.date || '');
    const end = new Date(event.end?.dateTime || event.end?.date || '');
    const offset = -3 * 60;
    const startArg = new Date(start.getTime() + offset * 60000);
    const endArg = new Date(end.getTime() + offset * 60000);

    if (startArg.toISOString().split('T')[0] === localDate.toISOString().split('T')[0]) {
      for (let m = startArg.getUTCHours() * 60 + startArg.getUTCMinutes(); m < endArg.getUTCHours() * 60 + endArg.getUTCMinutes(); m += stepMinutes) {
        occupiedSlots.add(Math.floor(m / stepMinutes));
      }
    }
  });

  const slotStart = new Date(localDate);
  slotStart.setUTCHours(startTime, 0, 0, 0);
  const slotEndLimit = new Date(localDate);
  slotEndLimit.setUTCHours(endTime, 0, 0, 0);

  while (slotStart.getTime() + duration * 60000 <= slotEndLimit.getTime()) {
    const slotMinutes = slotStart.getUTCHours() * 60 + slotStart.getUTCMinutes();
    let isBooked = false;
    for (let m = slotMinutes; m < slotMinutes + duration; m += stepMinutes) {
      if (occupiedSlots.has(Math.floor(m / stepMinutes))) {
        isBooked = true;
        break;
      }
    }
    if (!isBooked) {
      availableTimes.push(slotStart.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }));
    }
    slotStart.setUTCMinutes(slotStart.getUTCMinutes() + stepMinutes);
  }

  return availableTimes;
}
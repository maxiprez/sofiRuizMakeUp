import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { extractAvailableTimes } from 'utils/calendarUtils';
import { getAvailability } from 'src/app/_actions/abmAvailability.action';

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

  const [year, month, day] = date.split('-').map(Number);
  const selected = new Date(year, month - 1, day);
  selected.setHours(0, 0, 0, 0);

  const diffInDays = (selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diffInDays < 0 || diffInDays > 45) {
    return res.status(200).json({ availableTimes: [] });
  }

  try {
    // Primero obtener los horarios configurados desde la base de datos
    const availabilityResult = await getAvailability();
    if (availabilityResult.error) {
      return res.status(500).json({ error: availabilityResult.error });
    }

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
    const availableTimes = extractAvailableTimes(events, selected, durationInMinutes, availabilityResult.data);

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).json({ availableTimes });

  } catch (error) {
    res.status(500).json({ error: `Error al obtener la disponibilidad del calendario: ${error}` });
  }
}
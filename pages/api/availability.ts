import { NextApiRequest, NextApiResponse } from 'next';
import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { date: queryDate, duration } = req.query;
    const durationInMinutes = Number(duration);

    console.log('[REQUEST] Parámetros recibidos:', { queryDate, duration });

    let date = '';
    if (typeof queryDate === 'string' && queryDate.trim() !== '') {
      date = queryDate.trim();
    } else if (Array.isArray(queryDate) && queryDate.length > 0 && queryDate[0].trim() !== '') {
      date = queryDate[0].trim();
    } else {
      console.warn('[VALIDATION] La fecha no fue proporcionada o está vacía.');
      return res.status(400).json({ error: 'La fecha es requerida.' });
    }

    try {
      console.log('[AUTH] Inicializando credenciales de Google...');
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      const client = (await auth.getClient()) as JWT;
      const calendar = google.calendar({ version: 'v3', auth: client });

      const timeMin = new Date(date);
      timeMin.setHours(0, 0, 0, 0);
      timeMin.setUTCHours(0, 0, 0, 0);
      const timeMax = new Date(date);
      timeMax.setHours(23, 59, 59, 999);
      timeMax.setUTCHours(23, 59, 59, 999);

      const calendarId = process.env.CALENDAR_ID;
      console.log('[CALENDAR] Consultando eventos...', {
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
      });

      const eventsResponse = await calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        timeZone: 'America/Argentina/Buenos_Aires',
      });

      const events = eventsResponse.data?.items;
      console.log('[CALENDAR] Eventos obtenidos:', events?.length || 0);

      let availableTimes: string[] = [];
      if (events && Array.isArray(events)) {
        const selectedDateForExtraction = new Date(date);
        availableTimes = extractAvailableTimes(events, selectedDateForExtraction, durationInMinutes);
        console.log('[SLOTS] Horarios disponibles calculados:', availableTimes);
      } else {
        console.warn('[SLOTS] No se encontraron eventos para la fecha:', date);
        availableTimes = [];
      }

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(200).json({ availableTimes });

    } catch (error) {
      console.error('[ERROR] Al obtener eventos del calendario:', error);
      res.status(500).json({ error: `Error al obtener la disponibilidad del calendario: ${error}` });
    }

  } else {
    console.warn('[METHOD] Método no permitido:', req.method);
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function extractAvailableTimes(events: calendar_v3.Schema$Event[], selectedDate: Date, duration: number) {
  console.log('[EXTRACT] Iniciando extracción de horarios...', { selectedDate, duration });

  const [year, month, day] = selectedDate.toISOString().split('T')[0].split('-').map(Number);
  const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const availableTimes: string[] = [];
  const startTime = 9;
  const endTime = 19;
  const stepMinutes = 30;

  const dayOfWeek = localDate.getDay();
  const isWithinWorkDays = dayOfWeek >= 1 && dayOfWeek <= 6;

  if (!isWithinWorkDays) {
    console.warn('[EXTRACT] La fecha no es un día laboral:', localDate.toDateString());
    return [];
  }

  const occupiedSlots = new Set<number>();

  events.forEach((event) => {
    const eventStart = new Date(event.start?.dateTime || event.start?.date || '');
    const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');
    if (eventStart.toDateString() === localDate.toDateString()) {
      const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
      const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
      for (let i = startMinutes; i < endMinutes; i += stepMinutes) {
        occupiedSlots.add(Math.floor(i / stepMinutes));
      }
    }
  });

  const slotStart = new Date(localDate);
  slotStart.setHours(startTime, 0, 0, 0);

  const slotEndLimit = new Date(localDate);
  slotEndLimit.setHours(endTime, 0, 0, 0);

  while (slotStart.getTime() + duration * 60000 <= slotEndLimit.getTime()) {
    const currentSlotStartMinutes = slotStart.getHours() * 60 + slotStart.getMinutes();
    const currentSlotEndMinutes = currentSlotStartMinutes + duration;

    let isSlotBooked = false;
    for (let i = currentSlotStartMinutes; i < currentSlotEndMinutes; i += stepMinutes) {
      if (occupiedSlots.has(Math.floor(i / stepMinutes))) {
        isSlotBooked = true;
        break;
      }
    }

    if (!isSlotBooked) {
      const formattedTime = slotStart.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      availableTimes.push(formattedTime);
    }

    slotStart.setMinutes(slotStart.getMinutes() + stepMinutes);
  }

  console.log('[EXTRACT] Horarios finales generados:', availableTimes);
  return availableTimes;
}

import { NextApiRequest, NextApiResponse } from 'next';
import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { date: queryDate, duration } = req.query;
    const durationInMinutes = Number(duration);

    let date = '';
    if (typeof queryDate === 'string' && queryDate.trim() !== '') { // Verificar si es string y no está vacía después de quitar espacios
      date = queryDate.trim();
    } else if (Array.isArray(queryDate) && queryDate.length > 0 && queryDate[0].trim() !== '') { // Verificar si es array, no vacío y el primer elemento no está vacío
      date = queryDate[0].trim(); // Tomar el primer elemento si es un array y no está vacío
    } else {
      // Manejar el caso en que 'date' no se proporciona o está vacía en la consulta
      return res.status(400).json({ error: 'La fecha es requerida.' });
    }

    try {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      const auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });

      const client = await auth.getClient() as JWT;
      const calendar = google.calendar({ version: 'v3', auth: client });

      // Formatea la fecha para usarla en las consultas de Google Calendar (puedes necesitar ajustar esto)
      const timeMin = new Date(date);
      timeMin.setHours(0, 0, 0, 0);
      timeMin.setUTCHours(0, 0, 0, 0); // Asegurar que la hora es 00:00:00 UTC
      const timeMax = new Date(date);
      timeMax.setHours(23, 59, 59, 999);
      timeMax.setUTCHours(23, 59, 59, 999); // Asegurar que la hora es 23:59:59.999 UTC

      const calendarId = process.env.CALENDAR_ID; // quitar el _TEST en caso que queremos usar el calendario real

      const eventsResponse = await calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = eventsResponse.data?.items;
      let availableTimes: string[] = [];
      if (events && Array.isArray(events)) {
        const selectedDateForExtraction = new Date(date);

        availableTimes = extractAvailableTimes(events, selectedDateForExtraction, durationInMinutes); // Llama a extractAvailableTimes solo si 'events' es un array
      } else {
        console.warn('No se encontraron eventos en el calendario para la fecha:', date);
        availableTimes = []; // Si no hay eventos, devolvemos un array vacío
      }

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(200).json({ availableTimes });

    } catch (error) {
      console.error('Error al obtener eventos del calendario:', error);
      res.status(500).json({ error: `Error al obtener la disponibilidad del calendario: ${error}` });
    }

  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function extractAvailableTimes(events: calendar_v3.Schema$Event[], selectedDate: Date, duration: number) {
  const [year, month, day] = selectedDate.toISOString().split('T')[0].split('-').map(Number);
  const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const availableTimes: string[] = [];
  const startTime = 9; // Hora de inicio del horario de atención (9 AM)
  const endTime = 19; // Hora de fin del horario de atención (7 PM)
  const stepMinutes = 30;

  const dayOfWeek = localDate.getDay();
  const isWithinWorkDays = dayOfWeek >= 1 && dayOfWeek <= 6;

  if (!isWithinWorkDays) {
    return [];
  }

  // Calculate total minutes in a day for indexing
  //const totalDayMinutes = 24 * 60;
  const occupiedSlots = new Set<number>(); // Use a Set for efficient lookups

  // Populate occupiedSlots based on existing events
  events.forEach((event) => {
    const eventStart = new Date(event.start?.dateTime || event.start?.date || '');
    const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');

    // Ensure event times are on the selected date for accurate indexing
    if (eventStart.toDateString() === localDate.toDateString()) {
      const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
      const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();

      for (let i = startMinutes; i < endMinutes; i += stepMinutes) {
        occupiedSlots.add(Math.floor(i / stepMinutes));
      }
    }
  });

  // Generate possible slots and check for availability
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
        hour12: false
      });
      availableTimes.push(formattedTime);
    }

    slotStart.setMinutes(slotStart.getMinutes() + stepMinutes);
  }
  return availableTimes;
}
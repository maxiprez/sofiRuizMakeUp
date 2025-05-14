import { NextApiRequest, NextApiResponse } from 'next';
import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path';

// Use path resolution to get the absolute path to the service account key
const serviceAccountKeyPath = path.resolve(process.cwd(), 'pages/api/config/serviceAccountKey.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { service, date: queryDate } = req.query;
    console.log('Solicitud de disponibilidad recibida para:', service, queryDate);

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
      const auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountKeyPath, // Use the resolved absolute path
        scopes: ['https://www.googleapis.com/auth/calendar'], // permiso de lectura y escritura
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

      const calendarId = process.env.CALENDAR_ID_TEST; // quitar el _TEST en caso que queremos usar el calendario real

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
        console.log('Fecha para extractAvailableTimes:', selectedDateForExtraction); // Imprime el objeto Date
        availableTimes = extractAvailableTimes(events, selectedDateForExtraction); // Llama a extractAvailableTimes solo si 'events' es un array
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

function extractAvailableTimes(events: calendar_v3.Schema$Event[], selectedDate: Date) {
  console.log('Original selectedDate:', selectedDate);
  
  // Parse the date string to ensure exact date
  const [year, month, day] = selectedDate.toISOString().split('T')[0].split('-').map(Number);
  
  // Create date with explicit parameters to avoid timezone shifts
  const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const availableTimes: string[] = [];
  const bookingDurationHours = 1; // Duración del turno en horas
  const startTime = 9; // Hora de inicio del horario de atención (9 AM)
  const endTime = 19; // Hora de fin del horario de atención (7 PM)

  const dayOfWeek = localDate.getDay(); // Use getDay for local day calculation

  // Verificar si el día de la semana está dentro del horario de atención (Lunes a Sábado)
  const isWithinWorkDays = dayOfWeek >= 1 && dayOfWeek <= 6;

  if (!isWithinWorkDays) {
    return []; // No hay disponibilidad fuera del horario de atención
  }

  // Generar todos los posibles horarios de inicio dentro del horario de atención
  const possibleSlots: Date[] = [];
  for (let hour = startTime; hour < endTime; hour++) {
    possibleSlots.push(new Date(
      localDate.getFullYear(), 
      localDate.getMonth(), 
      localDate.getDate(), 
      hour, 0, 0
    ));
  }

  // Filtrar los horarios que no están ocupados por eventos existentes
  possibleSlots.forEach((slot) => {
    const slotEnd = new Date(slot);
    slotEnd.setHours(slotEnd.getHours() + bookingDurationHours);

    const isSlotBooked = events.some((event) => {
      const eventStart = new Date(event.start?.dateTime || event.start?.date || '');
      const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');

      // Verificar si el posible slot se superpone con algún evento existente
      return (slot < eventEnd && slotEnd > eventStart);
    });

    if (!isSlotBooked) {
      // Formatear la hora de inicio del slot como una cadena (ej. "09:00 AM")
      const formattedTime = slot.toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
      availableTimes.push(formattedTime);
    }
  });

  return availableTimes;
}
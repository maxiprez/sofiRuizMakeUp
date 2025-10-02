import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path';

const serviceAccountKeyPath = path.resolve(process.cwd(), 'pages/api/config/serviceAccountKey.json');

type EventData = { 
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
};

export default async function createEvent(eventData: EventData) { // eventData debe contener los datos del evento de Supabase
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyPath,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  const client = await auth.getClient() as JWT;
  const calendar = google.calendar({ version: 'v3', auth: client });

  const event: calendar_v3.Schema$Event = {
    summary: eventData.summary,
    description: eventData.description,
    start: eventData.start,
    end: eventData.end,
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.CALENDAR_ID_TEST, // ¡Importante: Usa el ID del calendario de prueba!
      requestBody: event,
    });
    const eventId = response.data.id; 
    return { eventId, ...response.data }; // Devuelve la información del evento creado
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(`Error al crear evento en Google Calendar: ${error}`); // Lanza el error para que se maneje más arriba
  }
}

export async function deleteEvent(eventId: string) {
  if (!eventId) {
    throw new Error('Se debe proporcionar el ID del evento a borrar.');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyPath,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  const client = await auth.getClient() as JWT;
  const calendar = google.calendar({ version: 'v3', auth: client });

  try {
    await calendar.events.delete({
      calendarId: process.env.CALENDAR_ID_TEST,
      eventId: eventId,
    });
  } catch (error) {
    console.error(`Error al borrar el evento con ID ${eventId}:`, error);
    throw new Error(`Error al borrar el evento del calendario: ${error}`);
  }
}
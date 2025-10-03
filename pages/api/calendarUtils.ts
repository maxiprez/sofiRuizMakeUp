import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';

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

function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
}

export default async function createEvent(eventData: EventData) {
  const auth = getAuthClient();
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
      calendarId: process.env.CALENDAR_ID,
      requestBody: event,
    });
    const eventId = response.data.id; 
    return { eventId, ...response.data };
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(`Error al crear evento en Google Calendar: ${error}`);
  }
}

export async function deleteEvent(eventId: string) {
  if (!eventId) {
    throw new Error('Se debe proporcionar el ID del evento a borrar.');
  }

  const auth = getAuthClient();
  const client = await auth.getClient() as JWT;
  const calendar = google.calendar({ version: 'v3', auth: client });

  try {
    await calendar.events.delete({
      calendarId: process.env.CALENDAR_ID,
      eventId: eventId,
    });
  } catch (error) {
    console.error(`Error al borrar el evento con ID ${eventId}:`, error);
    throw new Error(`Error al borrar el evento del calendario: ${error}`);
  }
}

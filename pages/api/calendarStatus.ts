import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { extractAvailableTimes } from '../../utils/calendarUtils';
import { getAvailability } from 'src/app/_actions/abmAvailability.action';

function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
}

interface DayStatus {
  date: string;
  status: 'available' | 'busy' | 'disabled';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    
    // Primero obtener los horarios configurados desde la base de datos
    const availabilityResult = await getAvailability();
    if (availabilityResult.error) {
      return res.status(500).json({ error: availabilityResult.error });
    }
    
    const auth = getAuthClient();
    const client = await auth.getClient() as JWT;
    const calendar = google.calendar({ version: 'v3', auth: client });

    // Get all events in date range
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: new Date(startDate as string).toISOString(),
      timeMax: new Date(endDate as string).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const dayStatuses: DayStatus[] = [];

    // Check each day in the range
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const diffInDays = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      
      let status: 'available' | 'busy' | 'disabled';

      if (date < today || diffInDays > 45) {
        status = 'disabled';
      } else {
        const [year, month, day] = dateStr.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        const availableTimes = extractAvailableTimes(events, localDate, 60, availabilityResult.data);
        status = availableTimes.length === 0 ? 'busy' : 'available';
      }

      dayStatuses.push({
        date: dateStr,
        status
      });
    }

    res.status(200).json({ dayStatuses });
  } catch (error) {
    console.error('Error al obtener estado del calendario:', error);
    res.status(500).json({ error: 'Failed to fetch calendar status' });
  }
}

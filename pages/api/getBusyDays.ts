import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { extractAvailableTimes } from 'utils/calendarUtils';

function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
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
    
    const auth = getAuthClient();
    const client = await auth.getClient() as JWT;
    const calendar = google.calendar({ version: 'v3', auth: client });

    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: new Date(startDate as string).toISOString(),
      timeMax: new Date(endDate as string).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const busyDays: string[] = [];

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (date < today) continue;

      const diffInDays = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays > 45) continue;

      const dateStr = date.toISOString().split('T')[0];
      
      const availableTimes = extractAvailableTimes(events, new Date(date), 60);
      
      if (availableTimes.length === 0) {
        busyDays.push(dateStr);
      }
    }

    res.status(200).json({ busyDays });
  } catch (error) {
    console.error('Error al obtener días ocupados:', error);
    res.status(500).json({ error: 'Failed to fetch busy days' });
  }
}

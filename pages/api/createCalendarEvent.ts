import { NextApiRequest, NextApiResponse } from 'next';
import createEvent from './calendarUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    res.status(200).json({ event: await createEvent(req.body) });
  } catch (error) {
    console.error('Error en /api/create-calendar-event:', error);
    res.status(500).json({ error: error || 'Failed to create event' });
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import deleteEvent from './calendarUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { eventId } = req.body;
    if (!eventId) {
        return res.status(400).json({ error: 'Event ID is required' });
      }
      await deleteEvent(eventId);
      res.status(200).json({ message: `Evento con ID ${eventId} borrado exitosamente` }); 
  } catch (error) {
    console.error('Error en /api/deleteCalendarEvent:', error);
    res.status(500).json({ error: error || 'Failed to delete event' });
  }
}
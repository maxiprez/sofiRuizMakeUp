import { NextApiRequest, NextApiResponse } from 'next';
import createEvent from './calendarUtils'; // Importa la función desde el archivo de utilidades

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const eventData = req.body; // Los datos del evento vendrán en el cuerpo de la solicitud
    const newEvent = await createEvent(eventData);
    console.log("newEvent: id del evento creado ", newEvent.id);
    res.status(200).json({ event: newEvent }); // Devuelve la información del evento creado
  } catch (error) {
    console.error('Error en /api/create-calendar-event:', error);
    res.status(500).json({ error: error || 'Failed to create event' });
  }
}
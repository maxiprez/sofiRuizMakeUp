import { calendar_v3 } from 'googleapis';

export function extractAvailableTimes(events: calendar_v3.Schema$Event[], selectedDate: Date, duration: number) {
  const localDate = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()));
  const startTime = 9;
  let endTime = 19;
  const stepMinutes = 30;
  const availableTimes: string[] = [];

  if (localDate.getUTCDay() === 0 || localDate.getUTCDay() === 6) return [];
  if (localDate.getUTCDay() === 2) endTime = 20;

  const occupiedSlots = new Set<number>();

  events.forEach(event => {
    const start = new Date(event.start?.dateTime || event.start?.date || '');
    const end = new Date(event.end?.dateTime || event.end?.date || '');
    const offset = -3 * 60;
    const startArg = new Date(start.getTime() + offset * 60000);
    const endArg = new Date(end.getTime() + offset * 60000);

    if (startArg.toISOString().split('T')[0] === localDate.toISOString().split('T')[0]) {
      for (let m = startArg.getUTCHours() * 60 + startArg.getUTCMinutes(); m < endArg.getUTCHours() * 60 + endArg.getUTCMinutes(); m += stepMinutes) {
        occupiedSlots.add(Math.floor(m / stepMinutes));
      }
    }
  });

  const slotStart = new Date(localDate);
  slotStart.setUTCHours(startTime, 0, 0, 0);
  const slotEndLimit = new Date(localDate);
  slotEndLimit.setUTCHours(endTime, 0, 0, 0);

  while (slotStart.getTime() + duration * 60000 <= slotEndLimit.getTime()) {
    const slotMinutes = slotStart.getUTCHours() * 60 + slotStart.getUTCMinutes();
    let isBooked = false;
    for (let m = slotMinutes; m < slotMinutes + duration; m += stepMinutes) {
      if (occupiedSlots.has(Math.floor(m / stepMinutes))) {
        isBooked = true;
        break;
      }
    }
    if (!isBooked) {
      availableTimes.push(slotStart.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }));
    }
    slotStart.setUTCMinutes(slotStart.getUTCMinutes() + stepMinutes);
  }

  return availableTimes;
}

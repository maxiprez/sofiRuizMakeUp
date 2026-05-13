import { calendar_v3 } from 'googleapis';
import { Availability } from 'src/app/_actions/abmAvailability.action';

export function extractAvailableTimes(events: calendar_v3.Schema$Event[], selectedDate: Date, duration: number, configuredAvailability?: Availability[]) {
  const stepMinutes = 30;
  const availableTimes: string[] = [];

  const dayOfWeek = selectedDate.getDay();
  const dayConfig = configuredAvailability?.find(config => config.day_of_week === dayOfWeek);

  if (!dayConfig || !dayConfig.enabled) {
    return [];
  }

  const startTime = parseInt(dayConfig.start_time.split(':')[0]);
  const startMinutes = parseInt(dayConfig.start_time.split(':')[1]);
  const endTime = parseInt(dayConfig.end_time.split(':')[0]);
  const endMinutes = parseInt(dayConfig.end_time.split(':')[1]);
  let breakStartHour = null;
  let breakStartMinutes = null;
  let breakEndHour = null;
  let breakEndMinutes = null;

  if (dayConfig.break_start && dayConfig.break_end) {
    breakStartHour = parseInt(dayConfig.break_start.split(':')[0]);
    breakStartMinutes = parseInt(dayConfig.break_start.split(':')[1]);
    breakEndHour = parseInt(dayConfig.break_end.split(':')[0]);
    breakEndMinutes = parseInt(dayConfig.break_end.split(':')[1]);
  }

  const occupiedSlots = new Set<number>();

  events.forEach(event => {
    const start = new Date(event.start?.dateTime || event.start?.date || '');
    const end = new Date(event.end?.dateTime || event.end?.date || '');
    const offset = -3 * 60;
    const startArg = new Date(start.getTime() + offset * 60000);
    const endArg = new Date(end.getTime() + offset * 60000);

    if (startArg.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]) {
      for (let m = startArg.getUTCHours() * 60 + startArg.getUTCMinutes(); m < endArg.getUTCHours() * 60 + endArg.getUTCMinutes(); m += stepMinutes) {
        occupiedSlots.add(Math.floor(m / stepMinutes));
      }
    }
  });

  const slotStart = new Date(selectedDate);
  slotStart.setHours(startTime, startMinutes, 0, 0);
  const slotEndLimit = new Date(selectedDate);
  slotEndLimit.setHours(endTime, endMinutes, 0, 0);

  while (slotStart.getTime() + duration * 60000 <= slotEndLimit.getTime()) {
    const slotMinutes = slotStart.getHours() * 60 + slotStart.getMinutes();
    
    let isBreakTime = false;
    if (breakStartHour !== null && breakEndHour !== null) {
      const breakStartTotalMinutes = breakStartHour * 60 + (breakStartMinutes!);
      const breakEndTotalMinutes = breakEndHour * 60 + (breakEndMinutes!);
      
      for (let m = slotMinutes; m < slotMinutes + duration; m += stepMinutes) {
        if (m >= breakStartTotalMinutes && m < breakEndTotalMinutes) {
          isBreakTime = true;
          break;
        }
      }
    }
    
    let isBooked = false;
    for (let m = slotMinutes; m < slotMinutes + duration; m += stepMinutes) {
      if (occupiedSlots.has(Math.floor(m / stepMinutes))) {
        isBooked = true;
        break;
      }
    }
    
    if (!isBooked && !isBreakTime) {
      availableTimes.push(slotStart.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }));
    }
    slotStart.setMinutes(slotStart.getMinutes() + stepMinutes);
  }
  
  return availableTimes;
}

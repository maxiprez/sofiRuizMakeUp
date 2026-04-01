
import { useMemo } from 'react';
import { format } from 'date-fns';

interface DayStatus {
  date: string;
  status: 'available' | 'busy' | 'disabled';
}

export function useCalendarConstraints(dayStatuses: DayStatus[]) {
  const today = useMemo(() => new Date(), []);

  const { startMonth, endMonth, isDisabled, isAvailable } = useMemo(() => {
    const validStatuses = dayStatuses.filter(ds => ds.status !== undefined);

    const firstDataDate =
      validStatuses.length > 0
        ? new Date(Math.min(...validStatuses.map(ds => new Date(ds.date).getTime())))
        : today;

    const lastDataDate =
      dayStatuses.length > 0
        ? new Date(Math.max(...dayStatuses.map(ds => new Date(ds.date).getTime())))
        : new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000);

    const todayStr = format(today, 'yyyy-MM-dd');

    return {
      startMonth: new Date(firstDataDate.getFullYear(), firstDataDate.getMonth(), 1),
      endMonth: lastDataDate,
      isDisabled: (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayStatus = dayStatuses.find(ds => ds.date === dateStr);
        return (
          !dayStatus ||
          dayStatus.status === 'disabled' ||
          dayStatus.status === 'busy' ||
          dateStr === todayStr
        );
      },
      isAvailable: (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayStatus = dayStatuses.find(ds => ds.date === dateStr);
        return dayStatus?.status === 'available';
      },
    };
  }, [dayStatuses, today]);

  return { startMonth, endMonth, isDisabled, isAvailable };
}
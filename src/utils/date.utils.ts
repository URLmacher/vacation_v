import { eachDayOfInterval, endOfMonth, getDay, startOfMonth } from 'date-fns';
import { YEAR } from 'src/data';

export const formatDayOfMonth = (date: Date): number => {
  return date.getDay();
};

export const getDatesOfMonth = (month: number, size: number): (Date | null)[] => {
  const startDate = startOfMonth(new Date(YEAR, month - 1));
  const endDate = endOfMonth(startDate);
  const allDates = eachDayOfInterval({ end: endDate, start: startDate, });

  const startOffset = getDay(startDate) === 0 ? 6 : getDay(startDate) - 1; // Adjust for Monday-start
  return Array(startOffset)
    .fill(null)
    .concat(allDates)
    .concat(Array(size - (startOffset + allDates.length)).fill(null));
};

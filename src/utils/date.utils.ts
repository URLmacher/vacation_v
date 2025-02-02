import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  startOfMonth,
  format
} from 'date-fns';
import { YEAR } from 'src/data';
import { de } from 'date-fns/locale';

export const getDatesOfMonth = (
  month: number,
  size: number
): (Date | null)[] => {
  const startDate = startOfMonth(new Date(YEAR, month - 1));
  const endDate = endOfMonth(startDate);
  const allDates = eachDayOfInterval({ end: endDate, start: startDate });

  const startOffset = getDay(startDate) === 0 ? 6 : getDay(startDate) - 1;
  return Array(startOffset)
    .fill(null)
    .concat(allDates)
    .concat(Array(size - (startOffset + allDates.length)).fill(null));
};

export const getNameOfMonth = (month: number): string => {
  const date = new Date(YEAR, month - 1, 1);
  return format(date, 'MMMM', { locale: de });
};

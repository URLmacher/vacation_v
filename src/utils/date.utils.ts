import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isWeekend,
  startOfMonth
} from 'date-fns';
import { de } from 'date-fns/locale';
import { DATES, HOLIDAY_DATES, YEAR } from 'src/data';
import { ICalendarDisplay } from 'src/definitions';

export const getDaysOfMonth = (month: number): Date[] => {
  const startDate = startOfMonth(new Date(YEAR, month - 1));
  const endDate = endOfMonth(startDate);
  const allDates = eachDayOfInterval({ end: endDate, start: startDate });
  return allDates;
};

export const getDatesOfMonthFilled = (
  month: number,
  size: number
): (Date | null)[] => {
  const startDate = startOfMonth(new Date(YEAR, month - 1));
  const allDates = getDaysOfMonth(month);

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

export const isVacationDay = (val: string | Date): boolean => {
  return DATES.some((date) => isSameDay(date, new Date(val)));
};

export const isHolidayOrWeekend = (val: string | Date): boolean => {
  return (
    isWeekend(val) ||
    HOLIDAY_DATES.some((date) => isSameDay(date, new Date(val)))
  );
};

export const isDateSelected = (
  val: string | Date,
  daysSelected: ICalendarDisplay[]
): boolean => {
  return daysSelected.some(
    (selectedDay) =>
      selectedDay.date && isSameDay(selectedDay.date, new Date(val))
  );
};

export const isEveryVacationDayOfMonthSelected = (
  month: number,
  daysSelected: ICalendarDisplay[]
): boolean => {
  const datesOfMonth = getDaysOfMonth(month);
  const vacationDaysInMonth = DATES.filter((date) =>
    datesOfMonth.some((dateOfMonth) => isSameDay(new Date(date), dateOfMonth))
  );

  return vacationDaysInMonth.every((vacationDay) =>
    daysSelected.some(
      (selectedDay) =>
        selectedDay.date &&
        isSameDay(new Date(selectedDay.date), new Date(vacationDay))
    )
  );
};

export const areAllVacationDaysSelected = (
  daysSelected: ICalendarDisplay[]
): boolean => {
  const allVacationDays = DATES.map((date) => new Date(date));
  return allVacationDays.every((vacationDay) =>
    daysSelected.some(
      (selectedDay) =>
        selectedDay.date && isSameDay(new Date(selectedDay.date), vacationDay)
    )
  );
};

export type TAxis = [x: number, z: number, y: number];

export interface ICalendarDisplay {
  date: Date | null;
  dateLabel: string;
  position: TAxis;
  color: string;
}

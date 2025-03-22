import { Vector3 } from 'three';

export type TAxis = [x: number, z: number, y: number];

export interface ICalendarDisplay {
  date: Date | null;
  dateLabel: string;
  position: TAxis;
  color: string;
  isVacationDay: boolean;
}

export interface IParticle {
  position: Vector3;
  dPos: Vector3;
}

export interface IExplosionData {
  time: number;
  offset: Vector3;
  color: string;
  particles: IParticle[];
}

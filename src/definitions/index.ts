import { Vector3 } from 'three';

export type TAxis = [x: number, z: number, y: number];

export interface ICalendarDisplay {
  date: Date | null;
  dateLabel: string;
  position: TAxis;
  color: string;
  isVacationDay: boolean;
  isSelected: boolean;
}

export interface IParticle {
  position: Vector3;
  dPos: Vector3;
}

export interface IExplosionData {
  time: number;
  offset: Vector3;
  color: string;
  scale: number;
  particles: IParticle[];
}

export enum ESurfaceType {
  WATER = 'water',
  SAND = 'sand',
  TARGET = 'target',
  NON_TARGET = 'non-target',
  OTHER = 'other'
}

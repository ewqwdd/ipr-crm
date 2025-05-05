import { Material } from '@/entities/material';

export type SkillType = 'SOFT' | 'HARD';

export interface Hints {
  0?: string;
  1?: string;
  2?: string;
  3?: string;
  4?: string;
  5?: string;
}

export interface HintValues {
  0?: string;
  1?: string;
  2?: string;
  3?: string;
  4?: string;
  5?: string;
}

export interface Competency {
  id: number;
  name: string;
  blockId: number;
  indicators: Indicator[];
  materials: { material: Material }[];
}

export interface Indicator {
  id: number;
  name: string;
  description?: string;
  competencyId: number;
  materials: { material: Material }[];
  boundary: number;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  hint4?: string;
  hint5?: string;
  value1?: string;
  value2?: string;
  value3?: string;
  value4?: string;
  value5?: string;
  skipHint?: string;
  skipValue?: string;
}

export interface CompetencyBlock {
  id: number;
  name: string;
  type: SkillType;
  specId: number;
  materials?: { material: Material }[];
  competencies: Competency[];
}

export interface AddCompetencyBlockDto {
  name: string;
  type: SkillType;
  specId?: number;
}

export interface AddCompetencyDto {
  name: string;
  blockId: number;
  indicators?: string[];
}

export interface AddIndicatorDto {
  indicators: string[];
  boundary: number;
  description?: string;
  competencyId: number;
  hints?: Hints;
  values?: HintValues;
}

export interface Version {
  id: number;
  date: Date;
}

export type SkillCombineType = Competency | Indicator | CompetencyBlock;

export enum CompetencyType {
  COMPETENCY_BLOCK = 'COMPETENCY_BLOCK',
  COMPETENCY = 'COMPETENCY',
  INDICATOR = 'INDICATOR',
}

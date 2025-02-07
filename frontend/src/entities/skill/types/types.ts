export type SkillType = 'SOFT' | 'HARD';

export interface Competency {
  id: number;
  name: string;
  blockId: number;
  indicators: Indicator[];
  materials: {}[];
}

export interface Indicator {
  id: number;
  name: string;
  description?: string;
  competencyId: number;
  materials: {}[];
}

export interface CompetencyBlock {
  id: number;
  name: string;
  type: SkillType;
  specId: number;
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
}

export interface AddIndicatorDto {
  name: string;
  description?: string;
  competencyId: number;
}

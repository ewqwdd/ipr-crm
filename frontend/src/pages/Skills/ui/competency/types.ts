import { Competency, CompetencyBlock, Indicator } from '@/entities/skill';

type CombineType = Competency | Indicator | CompetencyBlock;

export enum CompetencyType {
  COMPETENCY_BLOCK = 'COMPETENCY_BLOCK',
  COMPETENCY = 'COMPETENCY',
  INDICATOR = 'INDICATOR',
}

export type CompetencyListItemProps = CombineType & {
  listItemType: CompetencyType;
  openModal: (type: string, data?: unknown) => void;
  boundary?: number;
};

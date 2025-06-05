import {
  Competency,
  CompetencyBlock,
  Indicator,
  SkillType,
} from '@/entities/skill';
import React from 'react';

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
  disabled?: boolean;
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
  skillType: SkillType;
  pageType?: 'profile' | 'folder'; 
  folderId?: number;
  setList?: React.Dispatch<React.SetStateAction<CompetencyBlock[]>>;
};

import { EvaulatorType } from '@/shared/types/AssesmentBaseType';

export const evaluatorTypeNames: Record<EvaulatorType, string> = {
  CURATOR: 'Руководители',
  TEAM_MEMBER: 'Коллеги',
  SUBORDINATE: 'Подчиненные',
};

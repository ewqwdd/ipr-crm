import { EvaulatorType } from '@/shared/types/AssesmentBaseType';
import { ChartData } from 'chart.js';

const evaluatorTypes = [
  'CURATOR',
  'TEAM_MEMBER',
  'SUBORDINATE',
  'SELF',
] as const;

const ayeChartColor = {
  CURATOR: {
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 2,
  },
  TEAM_MEMBER: {
    backgroundColor: 'rgba(255, 206, 86, 0.5)',
    borderColor: 'rgba(255, 206, 86, 1)',
    borderWidth: 2,
  },
  SUBORDINATE: {
    backgroundColor: 'rgba(75, 192, 75, 0.5)',
    borderColor: 'rgba(75, 192, 75, 1)',
    borderWidth: 2,
  },
  SELF: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderColor: 'rgba(128, 128, 128, 1)',
    borderWidth: 2,
  },
};

const ayeLabels = {
  CURATOR: 'Кураторы',
  TEAM_MEMBER: 'Коллеги',
  SUBORDINATE: 'Подчинённые',
  SELF: 'Самооценка',
};

export const getAyeChartData = (
  data: Record<EvaulatorType, number>,
  label: string,
): ChartData<'bar'> => {
  return {
    labels: [label],
    datasets: evaluatorTypes.map((evalutor) => {
      return {
        label: ayeLabels[evalutor],
        data: [data?.[evalutor as EvaulatorType] ?? 0],
        ...ayeChartColor[evalutor],
      };
    }),
  };
};

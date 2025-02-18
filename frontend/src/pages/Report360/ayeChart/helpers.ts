import { EvaulatorType } from '@/entities/rates/types/types';
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
  //   TODO: add SELF
  SELF: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderColor: 'rgba(128, 128, 128, 1)',
    borderWidth: 2,
  },
};

export const getAyeChartData = (
  data: Record<EvaulatorType, number>,
  label: string,
): ChartData<'bar'> => {
  return {
    labels: [label],
    datasets: evaluatorTypes.map((evalutor) => {
      return {
        label: evalutor,
        data: [data?.[evalutor as EvaulatorType] ?? 0],
        ...ayeChartColor[evalutor],
      };
    }),
  };
};

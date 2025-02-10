import { Rate } from '@/entities/rates';
import { CompetencyBlock } from '@/entities/skill';
import { Assesment } from '@/pages/Rate360Assesment/types/types';

export const tranformAssesment = (blocks: CompetencyBlock[], data: Rate) => {
  let assesmentData: Assesment = {};
  blocks.forEach((block) => {
    assesmentData[block.id] = block.competencies.reduce<Assesment[0]>(
      (acc, competency) => {
        acc[competency.id] = competency.indicators.reduce<Assesment[0][0]>(
          (acc, indicator) => {
            const foundRate = data?.userRates.find(
              (rate) => rate.indicatorId === indicator.id,
            );
            acc[indicator.id] = {
              rate: foundRate?.rate,
              comment: foundRate?.comment,
            };
            return acc;
          },
          {},
        );
        return acc;
      },
      {},
    );
  });

  return assesmentData;
};

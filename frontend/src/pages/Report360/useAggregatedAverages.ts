import { useMemo } from 'react';
import { EvaulatorType } from '@/entities/rates/types/types';
import { Competency, CompetencyBlock } from '@/entities/skill';
import { calculateAverage } from './helpers';
import { FinalRatings } from './useCalculateAvgIndicatorRaitings';

type EvaluatorType = EvaulatorType; // TODO: change to EvaulatorType

interface AggregatedAveragesResult {
  competenciesRaiting: Record<number, Record<EvaluatorType, number>>;
  blocksRaiting: Record<number, Record<EvaluatorType, number>>;
  overallAverage: Record<EvaluatorType, number>;
}

const calculateCompetencyAverage = (
  competency: Competency,
  indicatorAverages: FinalRatings,
): Record<EvaluatorType, number> => {
  const indicatorValuesByType: Partial<Record<EvaluatorType, number[]>> = {};

  competency.indicators.forEach((indicator) => {
    const indicatorValues = indicatorAverages[indicator.id];

    if (indicatorValues) {
      Object.keys(indicatorValues).forEach((type) => {
        const evaluatorType = type as EvaluatorType;
        indicatorValuesByType[evaluatorType] ??= [];
        indicatorValuesByType[evaluatorType]!.push(
          indicatorValues[evaluatorType],
        );
      });
    }
  });

  const avg: Record<EvaluatorType, number> = {} as Record<
    EvaluatorType,
    number
  >;
  Object.keys(indicatorValuesByType).forEach((type) => {
    const evaluatorType = type as EvaluatorType;
    avg[evaluatorType] = calculateAverage(
      indicatorValuesByType[evaluatorType]!,
    );
  });

  return avg;
};

const calculateBlockAverage = (
  block: CompetencyBlock,
  competencies: Record<number, Record<EvaluatorType, number>>,
): Record<EvaluatorType, number> => {
  const blockAggregated: Partial<Record<EvaluatorType, number[]>> = {};

  block.competencies.forEach((competency) => {
    const competencyAvg = competencies[competency.id];

    if (competencyAvg) {
      Object.keys(competencyAvg).forEach((type) => {
        const evaluatorType = type as EvaluatorType;
        blockAggregated[evaluatorType] ??= [];
        blockAggregated[evaluatorType]!.push(competencyAvg[evaluatorType]);
      });
    }
  });

  const avg: Record<EvaluatorType, number> = {} as Record<
    EvaluatorType,
    number
  >;
  Object.keys(blockAggregated).forEach((type) => {
    const evaluatorType = type as EvaluatorType;
    avg[evaluatorType] = calculateAverage(blockAggregated[evaluatorType]!);
  });

  return avg;
};

const calculateAggregatedAverages = (
  filteredBlocks: CompetencyBlock[],
  indicatorAverages: FinalRatings,
) => {
  const competencies: Record<number, Record<EvaluatorType, number>> = {};
  const blocks: Record<number, Record<EvaluatorType, number>> = {};
  const overallAggregated: Partial<Record<EvaluatorType, number[]>> = {};

  filteredBlocks.forEach((block) => {
    block.competencies.forEach((competency) => {
      competencies[competency.id] = calculateCompetencyAverage(
        competency,
        indicatorAverages,
      );
    });

    blocks[block.id] = calculateBlockAverage(block, competencies);

    Object.keys(blocks[block.id]).forEach((type) => {
      const evaluatorType = type as EvaluatorType;
      overallAggregated[evaluatorType] ??= [];
      overallAggregated[evaluatorType]!.push(blocks[block.id][evaluatorType]);
    });
  });
  const overallAverage: Record<EvaluatorType, number> = {} as Record<
    EvaluatorType,
    number
  >;
  Object.keys(overallAggregated).forEach((type) => {
    const evaluatorType = type as EvaluatorType;
    overallAverage[evaluatorType] = calculateAverage(
      overallAggregated[evaluatorType]!,
    );
  });

  return {
    competenciesRaiting: competencies,
    blocksRaiting: blocks,
    overallAverage,
  };
};

export const useAggregatedAverages = (
  filteredBlocks?: CompetencyBlock[],
  indicatorAverages?: FinalRatings,
): AggregatedAveragesResult => {
  return useMemo(() => {
    if (!filteredBlocks || !filteredBlocks.length || !indicatorAverages) {
      return {
        overallAverage: {} as Record<EvaluatorType, number>,
        competenciesRaiting: {},
        blocksRaiting: {},
      };
    }

    return calculateAggregatedAverages(filteredBlocks, indicatorAverages);
  }, [filteredBlocks, indicatorAverages]);
};

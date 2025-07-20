type CompetencyBlock = {
  competencies: {
    indicators: unknown[];
  }[];
};

export const countRateProgress = (
  competencyBlocks: CompetencyBlock[],
  userRates: unknown[],
) => {
  const indicators = competencyBlocks.flatMap((block) =>
    block.competencies.flatMap((competency) => competency.indicators),
  );
  const userRatesCount = userRates.length;

  if (indicators.length === 0) {
    return {
      percent: 1,
      userRatesCount,
      indicatorsCount: 0,
    };
  }

  return {
    percent: userRatesCount > 0 ? userRatesCount / indicators.length : 0,
    userRatesCount,
    indicatorsCount: indicators.length,
  };
};

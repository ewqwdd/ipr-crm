import type {
  Competency,
  CompetencyBlock,
  Indicator,
  Rate,
} from "@/shared/types/Rate";

export const rateService = {
  getIndicators: (blocks: CompetencyBlock[]) =>
    blocks
      .flatMap((block) => block.competencies)
      .flatMap((competency) => competency.indicators),

  countIndicatorRates: (indicator: Indicator, rate: Rate) => {
    const indicatorRates = rate.userRates.filter(
      (userRate) =>
        userRate.indicatorId === indicator.id &&
        userRate.approved &&
        userRate.rate > 0,
    );

    const subbordinates = rate.evaluators
      .filter((evaluator) => evaluator.type === "SUBORDINATE")
      .map((evaluator) => evaluator.userId);
    const curators = rate.evaluators
      .filter((evaluator) => evaluator.type === "CURATOR")
      .map((evaluator) => evaluator.userId);
    const teamMembers = rate.evaluators
      .filter((evaluator) => evaluator.type === "TEAM_MEMBER")
      .map((evaluator) => evaluator.userId);

    const subbordinatesRates = indicatorRates.filter((rate) =>
      subbordinates.includes(rate.userId),
    );
    const curatorsRates = indicatorRates.filter((rate) =>
      curators.includes(rate.userId),
    );
    const teamMembersRates = indicatorRates.filter((rate) =>
      teamMembers.includes(rate.userId),
    );
    const selfRates = indicatorRates.filter(
      (rate) => rate.userId === rate.userId,
    );

    return {
      subbordinates:
        subbordinatesRates.reduce((acc, rate) => acc + rate.rate, 0) /
        subbordinates.length,
      curators:
        curatorsRates.reduce((acc, rate) => acc + rate.rate, 0) /
        curators.length,
      teamMembers:
        teamMembersRates.reduce((acc, rate) => acc + rate.rate, 0) /
        teamMembers.length,
      self:
        selfRates.reduce((acc, rate) => acc + rate.rate, 0) / selfRates.length,
      name: indicator.name,
      indicatorId: indicator.id,
      boundary: indicator.boundary,
    };
  },

  countCompetencyRates: (competency: Competency[], rate: Rate) => {
    return competency.map((competency) => {
      const indicators = competency.indicators;

      const indicatorRates = indicators.map((indicator) =>
        rateService.countIndicatorRates(indicator, rate),
      );

      const avgSubbordinates =
        indicatorRates.reduce((acc, rates) => acc + rates.subbordinates, 0) /
        indicatorRates.length;
      const avgCurators =
        indicatorRates.reduce((acc, rates) => acc + rates.curators, 0) /
        indicatorRates.length;
      const avgTeamMembers =
        indicatorRates.reduce((acc, rates) => acc + rates.teamMembers, 0) /
        indicatorRates.length;
      const avgSelf =
        indicatorRates.reduce((acc, rates) => acc + rates.self, 0) /
        indicatorRates.length;

      return {
        subbordinates: avgSubbordinates,
        curators: avgCurators,
        teamMembers: avgTeamMembers,
        self: avgSelf,
        name: competency.name,
        competencyId: competency.id,
        indicatorRates,
      };
    });
  },

  countCompetencyBlockRates: (blocks: CompetencyBlock[], rate: Rate) => {
    return blocks.map((block) => {
      const competencies = block.competencies;

      const competencyRates = rateService.countCompetencyRates(
        competencies,
        rate,
      );

      const avgSubbordinates =
        competencyRates.reduce((acc, rates) => acc + rates.subbordinates, 0) /
        competencyRates.length;
      const avgCurators =
        competencyRates.reduce((acc, rates) => acc + rates.curators, 0) /
        competencyRates.length;
      const avgTeamMembers =
        competencyRates.reduce((acc, rates) => acc + rates.teamMembers, 0) /
        competencyRates.length;
      const avgSelf =
        competencyRates.reduce((acc, rates) => acc + rates.self, 0) /
        competencyRates.length;

      return {
        subbordinates: avgSubbordinates,
        curators: avgCurators,
        teamMembers: avgTeamMembers,
        self: avgSelf,
        name: block.name,
        competencyBlockId: block.id,
        competencyRates,
      };
    });
  },
};

import { rate360Api } from '../api/rate360Api';
import { surveyApi } from '../api/surveyApi';
import { testsApi } from '../api/testsApi';

const useRatesCounter = () => {
  const { data: assigned } = rate360Api.useAssignedRatesQuery();
  const { data: confirmUser } = rate360Api.useConfirmByUserQuery();
  const { data: confirmCurator } = rate360Api.useConfirmByCuratorQuery();
  const { data: selfAssigned } = rate360Api.useSelfRatesQuery();

  const confirmCount =
    (confirmUser?.length ?? 0) + (confirmCurator?.length ?? 0);
  const assignedCount = [...(assigned ?? []), ...(selfAssigned ?? [])].filter(
    (a) => !a.finished,
  ).length;
  const sum = confirmCount + assignedCount;

  return sum;
};

const useTestsCounter = () => {
  const { data: assignedTests } = testsApi.useGetAssignedTestsQuery();
  return assignedTests?.filter((t) => !t.finished).length || 0;
};

const useSurveysCounter = () => {
  const { data: assignedSurveys } = surveyApi.useGetAssignedSurveysQuery();
  return assignedSurveys?.filter((s) => !s.finished).length || 0;
};

export { useRatesCounter, useTestsCounter, useSurveysCounter };

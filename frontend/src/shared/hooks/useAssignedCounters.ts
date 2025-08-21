import { useAppSelector } from '@/app';
import { rate360Api } from '../api/rate360Api';
import { surveyApi } from '../api/surveyApi';
import { testsApi } from '../api/testsApi';
import { caseApi } from '../api/caseApi';

const useAssignedRatesCounter = () => {
  const { data: assigned } = rate360Api.useAssignedRatesQuery();
  const userId = useAppSelector((state) => state.user.user?.id);

  const assignedCount = assigned?.filter(
    (a) =>
      !a.finished &&
      a.competencyBlocks.flatMap((b) =>
        b.competencies.flatMap((c) => c.indicators),
      ).length >
        a.userRates.filter((rate) => rate.approved && rate.userId === userId)
          .length,
  ).length;

  return assignedCount ?? 0;
};

const useAssignedSelfRatesCounter = () => {
  const { data: selfAssigned } = rate360Api.useSelfRatesQuery();
  const userId = useAppSelector((state) => state.user.user?.id);

  const assignedCount = selfAssigned?.filter(
    (a) =>
      !a.finished &&
      a.competencyBlocks.flatMap((b) =>
        b.competencies.flatMap((c) => c.indicators),
      ).length >
        a.userRates.filter((rate) => rate.approved && rate.userId === userId)
          .length,
  ).length;
  return assignedCount ?? 0;
};

const useConfirmRatesCounter = () => {
  const { data: confirmUser } = rate360Api.useConfirmByUserQuery();
  const { data: confirmCurator } = rate360Api.useConfirmByCuratorQuery();

  const confirmCount =
    (confirmUser?.length ?? 0) + (confirmCurator?.length ?? 0);

  return confirmCount;
};

const useRatesCounter = () => {
  const confirmCount = useConfirmRatesCounter();
  const assignedCount = useAssignedRatesCounter();
  const assignedSelfCount = useAssignedSelfRatesCounter();

  const sum = confirmCount + assignedCount + assignedSelfCount;

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

const useCasesCounter = () => {
  const { data: assignedCases } = caseApi.useGetAssignedCasesQuery();
  const userId = useAppSelector((state) => state.user.user?.id);
  return (
    assignedCases?.filter(
      (c) =>
        !c.finished &&
        c.userRates.filter((rate) => rate.userId === userId).length <
          c.cases.length,
    ).length || 0
  );
};

export {
  useRatesCounter,
  useTestsCounter,
  useSurveysCounter,
  useAssignedRatesCounter,
  useConfirmRatesCounter,
  useAssignedSelfRatesCounter,
  useCasesCounter,
};

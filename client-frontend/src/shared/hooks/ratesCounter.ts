import { userAtom } from "@/atoms/userAtom";
import { useAtomValue } from "jotai";
import {
  useGetAssignedRates,
  useGetConfirmCuratorRates,
  useGetConfirmRates,
  useGetSelfRates,
} from "./rates";
import { rateService } from "../lib/services/rateService";

const useAssignedRatesCounter = () => {
  const { data: assigned } = useGetAssignedRates();
  const userId = useAtomValue(userAtom)?.id;

  const assignedCount = assigned?.filter(
    (a) =>
      !a.finished &&
      rateService.getIndicators(a.competencyBlocks).length >
        a.userRates.filter((rate) => rate.approved && rate.userId === userId)
          .length,
  ).length;

  return assignedCount ?? 0;
};

const useAssignedSelfRatesCounter = () => {
  const { data: selfAssigned } = useGetSelfRates();
  const userId = useAtomValue(userAtom)?.id;

  const assignedCount = selfAssigned?.filter(
    (a) =>
      !a.finished &&
      rateService.getIndicators(a.competencyBlocks).length >
        a.userRates.filter((rate) => rate.approved && rate.userId === userId)
          .length,
  ).length;
  return assignedCount ?? 0;
};

const useConfirmRatesCounter = () => {
  const { data: confirmUser } = useGetConfirmRates();
  const { data: confirmCurator } = useGetConfirmCuratorRates();

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

// const useTestsCounter = () => {
//   const { data: assignedTests } = testsApi.useGetAssignedTestsQuery();
//   return assignedTests?.filter((t) => !t.finished).length || 0;
// };

// const useSurveysCounter = () => {
//   const { data: assignedSurveys } = surveyApi.useGetAssignedSurveysQuery();
//   return assignedSurveys?.filter((s) => !s.finished).length || 0;
// };

export {
  useRatesCounter,
  //   useTestsCounter,
  //   useSurveysCounter,
  useAssignedRatesCounter,
  useConfirmRatesCounter,
  useAssignedSelfRatesCounter,
};

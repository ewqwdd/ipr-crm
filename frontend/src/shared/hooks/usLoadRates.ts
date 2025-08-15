import { useAppSelector } from '@/app';
import { rate360Api } from '../api/rate360Api';
import { caseApi } from '../api/caseApi';

export const useLoadRates = () => {
  const user = useAppSelector((state) => state.user.user);
  const isMounted = useAppSelector((state) => state.user.isMounted);

  rate360Api.useAssignedRatesQuery(undefined, {
    skip: !isMounted || !user,
  });
  rate360Api.useConfirmByUserQuery(undefined, {
    skip: !isMounted || !user,
  });
  rate360Api.useConfirmByCuratorQuery(undefined, {
    skip: !isMounted || !user,
  });
  rate360Api.useSelfRatesQuery(undefined, {
    skip: !isMounted || !user,
  });
  caseApi.useGetAssignedCasesQuery(undefined, {
    skip: !isMounted || !user,
  });
};

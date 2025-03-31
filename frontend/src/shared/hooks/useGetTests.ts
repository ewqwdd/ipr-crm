import { useGetTestsQuery } from '@/shared/api/testsApi';
import { Test } from '@/entities/test';
import { useIsAdmin } from './useIsAdmin';

interface UseGetTestsResult {
  tests: Test[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
}

export const useGetTests = (): UseGetTestsResult => {
  const { data: tests, isLoading, isFetching } = useGetTestsQuery();
  const isAdmin = useIsAdmin();

  const filteredTests = tests?.filter((test: Test) => {
    if (isAdmin) return true;
    return !test.hidden;
  });

  return {
    tests: filteredTests,
    isLoading,
    isFetching,
  };
};

import { useAppSelector } from '@/app';
import { useGetTestsQuery } from '@/shared/api/testsApi';
import { Test } from '@/entities/test';

interface UseGetTestsResult {
  tests: Test[] | undefined;
  isLoading: boolean;
}

export const useGetTests = (): UseGetTestsResult => {
  const { data: tests, isLoading } = useGetTestsQuery();
  const user = useAppSelector((state) => state.user.user);

  const filteredTests = tests?.filter((test: Test) => {
    if (user?.role.name === 'admin') return true;
    return !test.hidden;
  });

  return {
    tests: filteredTests,
    isLoading,
  };
};

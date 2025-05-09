import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { Link } from 'react-router';
import TestTable from './table';
import { testsApi } from '@/shared/api/testsApi';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function Tests() {
  const { data: tests, isLoading, isFetching } = testsApi.useGetTestsQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <div className="sm:px-8 sm:py-10 py-3 flex flex-col h-full relative">
        <div className="flex justify-between items-center max-sm:pr-16 pl-3">
          <Heading title="Тесты" />
          <Link to="/tests/create">
            <PrimaryButton className="self-start">
              Создать новый тест
            </PrimaryButton>
          </Link>
        </div>
        <TestTable tests={tests || []} isFetching={isFetching} />
      </div>
    </LoadingOverlay>
  );
}

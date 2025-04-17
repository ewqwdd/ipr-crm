import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useNavigate } from 'react-router';
import TestTable from './table';
import { testsApi } from '@/shared/api/testsApi';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function Tests() {
  const navigate = useNavigate();
  const { data: tests, isLoading, isFetching } = testsApi.useGetTestsQuery();

  // TODO: replace loading

  return (
    <LoadingOverlay active={isLoading}>
      <div className="px-8 py-10 flex flex-col h-full relative">
        <div className="flex justify-between items-center">
          <Heading title="Тесты" />
          <PrimaryButton
            onClick={() => navigate('/tests/create')}
            className="self-start"
          >
            Создать новый тест
          </PrimaryButton>
        </div>
        <TestTable tests={tests || []} isFetching={isFetching} />
      </div>
    </LoadingOverlay>
  );
}

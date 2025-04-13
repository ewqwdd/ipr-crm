import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useNavigate } from 'react-router';
import TestTable from './table';
import { useEffect } from 'react';
import { useLoading } from '@/app/hooks/useLoading';
import { testsApi } from '@/shared/api/testsApi';

export default function Tests() {
  const navigate = useNavigate();
  const { data: tests, isLoading, isFetching } = testsApi.useGetTestsQuery();

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  return (
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
  );
}

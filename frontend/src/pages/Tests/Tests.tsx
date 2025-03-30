// import { useModal } from '@/app/hooks/useModal';
// import { $api } from '@/shared/lib/$api';
import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useNavigate } from 'react-router';
import TestTable from './table';
import { testsApi } from '@/shared/api/testsApi';
import { useEffect } from 'react';
import { useLoading } from '@/app/hooks/useLoading';

export default function Tests() {
  const navigate = useNavigate();
  const { data: tests, isLoading } = testsApi.useGetTestsQuery();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);
  // const { openModal } = useModal();

  // useEffect(() => {
  //   $api.get('/test');
  //   openModal('TEST_ASSIGN_USERS', {
  //     testId: 3,
  //   });
  // }, []);

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
      <TestTable tests={tests || []} />
    </div>
  );
}

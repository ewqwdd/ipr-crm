import { caseApi } from '@/shared/api/caseApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useNavigate, useParams } from 'react-router';
import AssignedCaseProgress from './ui/AssignedCaseProgress';
import { CaseRateItemDto } from '@/entities/cases/types/types';
import { useEffect } from 'react';

export default function AssignedCase() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = caseApi.useGetAssignedCaseQuery(id ?? '');
  const [mutate, { isLoading: mutateLoading, isSuccess }] =
    caseApi.useAnswerAssignedCaseMutation();
  const navigate = useNavigate();

  const handleSubmit = (rates: CaseRateItemDto[], globalComment?: string) => {
    mutate({ id: id!, rates, globalComment });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/assigned-cases');
    }
  }, [isSuccess]);

  return (
    <LoadingOverlay fullScereen active={isLoading}>
      <div className="sm:px-8 sm:py-10 p-3 flex flex-col h-full relative">
        <div>
          <Heading title="Кейсы" />
        </div>
        {data && (
          <AssignedCaseProgress
            loading={mutateLoading}
            onSubmit={handleSubmit}
            assignedCase={data}
          />
        )}
      </div>
    </LoadingOverlay>
  );
}

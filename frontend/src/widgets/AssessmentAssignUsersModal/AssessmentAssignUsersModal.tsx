import { useAppSelector } from '@/app';
import { Modal } from '@/shared/ui/Modal';
import { useEffect, useState } from 'react';
import AssessmentAssignUsersForm from './AssessmentAssignUsersForm';
import { testsApi } from '@/shared/api/testsApi';
import toast from 'react-hot-toast';
import { surveyApi } from '@/shared/api/surveyApi';
import { usersApi } from '@/shared/api/usersApi';

interface AssessmentAssignUsersModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function AssessmentAssignUsersModal({
  closeModal,
  isOpen,
  modalData,
}: AssessmentAssignUsersModalProps) {
  const { testId, surveyId } = modalData as {
    testId?: number;
    surveyId?: number;
  };
  const user = useAppSelector((state) => state.user.user);
  const role = user?.role;
  const [mutateTest, testState] = testsApi.useAssignUsersMutation();
  const [mutateSurvey, surveyState] = surveyApi.useAssignUsersMutation();

  const { data, isFetching } = usersApi.useGetUsersQuery({});
  const [selected, setSelected] = useState<number[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  const handleAssignUsers = () => {
    if (!selected.length) return toast.error('Выберите пользователей');
    if (testId) {
      mutateTest({ testId, userIds: selected, startDate: date });
    } else if (surveyId) {
      mutateSurvey({ surveyId, userIds: selected, startDate: date });
    }
  };

  useEffect(() => {
    if (testState.isSuccess || surveyState.isSuccess) {
      toast.success('Пользователи успешно назначены');
      closeModal();
    }
  }, [testState.isSuccess, surveyState.isSuccess]);

  useEffect(() => {
    if (testState.isError || surveyState.isError) {
      toast.error('Ошибка назначения пользователей');
    }
  }, [testState.isError, surveyState.isError]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      loading={isFetching || testState.isLoading}
      title="Назначить тест"
      onSubmit={handleAssignUsers}
    >
      <AssessmentAssignUsersForm
        role={role?.name}
        date={date}
        setDate={setDate}
        selected={selected}
        setSelected={setSelected}
        users={data?.users ?? []}
      />
    </Modal>
  );
}

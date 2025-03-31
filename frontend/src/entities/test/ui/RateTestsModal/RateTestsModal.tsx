import { Modal } from '@/shared/ui/Modal';
import { FC } from 'react';
import { CheckCircleIcon, MinusCircleIcon } from '@heroicons/react/outline';
import { testsApi } from '@/shared/api/testsApi';
import { Progress } from '@/shared/ui/Progress';

type TestResult = {
  username: string;
  score: number;
  total: number;
};

type RateTestsModalProps = {
  isOpen: boolean;
  modalData: {
    testName: string;
    results: TestResult[];
  };
  closeModal: () => void;
};

const RateTestsModal: FC<RateTestsModalProps> = ({
  closeModal,
  isOpen,
  modalData,
}) => {
  const { testId } = modalData as { testId?: number };
  const { data: finishedTests, isLoading: finishedTestsLoading } =
    testsApi.useGetTestsQuery();

  const test = finishedTests?.find((test) => test.id === testId);
  const users = test?.usersAssigned?.map((user) => {
    return {
      id: `${user.userId}_${testId}`,
      name: `${user.user?.firstName} ${user.user?.lastName}`,
      percent: user.finished ? 100 : 0,
    };
  });

  const loading = finishedTestsLoading;

  return (
    <Modal
      title="Статистика"
      open={isOpen}
      setOpen={closeModal}
      footer={false}
      loading={loading}
    >
      <div className="flex flex-col">
        <div className="text-sm text-gray-500 mb-4">
          Тест: {modalData?.testName}
        </div>
        <div className="flex flex-col divide-y divide-gray-200">
          {users?.map(({ id, name, percent }) => (
            <div
              key={id}
              className="flex items-center justify-between py-3 gap-4"
            >
              <div className="flex items-center gap-2">
                {percent === 100 ? (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                ) : (
                  <MinusCircleIcon className="h-5 w-5 text-red-500" />
                )}
                <span className="text-gray-900">{name}</span>
              </div>
              <Progress percent={percent} className="min-w-20" />
            </div>
          ))}
        </div>
        {users?.length === 0 && (
          <div className="text-gray-500 text-sm text-center py-4">
            Нет завершенных тестов
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RateTestsModal;

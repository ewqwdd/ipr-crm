import { Modal } from '@/shared/ui/Modal';
import { FC } from 'react';
import { testsApi } from '@/shared/api/testsApi';
import { TestResultScore } from '@/shared/ui/TestResultScore';
import { testScoreCount } from '@/shared/lib/testScoreCount';

type RateTestsModalProps = {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
};

const RateTestsModal: FC<RateTestsModalProps> = ({
  closeModal,
  isOpen,
  modalData,
}) => {
  const { testId, testName } = modalData as {
    testId?: number;
    testName?: string;
  };
  const { data: finishedTests, isLoading: finishedTestsLoading } =
    testsApi.useGetTestsQuery();

  const test = finishedTests?.find((test) => test.id === testId);
  const users = test?.usersAssigned?.map((user) => {
    const { score, questionsCount } = testScoreCount(user, test);
    return {
      id: `${user.userId}_${testId}`,
      name: `${user.user?.firstName} ${user.user?.lastName}`,
      finished: user.finished,
      score,
      questionsCount,
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
        <div className="text-sm text-gray-500 mb-4">Тест: {testName}</div>
        <div className="flex flex-col divide-y divide-gray-200">
          {users?.map(({ id, name, finished, questionsCount, score }) => (
            <div
              key={id}
              className="flex items-center justify-between py-3 gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-900">{name}</span>
                {test && (
                  <TestResultScore
                    test={{ test, questionsCount, score }}
                    finished={finished}
                  />
                )}
              </div>
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

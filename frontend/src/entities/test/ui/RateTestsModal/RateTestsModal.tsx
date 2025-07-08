import { Modal } from '@/shared/ui/Modal';
import { FC, useState } from 'react';
import { testsApi } from '@/shared/api/testsApi';
import { TestResultScore } from '@/shared/ui/TestResultScore';
import { Pagination } from '@/shared/ui/Pagination';
import { usersService } from '@/shared/lib/usersService';
import { generalService } from '@/shared/lib/generalService';
import { SoftButton } from '@/shared/ui/SoftButton';
import { XIcon } from '@heroicons/react/outline';

type RateTestsModalProps = {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
};

const LIMIT = 10;

const RateTestsModal: FC<RateTestsModalProps> = ({
  closeModal,
  isOpen,
  modalData,
}) => {
  const { testId, testName } = modalData as {
    testId?: number;
    testName?: string;
  };
  const [page, setPage] = useState(1);
  const { data: finishedTests, isLoading: finishedTestsLoading } =
    testsApi.useGetTestsQuery();
  const [removeAssigned, removeAssignedState] =
    testsApi.useRemoveAssignedMutation();

  const test = finishedTests?.find((test) => test.id === testId);
  const users = test?.usersAssigned?.map((user) => {
    const { score, maxScore } = generalService.testScoreCount(user, test);
    return {
      id: `${user.userId}_${testId}`,
      name: usersService.displayName(user.user),
      finished: user.finished,
      score,
      questionsCount: maxScore,
      userId: user.userId,
    };
  });

  const loading = finishedTestsLoading || removeAssignedState.isLoading;

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
          {users
            ?.slice((page - 1) * LIMIT, LIMIT * page)
            ?.map(({ id, name, finished, questionsCount, score, userId }) => (
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
                <SoftButton
                  danger
                  className="p-1 rounded-full"
                  onClick={() => testId && removeAssigned({ testId, userId })}
                >
                  <XIcon className="size-4" />
                </SoftButton>
              </div>
            ))}
        </div>
        {users && users.length > LIMIT && (
          <Pagination
            limit={LIMIT}
            page={page}
            setPage={setPage}
            count={users.length}
          />
        )}
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

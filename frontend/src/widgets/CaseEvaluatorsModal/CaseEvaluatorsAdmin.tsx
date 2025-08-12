import { CaseRate } from '@/entities/cases';
import { caseApi } from '@/shared/api/caseApi';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { cva } from '@/shared/lib/cva';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { UserMultiSelect } from '@/shared/ui/UserMultiSelect';
import { Option } from '@/shared/ui/UserMultiSelect/UserMultiSelect';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { MultiValue } from 'react-select';

interface CaseEvaluatorsModalProps {
  data: CaseRate;
  closeModal: () => void;
}

export default function CaseEvaluatorsAdmin({
  closeModal,
  data,
}: CaseEvaluatorsModalProps) {
  const [evaluatorError, setEvaluatorError] = useState('');
  const [evaluator, setEvaluator] = useState<MultiValue<Option>>([]);

  const { data: users, isLoading: usersLoading } = usersApi.useGetUsersQuery();

  const [mutate, { isLoading, isSuccess }] = caseApi.useSetEvaluatorsMutation();

  useLayoutEffect(() => {
    if (data) {
      setEvaluator(
        data.evaluators.map((evaluator) => ({
          label: evaluator.user.username,
          value: evaluator.userId,
        })),
      );
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess]);

  const filteredUsers = useMemo(() => {
    return users?.users.filter((user) => user.id !== data.userId) ?? [];
  }, [users, data]);

  return (
    <>
      <span
        className={cva('text-gray-800 mb-0.5 font-semibold text-sm mt-2', {
          'animate-pulse pointer-events-none': usersLoading || isLoading,
        })}
      >
        Оценивающе
      </span>
      <UserMultiSelect
        users={filteredUsers}
        onChange={(u) => {
          setEvaluator(u);
          setEvaluatorError('');
        }}
        value={evaluator}
      />
      {evaluatorError && (
        <span className="text-red-500 text-sm">{evaluatorError}</span>
      )}
      <div className="pt-3 gap-3 sm:flex sm:flex-row-reverse">
        <PrimaryButton
          onClick={() =>
            mutate({
              rateId: data.id,
              evaluators: evaluator.map((evaluator) => evaluator.value),
            })
          }
        >
          Подтвердить
        </PrimaryButton>
        <SecondaryButton
          onClick={() => {
            closeModal();
          }}
        >
          Отмена
        </SecondaryButton>
      </div>
    </>
  );
}

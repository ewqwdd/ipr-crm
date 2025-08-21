import { usersApi } from '@/shared/api/usersApi/usersApi';
import { UserMultiSelect } from '@/shared/ui/UserMultiSelect';
import { Option } from '@/shared/ui/UserMultiSelect/UserMultiSelect';
import { useMemo } from 'react';
import { MultiValue } from 'react-select';

interface CaseEvaluatorsProps {
  setUser: (user: MultiValue<Option>) => void;
  setEvaluator: (user: MultiValue<Option>) => void;
  user: MultiValue<Option>;
  evaluator: MultiValue<Option>;

  evaluatorError: string;
  userError: string;

  setUserError: (error: string) => void;
  setEvaluatorError: (error: string) => void;
}

export default function CaseEvaluators({
  setUser,
  setEvaluator,
  evaluator,
  setEvaluatorError,
  setUserError,
  user,
  evaluatorError,
  userError,
}: CaseEvaluatorsProps) {
  const { data: users } = usersApi.useGetUsersQuery();

  const filteredEvaluators = useMemo(() => {
    return users?.users.filter((ev) => !user?.some((u) => u.value === ev.id));
  }, [users, user]);

  return (
    <>
      <span className="text-gray-800 mb-0.5 font-semibold text-sm">
        Оцениваемые
      </span>
      <UserMultiSelect
        users={users?.users ?? []}
        onChange={(user) => {
          setUser(user);
          setUserError('');
        }}
        value={user}
      />
      {userError && <span className="text-red-500 text-sm">{userError}</span>}
      <span className="text-gray-800 mb-0.5 font-semibold text-sm mt-2">
        Оценивающе
      </span>
      <UserMultiSelect
        users={filteredEvaluators ?? []}
        onChange={(u) => {
          setEvaluator(u);
          setEvaluatorError('');
        }}
        value={evaluator}
      />
      {evaluatorError && (
        <span className="text-red-500 text-sm">{evaluatorError}</span>
      )}
    </>
  );
}

import { useAppSelector } from '@/app';
import { CaseEvaluators } from '@/features/case/CaseEvaluators';
import { caseApi } from '@/shared/api/caseApi';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { Checkbox } from '@/shared/ui/Checkbox';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { Option } from '@/shared/ui/UserMultiSelect/UserMultiSelect';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MultiValue } from 'react-select';

interface CaseRateCreateModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

interface ErrorState {
  user?: string;
  evaluators?: string;
  cases?: string;
}

export default function CaseRateCreateModal({
  closeModal,
  isOpen,
}: CaseRateCreateModalProps) {
  const currentUser = useAppSelector((state) => state.user.user);
  const [user, setUser] = useState<MultiValue<Option>>([]);
  const [evaluator, setEvaluator] = useState<MultiValue<Option>>([
    {
      label: currentUser!.username,
      value: currentUser!.id,
    },
  ]);
  const [mutate, { isLoading }] = caseApi.useCreateCaseRateMutation();

  const [commentEnabled, setCommentEnabled] = useState<boolean>(false);
  const [selectedCases, setSelectedCases] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [errorState, setErrorState] = useState<ErrorState>({});

  const { isLoading: usersLoading } = usersApi.useGetUsersQuery();
  const { data: cases, isLoading: casesLoading } = caseApi.useGetCasesQuery();

  const filteredCases = useMemo(
    () =>
      cases?.filter((caseItem) =>
        caseItem.name.toLowerCase().includes(search.toLowerCase()),
      ) ?? [],
    [cases, search],
  );

  const isCheckedAll = useMemo(() => {
    return selectedCases.length === filteredCases.length;
  }, [selectedCases, filteredCases]);
  const handleCheckAll = () => {
    if (isCheckedAll) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredCases.map((caseItem) => caseItem.id));
    }
  };

  const handleSubmit = async () => {
    const errors: ErrorState = {};
    if (!user || user.length === 0) {
      errors.user = 'Выберите хотя бы одного оцениваемого';
    }
    if (!evaluator || evaluator.length === 0) {
      errors.evaluators = 'Выберите хотя бы одного оценивающего';
    }
    if (!selectedCases || selectedCases.length === 0) {
      errors.cases = 'Выберите хотя бы один кейс';
    }
    setErrorState(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      await mutate({
        users: user!.map((u) => u.value),
        evaluators: evaluator.map((e) => e.value),
        cases: selectedCases,
        globalCommentsEnabled: commentEnabled,
      }).unwrap();
      closeModal();
    } catch (e) {
      toast.error('Произошла ошибка');
      console.error(e);
    }
  };

  return (
    <Modal
      loading={usersLoading || casesLoading || isLoading}
      open={isOpen}
      setOpen={closeModal}
      title="Создание опроса"
      footer={false}
      className="sm:max-w-xl"
    >
      <div className="flex flex-col mt-4">
        <CaseEvaluators
          setEvaluatorError={(err) =>
            setErrorState({ ...errorState, evaluators: err })
          }
          setUserError={(err) => setErrorState({ ...errorState, user: err })}
          evaluator={evaluator}
          setEvaluator={setEvaluator}
          evaluatorError={errorState.evaluators || ''}
          user={user}
          setUser={setUser}
          userError={errorState.user || ''}
        />
        <span className="text-gray-800 mt-4 font-semibold text-sm">
          Выберите кейсы
        </span>
        <InputWithLabelLight
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Поиск"
          className="shadow-none"
          inputClassName="rounded-b-none py-1"
        />
        <div className="flex flex-col gap-2 overflow-y-auto max-h-80 p-2 bg-gray-100/80 rounded-b-xl shadow-inner mb-4">
          <Checkbox
            checked={isCheckedAll}
            onChange={handleCheckAll}
            title="Выбрать все"
            className="[&_label]:font-semibold"
          />
          {filteredCases?.map((caseItem) => (
            <Checkbox
              checked={selectedCases.includes(caseItem.id)}
              onChange={() => {
                setErrorState({ ...errorState, cases: '' });
                if (selectedCases.includes(caseItem.id)) {
                  setSelectedCases(
                    selectedCases.filter((id) => id !== caseItem.id),
                  );
                } else {
                  setSelectedCases([...selectedCases, caseItem.id]);
                }
              }}
              title={caseItem.name}
              className="items-start"
            />
          ))}
        </div>
        {errorState.cases && (
          <span className="text-red-500 text-sm">{errorState.cases}</span>
        )}

        <Checkbox
          checked={commentEnabled}
          onChange={() => setCommentEnabled(!commentEnabled)}
          title="Глобальный комментарий включен"
        />
        <PrimaryButton className="mt-5" onClick={handleSubmit}>
          Подтвердить
        </PrimaryButton>
      </div>
    </Modal>
  );
}

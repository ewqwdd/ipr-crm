import { useAppDispatch } from '@/app';
import { useModal } from '@/app/hooks/useModal';
import { ratesActions } from '@/entities/rates/model/rateSlice';
import { EvaluateUser, EvaulatorType } from '@/entities/rates/types/types';
import { Badge } from '@/shared/ui/Badge';
import { SoftButton } from '@/shared/ui/SoftButton';
import { XIcon } from '@heroicons/react/outline';
import { memo } from 'react';

interface EvaluatorsItemProps {
  evaluators: EvaluateUser[];
  title: string;
  teamId?: number;
  specId: number;
  userId: number;
  type: EvaulatorType;
}

export default memo(
  function EvaluatorsItem({
    evaluators,
    title,
    specId,
    teamId,
    userId,
    type,
  }: EvaluatorsItemProps) {
    const dispatch = useAppDispatch();
    const { openModal } = useModal();

    const onDelete = (evaluatorId: number) => {
      dispatch(
        ratesActions.removeEvaluator({
          teamId,
          specId,
          userId,
          evaluatorId,
          type,
        }),
      );
    };

    const onAdd = () => {
      openModal('ADD_EVALUATOR', { type, userId, teamId, specId });
    };

    return (
      <div className="flex gap-4 flex-col">
        <div className="flex gap-2 sm:items-center text-sm text-gray-600 font-medium border-b-gray-400 border-b pb-2 justify-between max-sm:flex-col-reverse max-sm:text-xs">
          {title}
          <SoftButton
            size="xs"
            className="shadow-none py-0 max-sm:px-0 max-sm:justify-start"
            onClick={onAdd}
          >
            Добавить
          </SoftButton>
        </div>
        <div className="flex gap-2 flex-wrap">
          {evaluators.map((evaluator) => (
            <Badge key={evaluator.userId} color="purple" size="md">
              {evaluator.username}
              <button
                className="ml-1 hover:opacity-50 transition-all"
                onClick={() => onDelete(evaluator.userId)}
              >
                <XIcon className="size-4" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  },
  (prev, next) => {
    // если что-то изменилось — нужно ререндерить → return false
    if (
      prev.userId !== next.userId ||
      prev.teamId !== next.teamId ||
      prev.specId !== next.specId ||
      prev.type !== next.type ||
      prev.title !== next.title ||
      prev.evaluators.length !== next.evaluators.length
    ) {
      return false;
    }

    // сравниваем каждый элемент в массиве по userId
    for (let i = 0; i < prev.evaluators.length; i++) {
      if (prev.evaluators[i].userId !== next.evaluators[i].userId) {
        return false;
      }
    }

    // всё одинаково — можно не ререндерить
    return true;
  },
);

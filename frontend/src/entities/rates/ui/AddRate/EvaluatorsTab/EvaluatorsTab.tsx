import { useAppDispatch, useAppSelector } from '@/app';
import { teamsApi } from '@/shared/api/teamsApi';
import { TabType } from '../AddRate';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import {
  EvaluateUser,
  EvaulatorType,
  Rate,
} from '@/entities/rates/types/types';
import { ratesActions } from '@/entities/rates/model/rateSlice';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { cva } from '@/shared/lib/cva';
import { rate360Api } from '@/shared/api/rate360Api';
import toast from 'react-hot-toast';
import { TeamItem } from '../../EvaluatorsTeamForm';
import { getInitialEvaluators } from '@/entities/rates/model/getInitialEvaluators';

interface EvaluatorsTabProps {
  setTab: (tab: TabType) => void;
  skillTypes: string[];
  closeModal: () => void;
  rateType: Rate['rateType'];
}

export interface TeamItemIds {
  teamId?: number;
  specId: number;
  userId: number;
  evaluateCurators: EvaluateUser[];
  evaluateTeam: EvaluateUser[];
  evaluateSubbordinate: EvaluateUser[];
}

interface OnDeleteArgs {
  evaluatorId: number;
  teamId: number;
  specId: number;
  userId: number;
  type: EvaulatorType;
}

interface OnSubmitArgs {
  evaluators: EvaluateUser[];
  teamId: number;
  specId: number;
  userId: number;
  type: EvaulatorType;
}

export default function EvaluatorsTab({
  setTab,
  skillTypes,
  closeModal,
  rateType,
}: EvaluatorsTabProps) {
  const { data, isFetching } = teamsApi.useGetTeamsQuery();
  const [addRate, { isLoading, isSuccess, isError }] =
    rate360Api.useCreateRateMutation();
  const selectedSpecs = useAppSelector((state) => state.rates.selectedSpecs);
  const confirmCurator = useAppSelector((state) => state.rates.confirmCurator);
  const confirmUser = useAppSelector((state) => state.rates.confirmUser);

  const dispatch = useAppDispatch();

  const teamIds = useMemo<TeamItemIds[]>(
    () =>
      selectedSpecs?.flatMap((s) =>
        s.specs.map((spec) => ({ teamId: s.teamId, ...spec })),
      ),
    [selectedSpecs],
  );
  useLayoutEffect(() => {
    const updated = getInitialEvaluators(selectedSpecs, rateType, data?.list);
    dispatch(ratesActions.setSpecs(updated));
  }, []);

  useEffect(() => {
    if (isSuccess) {
      closeModal();
      toast.success('Оценка успешно добавлена');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка при добавлении оценки');
    }
  }, [isError]);

  const onDelete = useCallback((data: OnDeleteArgs) => {
    dispatch(ratesActions.removeEvaluator(data));
  }, []);

  const onSubmit = useCallback((data: OnSubmitArgs) => {
    dispatch(ratesActions.setSpecsForUser(data));
  }, []);

  return (
    <>
      <div
        className={cva('flex gap-2 max-sm:flex-col max-sm:text-left', {
          'animate-pulse pointer-events-none': isFetching || isLoading,
        })}
      >
        <div className="flex gap-2 flex-col flex-1">
          <h3 className="text-lg text-gray-800 mt-3">Окружение</h3>
          <p className="text-sm text-gray-500 -mt-1">
            Выберите оценивающих экспертов
          </p>
          <p className="text-sm text-gray-500 -mt-2">
            Включены комментарии к каждой компетенции при прохождении оценки
          </p>

          <div className="flex gap-2 font-medium">
            <span className="text-sm text-gray-500">Навыки</span>
            <span className="text-sm text-gray-800">
              {skillTypes?.join(', ')}
            </span>
          </div>
        </div>
        <div className="gap-4 mt-4 flex justify-end items-start">
          <SecondaryButton onClick={() => setTab('specs')}>
            Назад
          </SecondaryButton>
          <PrimaryButton
            onClick={() =>
              addRate({
                rate: selectedSpecs,
                skill: skillTypes,
                confirmCurator,
                confirmUser,
                rateType,
              })
            }
            disabled={isLoading}
          >
            Добавить оценку
          </PrimaryButton>
        </div>
      </div>
      <div className="gap-4 flex flex-col">
        {teamIds.map((teamId) => (
          <TeamItem
            key={`${teamId.teamId}_${teamId.userId}_${teamId.specId}`}
            teamId={teamId}
            onDelete={onDelete}
            onSubmit={onSubmit}
          />
        ))}
      </div>
    </>
  );
}

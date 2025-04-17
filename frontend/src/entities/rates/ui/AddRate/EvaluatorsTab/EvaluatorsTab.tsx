import { useAppDispatch, useAppSelector } from '@/app';
import { teamsApi } from '@/shared/api/teamsApi';
import { TabType } from '../AddRate';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import TeamItem from './TeamItem';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { EvaluateUser, Rate } from '@/entities/rates/types/types';
import { ratesActions } from '@/entities/rates/model/rateSlice';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { cva } from '@/shared/lib/cva';
import { rate360Api } from '@/shared/api/rate360Api';
import toast from 'react-hot-toast';

interface EvaluatorsTabProps {
  setTab: (tab: TabType) => void;
  skillTypes: string[];
  closeModal: () => void;
  rateType: Rate['rateType'];
}

export interface TeamItemIds {
  teamId: number;
  specId: number;
  userId: number;
  evaluateCurators: EvaluateUser[];
  evaluateTeam: EvaluateUser[];
  evaluateSubbordinate: EvaluateUser[];
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

  console.log(teamIds);
  useLayoutEffect(() => {
    const updated = selectedSpecs.map((s) => {
      const team = data?.list.find((t) => t.id === s.teamId);
      const teamUsers =
        team?.users?.map((u) => ({
          userId: u.user.id,
          username: u.user.username,
        })) ?? [];
      const teamCurators = team?.curator
        ? [{ userId: team.curator.id, username: team.curator.username }]
        : [];
      const updatedSpecs = s.specs.map((spec) => ({
        ...spec,
        evaluateCurators: teamCurators.filter((c) => c.userId !== spec.userId),
        evaluateTeam:
          rateType === 'Rate360'
            ? teamUsers.filter((c) => c.userId !== spec.userId)
            : [],
        evaluateSubbordinate: [],
      }));
      return {
        ...s,
        specs: updatedSpecs,
      };
    });
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

  return (
    <>
      <div
        className={cva('flex gap-2', {
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
          />
        ))}
      </div>
    </>
  );
}

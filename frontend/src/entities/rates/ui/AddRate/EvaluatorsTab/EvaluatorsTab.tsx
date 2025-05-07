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
    const updated = selectedSpecs.map((s) => {
      const team = data?.list.find((t) => t.id === s.teamId);
      const subTeams = data?.list.filter((t) => t.parentTeamId === s.teamId);
      const teamUsers =
        team?.users?.map((u) => ({
          userId: u.user.id,
          username: u.user.username,
        })) ?? [];
      const teamCurator = team?.curator && {
        userId: team.curator.id,
        username: team.curator.username,
      };

      const parentTeam = data?.list.find((t) => t.id === team?.parentTeamId);

      const updatedSpecs = s.specs.map((spec) => {
        const isCurator = team?.curator?.id === spec.userId;

        const evaluateCurators = [
          teamCurator?.userId === spec.userId
            ? parentTeam?.curator &&
              parentTeam?.curator.id !== spec.userId && {
                userId: parentTeam?.curator.id,
                username: parentTeam?.curator.username,
              }
            : teamCurator,
        ].filter((c) => !!c && c.userId !== spec.userId) as EvaluateUser[];

        const evaluateTeam =
          rateType === 'Rate360'
            ? (teamUsers.filter(
                (c) =>
                  c.userId !== spec.userId &&
                  !evaluateCurators.find(
                    (curator) => curator.userId === c.userId,
                  ) &&
                  c.userId !== spec.userId,
              ) as EvaluateUser[])
            : [];

        const evaluateSubbordinate =
          (subTeams
            ?.map((t) =>
              t.curator
                ? { userId: t.curator.id, username: t.curator.username }
                : undefined,
            )
            .filter(
              (t) =>
                !!t &&
                !evaluateCurators.find(
                  (curator) => curator.userId === t.userId,
                ) &&
                !evaluateTeam.find(
                  (teamMember) => teamMember.userId === t.userId,
                ) &&
                t.userId !== spec.userId,
            ) as EvaluateUser[]) ?? [];

        return {
          ...spec,
          evaluateCurators,
          evaluateTeam: evaluateTeam,
          evaluateSubbordinate: isCurator ? evaluateSubbordinate : [],
        };
      });
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

  const onDelete = useCallback(
    ({
      evaluatorId,
      specId,
      teamId,
      type,
      userId,
    }: {
      evaluatorId: number;
      teamId: number;
      specId: number;
      userId: number;
      type: EvaulatorType;
    }) => {
      dispatch(
        ratesActions.removeEvaluator({
          teamId,
          specId,
          userId,
          evaluatorId,
          type,
        }),
      );
    },
    [],
  );

  const onSubmit = useCallback(
    ({
      evaluators,
      specId,
      teamId,
      type,
      userId,
    }: {
      evaluators: EvaluateUser[];
      teamId: number;
      specId: number;
      userId: number;
      type: EvaulatorType;
    }) => {
      dispatch(
        ratesActions.setSpecsForUser({
          teamId,
          specId,
          userId,
          type,
          evaluators,
        }),
      );
    },
    [],
  );

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

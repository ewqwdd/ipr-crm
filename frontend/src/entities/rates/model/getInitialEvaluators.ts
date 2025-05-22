import { Team } from '@/entities/team';
import { AddRateDto, EvaluateUser, Rate } from '../types/types';

export const getInitialEvaluators = (
  selectedSpecs: AddRateDto[],
  rateType: Rate['rateType'],
  list?: Team[],
): AddRateDto[] =>
  selectedSpecs.map((s) => {
    const team = list?.find((t) => t.id === s.teamId);
    const subTeams = list?.filter((t) => t.parentTeamId === s.teamId);
    const parentTeam = list?.find((t) => t.id === team?.parentTeamId);

    const teamUsers =
      team?.users?.map((u) => ({
        userId: u.user.id,
        username: u.user.username,
      })) ?? [];

    const teamCurator = team?.curator && {
      userId: team.curator.id,
      username: team.curator.username,
    };

    const updatedSpecs = s.specs.map((spec) => {
      const isCurator = team?.curator?.id === spec.userId;
      const noValidCurator =
        !teamCurator || teamCurator?.userId === spec.userId;
      const isValidParentCurator =
        !!parentTeam?.curator && parentTeam?.curator.id !== spec.userId;

      const evaluateCurators = [
        noValidCurator
          ? isValidParentCurator && {
              userId: parentTeam.curator!.id,
              username: parentTeam.curator!.username,
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
                ),
            ) as EvaluateUser[])
          : [];

      const evaluateSubbordinate =
        rateType === 'Rate360' && subTeams
          ? (subTeams
              .map((t) =>
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
              ) as EvaluateUser[])
          : [];

      return {
        ...spec,
        evaluateCurators,
        evaluateTeam: isCurator ? [] : evaluateTeam,
        evaluateSubbordinate: isCurator
          ? [...evaluateSubbordinate, ...evaluateTeam]
          : [],
      };
    });

    return {
      ...s,
      specs: updatedSpecs,
    };
  });

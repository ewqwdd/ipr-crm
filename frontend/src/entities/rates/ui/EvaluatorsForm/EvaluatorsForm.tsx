import EvaluatorTeam from './partials/EvaluatorTeam';
import NoTeamEvaluators from './partials/NoTeamEvaluators';
import React, { memo, useLayoutEffect, useMemo } from 'react';
import { AddRateDto, EvaluateUser } from '../../types/types';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';
import { useFilteredTeams } from '../../hooks/useFilteredTeams';
import { teamsApi } from '@/shared/api/teamsApi';
import { EvaulatorType } from '@/shared/types/AssesmentBaseType';

interface EvaluatorsFormProps {
  teamId?: number;
  specId: number;
  userId: number;
  type: EvaulatorType;
  selected: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
  selectedSpecs: AddRateDto[];
  teams?: MultiValue<Option>;
  specs?: MultiValue<Option>;
  search?: string;
}

export default memo(function EvaluatorsForm({
  type,
  userId,
  teamId,
  specId,
  selected = [],
  setSelected,
  selectedSpecs,
  search = '',
  teams = [],
  specs = [],
}: EvaluatorsFormProps) {
  const { data } = teamsApi.useGetTeamsQuery();

  const teamSpecs = useMemo(
    () => selectedSpecs.find((s) => s.teamId === teamId)?.specs ?? [],
    [selectedSpecs, teamId],
  );
  const current = useMemo(
    () => teamSpecs.find((s) => s.specId === specId && s.userId === userId),
    [teamSpecs, specId],
  );

  let evaluators;
  const excluded: EvaluateUser[] = [{ userId }];
  if (type === 'CURATOR') {
    evaluators = current?.evaluateCurators;
    excluded.push(
      ...(current?.evaluateSubbordinate ?? []),
      ...(current?.evaluateTeam ?? []),
    );
  } else if (type === 'TEAM_MEMBER') {
    evaluators = current?.evaluateTeam;
    excluded.push(
      ...(current?.evaluateCurators ?? []),
      ...(current?.evaluateSubbordinate ?? []),
    );
  } else {
    evaluators = current?.evaluateSubbordinate;
    excluded.push(
      ...(current?.evaluateCurators ?? []),
      ...(current?.evaluateTeam ?? []),
    );
  }

  useLayoutEffect(() => {
    if (evaluators) {
      setSelected(
        evaluators.map((e) => ({ userId: e.userId, username: e.username })),
      );
    }
  }, [evaluators]);

  const filteredTeams = useFilteredTeams({ specs, teams, search });

  const evaluateTeam = useMemo(
    () => data?.list.find((t) => t.id === teamId),
    [data, teamId],
  );

  return (
    <div className="flex flex-col gap-4 pt-4">
      {teams.length === 0 && (
        <NoTeamEvaluators
          setSelected={setSelected}
          excluded={excluded}
          selected={selected}
          evaluateTeam={evaluateTeam}
          type={type}
          search={search}
        />
      )}
      {filteredTeams?.map((team) => (
        <EvaluatorTeam
          excluded={excluded}
          selected={selected}
          setSelected={setSelected}
          key={team.id}
          team={team}
          evaluateTeam={evaluateTeam}
          type={type}
        />
      ))}
    </div>
  );
});

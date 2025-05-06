import EvaluatorTeam from './partials/EvaluatorTeam';
import NoTeamEvaluators from './partials/NoTeamEvaluators';
import React, { memo, useLayoutEffect, useMemo, useState } from 'react';
import { AddRateDto, EvaluateUser, EvaulatorType } from '../../types/types';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';
import { useFilteredTeams } from '../../hooks/useFilteredTeams';
import TeamFilters from '../SelectSpecsForm/partials/TeamFilters';
import { teamsApi } from '@/shared/api/teamsApi';

interface EvaluatorsFormProps {
  teamId?: number;
  specId: number;
  userId: number;
  type: EvaulatorType;
  selected: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
  selectedSpecs: AddRateDto[];
}

export default memo(function EvaluatorsForm({
  type,
  userId,
  teamId,
  specId,
  selected = [],
  setSelected,
  selectedSpecs,
}: EvaluatorsFormProps) {
  const [teams, setTeams] = useState<MultiValue<Option>>([]);
  const [specs, setSpecs] = useState<MultiValue<Option>>([]);
  const [search, setSearch] = useState('');

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
      <TeamFilters
        search={search}
        setSearch={setSearch}
        specs={specs}
        setSpecs={setSpecs}
        teams={teams}
        setTeams={setTeams}
      />
      <NoTeamEvaluators
        setSelected={setSelected}
        excluded={excluded}
        selected={selected}
        evaluateTeam={evaluateTeam}
        type={type}
      />
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

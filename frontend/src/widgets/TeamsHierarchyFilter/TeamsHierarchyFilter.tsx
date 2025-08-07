import { useAppSelector } from '@/app';
import { Team } from '@/entities/team';
import { teamsApi } from '@/shared/api/teamsApi';
import { SearchSelect } from '@/shared/ui/SearchSelect';
import { useMemo } from 'react';
import { type TeamsHierarchyFilterType } from './types';

interface TeamItem {
  name: string;
  id: number;
  parentId?: number;
}

const map = (teams?: Team[]) =>
  teams?.map((team) => ({
    id: team.id,
    name: team.name,
    parentId: team.parentTeamId,
  })) ?? [];

interface TeamsHierarchyFilterProps {
  filters?: TeamsHierarchyFilterType;
  onChange?: (filters: TeamsHierarchyFilterType) => void;
}

export default function TeamsHierarchyFilter({
  filters,
  onChange,
}: TeamsHierarchyFilterProps) {
  const access = useAppSelector((state) => state.user.user?.teamAccess);
  const { data } = teamsApi.useGetTeamsQuery();
  const structure = data?.structure;

  const availableProducts = useMemo<TeamItem[]>(
    () => map(structure?.filter((team) => access?.includes(team.id))),
    [structure, access],
  );

  const productNames = useMemo<string[]>(
    () => Array.from(new Set(availableProducts.map((team) => team.name))),
    [availableProducts],
  );

  const allDepartments = useMemo<Team[]>(
    () => data?.structure?.flatMap((team) => team.subTeams ?? []) ?? [],
    [data?.structure],
  );

  const availableDepartments = useMemo<TeamItem[]>(
    () => allDepartments?.filter((team) => access?.includes(team.id)) ?? [],
    [allDepartments, access],
  );

  const departmentNames = useMemo<string[]>(
    () => Array.from(new Set(availableDepartments.map((team) => team.name))),
    [availableDepartments],
  );

  const allDirections = useMemo<Team[]>(
    () => allDepartments?.flatMap((team) => team.subTeams ?? []) ?? [],
    [allDepartments],
  );

  const availableDirections = useMemo<TeamItem[]>(
    () => allDirections?.filter((team) => access?.includes(team.id)) ?? [],
    [allDirections, access],
  );

  const directionNames = useMemo<string[]>(
    () => Array.from(new Set(availableDirections.map((team) => team.name))),
    [availableDirections],
  );

  const allGroups = useMemo<Team[]>(
    () => allDirections?.flatMap((team) => team.subTeams ?? []) ?? [],
    [allDirections],
  );

  const availableGroups = useMemo<TeamItem[]>(
    () => allGroups?.filter((team) => access?.includes(team.id)) ?? [],
    [allGroups, access],
  );

  const groupNames = useMemo<string[]>(
    () => Array.from(new Set(availableGroups.map((team) => team.name))),
    [availableGroups],
  );

  const handleChange = (filters: TeamsHierarchyFilterType) => {
    onChange?.(filters);
  };

  return (
    <>
      <SearchSelect
        value={filters?.product ?? ''}
        label="Продукт"
        onChange={({ id }) =>
          handleChange({
            ...filters,
            product: id === '' ? undefined : String(id),
          })
        }
        options={[
          { id: '', name: 'Все продукты' },
          ...productNames.map((p) => ({ id: p, name: p })),
        ]}
      />
      <SearchSelect
        label="Департамент"
        value={filters?.department ?? ''}
        onChange={({ id }) =>
          handleChange({
            ...filters,
            department: id === '' ? undefined : String(id),
          })
        }
        options={[
          { id: '', name: 'Все департаменты' },
          ...departmentNames.map((d) => ({ id: d, name: d })),
        ]}
      />
      <SearchSelect
        label="Направление"
        value={filters?.direction ?? ''}
        onChange={({ id }) =>
          handleChange({
            ...filters,
            direction: id === '' ? undefined : String(id),
          })
        }
        options={[
          { id: '', name: 'Все направления' },
          ...directionNames.map((d) => ({ id: d, name: d })),
        ]}
      />
      <SearchSelect
        label="Группа"
        value={filters?.group ?? ''}
        onChange={({ id }) =>
          handleChange({
            ...filters,
            group: id === '' ? undefined : String(id),
          })
        }
        options={[
          { id: '', name: 'Все группы' },
          ...groupNames.map((g) => ({ id: g, name: g })),
        ]}
      />
    </>
  );
}

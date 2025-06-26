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
  const teams = data?.list;

  const accessedTeams = useMemo<Team[]>(
    () => teams?.filter((team) => access?.includes(team.id)) ?? [],
    [teams, access],
  );

  const availableProducts = useMemo<TeamItem[]>(
    () => map(structure?.filter((team) => access?.includes(team.id))),
    [structure, access],
  );

  const availableDepartments = useMemo<TeamItem[]>(
    () =>
      map(
        accessedTeams?.filter(
          (team) =>
            availableProducts.some(
              (product) => product.id === team.parentTeamId,
            ) &&
            (filters?.product === undefined ||
              team.parentTeamId === filters?.product),
        ),
      ),
    [accessedTeams, availableProducts, filters?.product],
  );

  const availableDirections = useMemo<TeamItem[]>(
    () =>
      map(
        accessedTeams?.filter(
          (team) =>
            availableDepartments.some(
              (department) => department.id === team.parentTeamId,
            ) &&
            (filters?.department === undefined ||
              team.parentTeamId === filters?.department),
        ),
      ),
    [accessedTeams, availableDepartments, filters?.department],
  );

  const availableGroups = useMemo<TeamItem[]>(
    () =>
      map(
        accessedTeams?.filter(
          (team) =>
            availableDirections.some(
              (direction) => direction.id === team.parentTeamId,
            ) &&
            (filters?.direction === undefined ||
              team.parentTeamId === filters?.direction),
        ),
      ),
    [accessedTeams, availableDirections, filters?.direction],
  );

  const handleChange = (
    filters: TeamsHierarchyFilterType,
    key: keyof TeamsHierarchyFilterType,
  ) => {
    const newFilters: TeamsHierarchyFilterType = {};

    newFilters.group = filters.group;

    newFilters.direction = filters.direction;
    if (newFilters.group && !newFilters.direction) {
      const team = accessedTeams.find((t) => t.id === newFilters.group)!;
      newFilters.direction = team.parentTeamId;
    }

    newFilters.department = filters.department;
    if (newFilters.direction && !newFilters.department) {
      const team = accessedTeams.find((t) => t.id === newFilters.direction)!;
      newFilters.department = team.parentTeamId;
    }

    newFilters.product = filters.product;

    if (newFilters.department && !newFilters.product) {
      const team = accessedTeams.find((t) => t.id === newFilters.department)!;
      newFilters.product = team.parentTeamId;
    }

    const keysOrder = ['product', 'department', 'direction', 'group'];
    const findIndex = keysOrder.indexOf(key);
    for (let i = findIndex + 1; i < keysOrder.length; i++) {
      const nextKey = keysOrder[i];
      newFilters[nextKey as keyof TeamsHierarchyFilterType] = undefined;
    }

    onChange?.(newFilters);
  };

  return (
    <>
      <SearchSelect
        value={filters?.product ?? -1}
        label="Продукт"
        onChange={({ id }) =>
          handleChange(
            { ...filters, product: id === -1 ? undefined : Number(id) },
            'product',
          )
        }
        options={[{ id: -1, name: 'Все продукты' }, ...availableProducts]}
      />
      <SearchSelect
        label="Департамент"
        value={filters?.department ?? -1}
        onChange={({ id }) =>
          handleChange(
            { ...filters, department: id === -1 ? undefined : Number(id) },
            'department',
          )
        }
        options={[
          { id: -1, name: 'Все департаменты' },
          ...availableDepartments,
        ]}
      />
      <SearchSelect
        label="Направление"
        value={filters?.direction ?? -1}
        onChange={({ id }) =>
          handleChange(
            { ...filters, direction: id === -1 ? undefined : Number(id) },
            'direction',
          )
        }
        options={[{ id: -1, name: 'Все направления' }, ...availableDirections]}
      />
      <SearchSelect
        label="Группа"
        value={filters?.group ?? -1}
        onChange={({ id }) =>
          handleChange(
            { ...filters, group: id === -1 ? undefined : Number(id) },
            'group',
          )
        }
        options={[{ id: -1, name: 'Все группы' }, ...availableGroups]}
      />
    </>
  );
}

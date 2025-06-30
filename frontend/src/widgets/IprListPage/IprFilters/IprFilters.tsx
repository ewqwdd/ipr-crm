import { PingCircle } from '@/shared/ui/PingCircle';
import { SoftButton } from '@/shared/ui/SoftButton';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  initialIprFilters,
  IprFilters as IprFiltersType,
  skillTypeOptions,
} from './config';
import { SearchSelect } from '@/shared/ui/SearchSelect';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { TeamsMultiSelect } from '@/widgets/TeamsMultiSelect';
import { useAppSelector } from '@/app';
import { teamsApi } from '@/shared/api/teamsApi';
import { DateObject } from 'react-multi-date-picker';
import { PeriodSelector } from '@/shared/ui/PeriodSelector';
import { StaticSelectFilter } from '@/shared/ui/StaticSelectFilter';
import { universalApi } from '@/shared/api/universalApi';
import { IprListPageType } from '../config';
import { Checkbox } from '@/shared/ui/Checkbox';

interface IprFiltersProps {
  filters: IprFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<IprFiltersType>>;
  type?: IprListPageType;
}

export default memo(function IprFilters({
  filters,
  setFilters,
  type,
}: IprFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: users } = usersApi.useGetUsersQuery();
  const { data: teams } = teamsApi.useGetTeamsQuery();
  const { data: specs } = universalApi.useGetSpecsQuery();
  const user = useAppSelector((state) => state.user.user);

  const changedFiltersCount = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          return acc + 1;
        }
      } else if (
        initialIprFilters[key as keyof typeof initialIprFilters] !== value
      ) {
        console.log(key);
        return acc + 1;
      }
      return acc;
    },
    0,
  );

  const onChangePeriod = useCallback(
    (value?: DateObject | DateObject[]) =>
      setFilters((prev) => ({ ...prev, period: value as DateObject[] })),
    [],
  );

  const onChangeSpec = useCallback(
    (value: string | number) =>
      setFilters((prev) => ({ ...prev, specId: value as number })),
    [setFilters],
  );

  const onChangeSkillType = useCallback(
    (value: string | number) =>
      setFilters((prev) => ({
        ...prev,
        skillType: value as IprFiltersType['skillType'],
      })),
    [setFilters],
  );

  const onChangeDeputyOnly = useCallback(
    (value?: boolean) => setFilters((prev) => ({ ...prev, deputyOnly: value })),
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(initialIprFilters);
  }, [setFilters]);

  const usersOptions = useMemo(() => {
    return [
      { name: 'Все', id: -1 },
      ...(users?.users.map((user) => {
        const userName = (user.firstName ?? '') + ' ' + (user.lastName ?? '');
        return {
          name: `${user.username} ${userName !== ' ' ? '~ ' + userName : ''}`,
          id: user.id,
        };
      }) || []),
    ];
  }, [users]);

  const disabledTeams = useMemo(
    () =>
      user?.role.name === 'admin'
        ? []
        : teams?.list
            .filter((team) => !user?.teamAccess?.includes(team.id))
            .map((team) => team.id),
    [user, teams],
  );

  const specsOptions = useMemo(() => {
    return specs?.map((spec) => ({ label: spec.name, value: spec.id })) || [];
  }, [specs]);

  return (
    <div className="max-sm:px-4 mt-6">
      <div className="flex gap-4 mb-4">
        <SoftButton className="relative" onClick={() => setIsOpen((s) => !s)}>
          Фильтры
          {changedFiltersCount !== 0 && (
            <PingCircle>{changedFiltersCount}</PingCircle>
          )}
        </SoftButton>
        {changedFiltersCount !== 0 && (
          <SoftButton
            onClick={() => {
              resetFilters();
              setIsOpen(false);
            }}
          >
            Сбросить
          </SoftButton>
        )}
      </div>
      {isOpen && (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <SearchSelect
            label="Пользователь"
            options={usersOptions}
            value={filters.userId}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, userId: value.id }))
            }
          />
          {type !== 'TEAM' && (
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Команды
              </span>
              <TeamsMultiSelect
                value={filters.teams}
                onChange={(newValue) =>
                  setFilters((prev) => ({ ...prev, teams: newValue }))
                }
                disabledTeams={disabledTeams}
              />
            </div>
          )}
          <PeriodSelector value={filters.period} onChange={onChangePeriod} />

          <StaticSelectFilter
            label="Специализации"
            options={specsOptions}
            onChange={onChangeSpec}
            value={filters.specId}
          />
          <StaticSelectFilter
            label="Навыки"
            options={skillTypeOptions}
            onChange={onChangeSkillType}
            value={filters.skillType}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              title="Только заместители"
              checked={filters.deputyOnly}
              onChange={() => onChangeDeputyOnly(!filters.deputyOnly)}
            />
          </div>
        </div>
      )}
    </div>
  );
});

import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, useState } from 'react';
import {
  initialFilters,
  progressOptions,
  skillTypeOptions,
} from './constatnts';
import { getChangedFilters } from './helpers';
import { Option } from '@/shared/types/Option';
import { MultiValue } from 'react-select';
import { DateObject } from 'react-multi-date-picker';
import { PingCircle } from '@/shared/ui/PingCircle';
import { Filters } from './types';
import { StaticSelectFilter } from '@/shared/ui/StaticSelectFilter';
import { UsersSelect } from '@/shared/ui/UsersSelect';
import { User } from '@/entities/user';
import { Checkbox } from '@/shared/ui/Checkbox';
import { PeriodSelector } from '@/shared/ui/PeriodSelector';
import { Rates360TableType } from '@/entities/rates';
import { TeamSelector } from '@/widgets/TeamSelector';

type OnChange = (value: string | number) => void;

interface RatesFiltersProps {
  teamsOptions: Option[];
  specsOptions: Option[];
  users: User[];
  filters: Filters;
  resetFilters: () => void;
  onChangeSkillType: OnChange;
  onChangeProgress: OnChange;
  onChangeTeams: (teams: MultiValue<Option>) => void;
  onChangeSpec: OnChange;
  onChangeUser: (value?: number) => void;
  onChangePeriod: (value?: DateObject | DateObject[]) => void;
  onChangeHidden: (value: boolean) => void;
  type: Rates360TableType;
  exclude?: (keyof Filters)[];
}

const RatesFilters: FC<RatesFiltersProps> = ({
  teamsOptions,
  specsOptions,
  users,
  filters,
  resetFilters,
  onChangeSkillType,
  onChangeProgress,
  onChangeTeams,
  onChangeSpec,
  onChangeUser,
  onChangePeriod,
  onChangeHidden,
  type,
  exclude = [],
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { changedFiltersCount } = getChangedFilters(initialFilters, filters);

  return (
    <div className="max-sm:px-4">
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
          {type !== 'TEAM' && !exclude.includes('teams') && (
            <TeamSelector
              options={teamsOptions}
              value={filters.teams}
              onChange={onChangeTeams}
            />
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <UsersSelect
              users={users}
              value={filters.userId === 'ALL' ? undefined : filters.userId}
              setValue={onChangeUser}
            />
          </div>
          {!exclude.includes('specId') && (
            <StaticSelectFilter
              label="Специализации"
              options={specsOptions}
              onChange={onChangeSpec}
              value={filters.specId}
            />
          )}
          {!exclude.includes('skillType') && (
            <StaticSelectFilter
              label="Навыки"
              options={skillTypeOptions}
              onChange={onChangeSkillType}
              value={filters.skillType}
            />
          )}
          {!exclude.includes('status') && (
            <StaticSelectFilter
              label="Прогресс"
              options={progressOptions}
              onChange={onChangeProgress}
              value={filters.status}
            />
          )}
          {!exclude.includes('period') && (
            <PeriodSelector value={filters.period} onChange={onChangePeriod} />
          )}
          <div className="flex 2xl:mt-5 max-xl:my-3 lg:col-span-3 xl:col-span-2 sm:col-span-2">
            <Checkbox
              title={'Архивные'}
              checked={!!filters.hidden}
              onChange={() => onChangeHidden(!filters.hidden)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RatesFilters;
